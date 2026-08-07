require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose'); // ДОДАНО: Підключаємо Mongoose
const { TelegramBot } = require('node-telegram-bot-api');

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
    userId: { type: String, required: true, unique: true }, // Головний постійний ключ
    endpoint: { type: String, default: null },              // Більше не унікальний
    subscription: { type: Object, default: null },          // Може бути null, якщо пуші злетіли
    queue: { type: Array, default: [] },
    soundEnabled: { type: Boolean, default: true },
    history: { type: Array, default: [] },
    telegramChatId: { type: String, default: null }, 
    telegramSyncCode: { type: String, default: null } 
});
const PushJob = mongoose.model('PushJob', pushJobSchema);

// --- ТЕЛЕГРАМ БОТ ---
const tgToken = process.env.TELEGRAM_BOT_TOKEN;
let bot;

if (tgToken) {
    bot = new TelegramBot(tgToken, { polling: true });
    console.log('🤖 Telegram Бот успішно запущено!');

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text ? msg.text.trim() : '';

        if (text === '/start') {
            return bot.sendMessage(chatId, '👋 Привіт! Відправте мені 6-значний код підключення з додатку Krapliks.');
        }

        const user = await PushJob.findOne({ telegramSyncCode: text });
        
        if (user) {
            user.telegramChatId = chatId.toString();
            user.telegramSyncCode = null; 
            await user.save();
            bot.sendMessage(chatId, '✅ <b>Успішно!</b> Тепер нагадування приходитимуть сюди.', { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(chatId, '❌ Неправильний або прострочений код. Згенеруйте новий у додатку.');
        }
    });
}

// --- ДОПОМІЖНА ФУНКЦІЯ ДЛЯ СТВОРЕННЯ ОБ'ЄКТА ІСТОРІЇ ---
function createHistoryItem(title, body, type = 'reminder', timestamp = Date.now()) {
    let titleKey = 'notif_type_rem';
    
    if (type === 'doctor') {
        titleKey = 'notif_type_doc';
    } else if (type === 'expiry') {
        titleKey = 'notif_type_exp';
    }
    
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        key: `server_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: type,
        titleKey: titleKey,
        text: body,
        isRead: false,
        timestamp: timestamp
    };
}

// --- МАРШРУТИ API (ТЕПЕР АСИНХРОННІ ДЛЯ РОБОТИ З БД) ---
app.post('/api/telegram/generate-code', async (req, res) => {
    try {
        const { userId, subscription } = req.body;
        if (!userId) return res.sendStatus(400);
        const code = Math.floor(100000 + Math.random() * 900000).toString(); 
        let user = await PushJob.findOne({ userId: userId });
        
        if (user) {
            user.telegramSyncCode = code;
            await user.save();
            res.json({ code, botUsername: process.env.TELEGRAM_BOT_USERNAME || 'krapliks_bot' }); 
        } else {
            res.status(404).json({ error: 'Спочатку активуйте веб-сповіщення!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
app.post('/api/subscribe', (req, res) => {
    res.status(201).json({ message: 'Підписку ініціалізовано.' });
});
app.post('/api/sync-pushes', async (req, res) => {
    try {
        const { userId, subscription, queue, soundEnabled, localHistory } = req.body;
        if (!userId) return res.sendStatus(400);
        let user = await PushJob.findOne({ userId: userId });
        const existingHistory = user ? user.history : [];
        const incomingHistory = localHistory || [];
        
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
        
        await PushJob.findOneAndUpdate(
            { userId: userId },
            { 
                endpoint: subscription ? subscription.endpoint : (user ? user.endpoint : null),
                subscription: subscription || (user ? user.subscription : null), 
                queue, 
                soundEnabled: soundEnabled !== false, 
                history: mergedHistory 
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log(`[MongoDB Синхронізація] Оновлено розклад для ${userId}.`);
        res.sendStatus(200);
    } catch (err) {
        console.error('Помилка синхронізації з БД:', err);
        res.sendStatus(500);
    }
});
app.post('/api/notifications/get', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json([]);
        const user = await PushJob.findOne({ userId: userId });
        res.json(user && user.history ? user.history : []);
    } catch (err) { res.status(500).json([]); }
});
app.post('/api/notifications/read-all', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.sendStatus(400);
        const user = await PushJob.findOne({ userId: userId });
        if (user && user.history) {
            user.history = user.history.map(n => ({ ...n, isRead: true }));
            await user.save();
        }
        res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
});
app.post('/api/notifications/clear', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.sendStatus(400);
        await PushJob.findOneAndUpdate({ userId: userId }, { history: [] });
        res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
});
app.post('/api/notifications/mark-read', async (req, res) => {
    try {
        const { userId, id } = req.body;
        if (!userId) return res.sendStatus(400);
        const user = await PushJob.findOne({ userId: userId });
        if (user && user.history) {
            const idx = user.history.findIndex(n => n.id === id);
            if (idx !== -1) {
                user.history[idx].isRead = true;
                await user.save();
            }
        }
        res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
});
app.post('/api/send-test-push', async (req, res) => {
    try {
        const { title, body, playSound } = req.body;
        const payload = JSON.stringify({ title: title || 'Тест', body: body || 'Тест', playSound: playSound !== false });
        const users = await PushJob.find({}); 
        
        await Promise.all(users.map(async (user) => {
            try {
                if (bot && user.telegramChatId) {
                    const tgMessage = `🧪 <b>${title || 'Тестове сповіщення'}</b>\n\n${body || 'Тест'}`;
                    bot.sendMessage(user.telegramChatId, tgMessage, { parse_mode: 'HTML' }).catch(e => {});
                }
                // ЗАХИСТ: Відправляємо пуш тільки якщо підписка активна
                if (user.subscription) {
                    await webpush.sendNotification(user.subscription, payload, pushOptions);
                }
                const newNotif = createHistoryItem(title || 'Тест', body || 'Тест');
                user.history.unshift(newNotif);
                await user.save();
            } catch (err) { console.error('[Тест Помилка]', err); }
        }));
        res.status(200).json({ message: 'Сповіщення успішно розіслані.' });
    } catch (err) { res.status(500).json({ error: err.toString() }); }
});
app.post('/api/pause-push', async (req, res) => {
    const { userId, subscription, title, body, delayMs, soundEnabled } = req.body;
    res.sendStatus(200); 
    setTimeout(async () => {
        const payload = JSON.stringify({
            title, body, playSound: soundEnabled !== false, tag: 'cloud_pause_' + Date.now(),
            type: 'pause', timestamp: Date.now(), data: { url: '/' }
        });
        if (subscription) {
            webpush.sendNotification(subscription, payload, pushOptions)
                .then(() => console.log(`[Хмарна пауза] Відправлено: ${body}`))
                .catch(() => console.log(`[Хмарна пауза] Помилка (пристрій офлайн)`));
        }
        if (bot && userId) {
            try {
                const user = await PushJob.findOne({ userId: userId });
                if (user && user.telegramChatId) {
                    bot.sendMessage(user.telegramChatId, `⏳ <b>${title}</b>\n\n${body}`, { parse_mode: 'HTML' }).catch(e => {});
                }
            } catch(e) {}
        }
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
                const taskTime = new Date(job.timestamp).getTime();
                
                // +5 секунд буфера для підстраховки мілісекунд Node.js
                if (now + 5000 >= taskTime) {
                    if (now - taskTime < 45 * 60 * 1000) activeJobs.push(job);
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
                const payload = JSON.stringify({ 
                    title: job.title, 
                    body: job.body, 
                    playSound: user.soundEnabled,
                    tag: job.tag,             // ДОДАНО: Передаємо унікальний тег для Android
                    type: job.type,           // ДОДАНО: Передаємо тип для правильних іконок
                    timestamp: job.timestamp  // ДОДАНО: Передаємо оригінальний час для антиспам-щита
                });
                
                if (bot && user.telegramChatId) {
                    let tgIcon = '💧';
                    if (job.type === 'doctor') tgIcon = '🩺';
                    if (job.type === 'expiry') tgIcon = '⚠️';
                    if (job.type === 'pause') tgIcon = '⏳'; // <-- ДОДАЙТЕ ЦЕЙ РЯДОК
                    
                    const tgMessage = `${tgIcon} <b>${job.title}</b>\n\n${job.body}`;
                    bot.sendMessage(user.telegramChatId, tgMessage, { parse_mode: 'HTML' }).catch(e => console.log('Помилка відправки в TG'));
                }

                // ЗАХИСТ: Відправляємо пуш тільки якщо підписка існує
                if (user.subscription) {
                    webpush.sendNotification(user.subscription, payload, pushOptions)
                        .then(async () => {
                            console.log(`[Push Відправлено з MongoDB] ${job.title}`);
                            const newNotif = createHistoryItem(job.title, job.body, job.type, job.timestamp);
                            await PushJob.updateOne(
                                { _id: user._id },
                                { $push: { history: { $each: [newNotif], $position: 0 } } }
                            );
                        })
                        .catch(async (err) => {
                            console.error('[Помилка Push]', err.statusCode);
                            if (err.statusCode === 410 || err.statusCode === 404) {
                                // ЗАМІСТЬ ВИДАЛЕННЯ: Відв'язуємо пуш, але зберігаємо Telegram і історію
                                await PushJob.updateOne(
                                    { _id: user._id },
                                    { $set: { subscription: null, endpoint: null } }
                                );
                                console.log('🗑️ Неактивну підписку відключено (Telegram збережено)');
                            }
                        });
                } else {
                    // Якщо пуша немає, але є Telegram — просто зберігаємо в історію
                    const newNotif = createHistoryItem(job.title, job.body, job.type, job.timestamp);
                    await PushJob.updateOne(
                        { _id: user._id },
                        { $push: { history: { $each: [newNotif], $position: 0 } } }
                    );
                }
            } // <-- ЗАКРИВАЄ for (const job of activeJobs)
        } // <-- ЗАКРИВАЄ for (const user of users)
    } catch (err) { // <-- ЗАКРИВАЄ try і ловить помилки Cron-таймера
        console.error('Помилка в роботі Cron-таймера:', err);
    }
}); // <-- ЗАКРИВАЄ cron.schedule

app.get('/health', (req, res) => {
    res.status(200).send('Я бадьорий і підключений до MongoDB!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на port ${PORT}`);
});