require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose'); // ДОДАНО: Підключаємо Mongoose

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ЗАБОРОНА КЕШУВАННЯ ДЛЯ SW.JS (Вставляти строго перед express.static)
app.use((req, res, next) => {
    if (req.url === '/sw.js') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// ОПЦІЇ ДЛЯ ВИСОКОГО ПРІОРИТЕТУ
const pushOptions = {
    TTL: 24 * 60 * 60,
    headers: {
        'Urgency': 'high' // Заголовок обов'язково з великої літери та всередині headers
    }
};

// --- 1. ПІДКЛЮЧЕННЯ ДО MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Успішно підключено до бази даних MongoDB!'))
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err));

// --- 2. СХЕМА ДАНИХ КОРИСТУВАЧА У ХМАРІ ---
const pushJobSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true }, // Унікальний ключ браузера
    subscription: { type: Object, required: true },           // Об'єкт підписки для webpush
    queue: { type: Array, default: [] },                      // Черга сповіщень
    soundEnabled: { type: Boolean, default: true },           // Налаштування звуку
    history: { type: Array, default: [] }                     // Історія сповіщень
});

const PushJob = mongoose.model('PushJob', pushJobSchema);

// --- ДОПОМІЖНА ФУНКЦІЯ ДЛЯ СТВОРЕННЯ ОБ'ЄКТА ІСТОРІЇ ---
function createHistoryItem(title, body) {
    let titleKey = 'notif_type_rem';
    let type = 'reminder';
    
    if (title.toLowerCase().includes('лікар') || title.toLowerCase().includes('doctor')) {
        titleKey = 'notif_type_doc';
        type = 'doctor';
    } else if (title.toLowerCase().includes('термін') || title.toLowerCase().includes('expir')) {
        titleKey = 'notif_type_exp';
        type = 'expiry';
    }
    
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        key: `server_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: type,
        titleKey: titleKey,
        text: body,
        isRead: false,
        timestamp: Date.now()
    };
}

// --- МАРШРУТИ API (ТЕПЕР АСИНХРОННІ ДЛЯ РОБОТИ З БД) ---

app.post('/api/subscribe', (req, res) => {
    res.status(201).json({ message: 'Підписку ініціалізовано.' });
});

app.post('/api/sync-pushes', async (req, res) => {
    try {
        const { subscription, queue, soundEnabled, localHistory } = req.body;
        if (!subscription || !subscription.endpoint) return res.sendStatus(400);

        // Шукаємо користувача в базі
        let user = await PushJob.findOne({ endpoint: subscription.endpoint });
        const existingHistory = user ? user.history : [];
        const incomingHistory = localHistory || [];

        // Об'єднуємо історію без дублікатів
        const historyMap = new Map();
        existingHistory.forEach(n => historyMap.set(n.id, n));
        incomingHistory.forEach(n => {
            if (!historyMap.has(n.id)) {
                historyMap.set(n.id, n);
            } else {
                if (n.isRead) historyMap.get(n.id).isRead = true;
            }
        });

        const mergedHistory = Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);

        // Зберігаємо або оновлюємо запис у MongoDB (upsert: true)
        await PushJob.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { 
                subscription, 
                queue, 
                soundEnabled: soundEnabled !== false, 
                history: mergedHistory 
            },
            { upsert: true, new: true }
        );

        console.log(`[MongoDB Синхронізація] Оновлено розклад. Черга: ${queue.length}, Історія: ${mergedHistory.length}`);
        res.sendStatus(200);
    } catch (err) {
        console.error('Помилка синхронізації з БД:', err);
        res.sendStatus(500);
    }
});

app.post('/api/notifications/get', async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!subscription || !subscription.endpoint) return res.status(400).json([]);
        const user = await PushJob.findOne({ endpoint: subscription.endpoint });
        res.json(user && user.history ? user.history : []);
    } catch (err) { 
        res.status(500).json([]); 
    }
});

app.post('/api/notifications/read-all', async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!subscription || !subscription.endpoint) return res.sendStatus(400);
        const user = await PushJob.findOne({ endpoint: subscription.endpoint });
        if (user && user.history) {
            user.history = user.history.map(n => ({ ...n, isRead: true }));
            await user.save();
        }
        res.sendStatus(200);
    } catch (err) { 
        res.sendStatus(500); 
    }
});

app.post('/api/notifications/clear', async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!subscription || !subscription.endpoint) return res.sendStatus(400);
        await PushJob.findOneAndUpdate({ endpoint: subscription.endpoint }, { history: [] });
        res.sendStatus(200);
    } catch (err) { 
        res.sendStatus(500); 
    }
});

app.post('/api/notifications/mark-read', async (req, res) => {
    try {
        const { subscription, id } = req.body;
        if (!subscription || !subscription.endpoint) return res.sendStatus(400);
        const user = await PushJob.findOne({ endpoint: subscription.endpoint });
        if (user && user.history) {
            const idx = user.history.findIndex(n => n.id === id);
            if (idx !== -1) {
                user.history[idx].isRead = true;
                await user.save();
            }
        }
        res.sendStatus(200);
    } catch (err) { 
        res.sendStatus(500); 
    }
});

app.post('/api/send-test-push', async (req, res) => {
    try {
        const { title, body, playSound } = req.body;
        const payload = JSON.stringify({ title: title || 'Тест', body: body || 'Тест', playSound: playSound !== false });
        
        const users = await PushJob.find({}); // Отримуємо всіх користувачів з хмари
        
        await Promise.all(users.map(async (user) => {
            try {
                await webpush.sendNotification(user.subscription, payload, pushOptions);
                const newNotif = createHistoryItem(title || 'Тест', body || 'Тест');
                user.history.unshift(newNotif);
                await user.save();
            } catch (err) { 
                console.error('[Тест Помилка]', err); 
            }
        }));
        
        res.status(200).json({ message: 'Сповіщення успішно розіслані.' });
    } catch (err) { 
        res.status(500).json({ error: err.toString() }); 
    }
});

app.post('/api/pause-push', async (req, res) => {
    const { subscription, title, body, delayMs, soundEnabled } = req.body;
    
    // Миттєво відповідаємо фронтенду, щоб він не чекав 10 хвилин
    res.sendStatus(200); 

    // Запускаємо одноразовий таймер суто в пам'яті сервера
    setTimeout(() => {
        const payload = JSON.stringify({
            title,
            body,
            playSound: soundEnabled !== false,
            tag: 'cloud_pause_' + Date.now(),
            type: 'pause',       // === ДОДАНО: Щоб вкладка впізнала паузу ===
            data: { url: '/' }   // === ДОДАНО: Щоб по кліку відкривався додаток ===
        });
        webpush.sendNotification(subscription, payload, pushOptions)
            .then(() => console.log(`[Хмарна пауза] Відправлено: ${body}`))
            .catch(() => console.log(`[Хмарна пауза] Помилка (пристрій офлайн)`));
    }, delayMs);
});

// --- CRON-ТАЙМЕР (ПЕРЕВІРКА ЧЕРГИ У ХМАРІ КОЖНУ ХВИЛИНУ) ---
cron.schedule('* * * * *', async () => {
    try {
        const now = Date.now();
        const users = await PushJob.find({}); 
        
        for (const user of users) {
            let isModified = false;
            let activeJobs = [];
            let remainingQueue = [];
            
            // 1. Сортуємо: що відправити зараз, а що залишити в черзі
            user.queue.forEach(job => {
                if (now >= job.timestamp) {
                    if (now - job.timestamp < 45 * 60 * 1000) activeJobs.push(job);
                    isModified = true;
                } else {
                    remainingQueue.push(job);
                }
            });
            
            // 2. БЕЗПЕЧНЕ ОНОВЛЕННЯ: Одразу зберігаємо очищену чергу без конфліктів Mongoose
            if (isModified) {
                await PushJob.updateOne({ _id: user._id }, { $set: { queue: remainingQueue } });
            }
            
            // 3. Відправляємо актуальні пуші і безпечно дописуємо їх в історію
            for (const job of activeJobs) {
                const payload = JSON.stringify({ title: job.title, body: job.body, playSound: user.soundEnabled });
                
                webpush.sendNotification(user.subscription, payload, pushOptions)
                    .then(async () => {
                        console.log(`[Push Відправлено з MongoDB] ${job.title}`);
                        const newNotif = createHistoryItem(job.title, job.body);
                        
                        // Використовуємо $push, щоб атомарно додати запис, не перезаписуючи весь документ!
                        await PushJob.updateOne(
                            { _id: user._id },
                            { $push: { history: { $each: [newNotif], $position: 0 } } }
                        );
                    })
                    .catch(async (err) => {
                        console.error('[Помилка Push]', err.statusCode);
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            await PushJob.deleteOne({ _id: user._id });
                            console.log('🗑️ Неактивну підписку видалено з MongoDB');
                        }
                    });
            }
        }
    } catch (err) {
        console.error('Помилка в роботі Cron-таймера з MongoDB:', err);
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('Я бадьорий і підключений до MongoDB!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на port ${PORT}`);
});