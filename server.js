require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Сховище розкладів та історій у пам'яті (Ключ - це унікальний endpoint пристрою)
const pushJobs = {};

// Допоміжна функція для додавання сповіщення в історію конкретного пристрою
function addNotificationToHistory(endpoint, title, body) {
    if (!pushJobs[endpoint]) return;

    let titleKey = 'notif_type_rem';
    let type = 'reminder';

    if (title.includes('🩺') || title.toLowerCase().includes('лікар') || title.toLowerCase().includes('doctor')) {
        titleKey = 'notif_type_doc';
        type = 'doctor';
    } else if (title.includes('⚠️') || title.toLowerCase().includes('термін') || title.toLowerCase().includes('expir')) {
        titleKey = 'notif_type_exp';
        type = 'expiry';
    }

    const newNotif = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        key: `server_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: type,
        titleKey: titleKey,
        text: body,
        isRead: false,
        timestamp: Date.now()
    };

    pushJobs[endpoint].history = pushJobs[endpoint].history || [];
    pushJobs[endpoint].history.unshift(newNotif);
}

// 1. Початкова підписка
app.post('/api/subscribe', (req, res) => {
    res.status(201).json({ message: 'Підписку ініціалізовано.' });
});

// 2. Синхронізація розкладу та історії від клієнта
app.post('/api/sync-pushes', (req, res) => {
    const { subscription, queue, soundEnabled, localHistory } = req.body;
    if (!subscription || !subscription.endpoint) return res.sendStatus(400);
    
    const existingHistory = pushJobs[subscription.endpoint]?.history || [];
    const incomingHistory = localHistory || [];
    
    // Розумне об'єднання історій клієнта та сервера за унікальним ID
    const historyMap = new Map();
    existingHistory.forEach(n => historyMap.set(n.id, n));
    incomingHistory.forEach(n => {
        if (!historyMap.has(n.id)) {
            historyMap.set(n.id, n);
        } else {
            if (n.isRead) historyMap.get(n.id).isRead = true; // Синхронізуємо статус прочитання
        }
    });
    
    const mergedHistory = Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);

    pushJobs[subscription.endpoint] = { 
        subscription, 
        queue, 
        soundEnabled, 
        history: mergedHistory 
    };

    console.log(`[Синхронізація] Оновлено розклад. Черга: ${queue.length}, Історія: ${mergedHistory.length}`);
    res.sendStatus(200);
});

// 3. Маршрути для роботи з історією сповіщень
app.post('/api/notifications/get', (req, res) => {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json([]);
    const user = pushJobs[subscription.endpoint];
    res.json(user && user.history ? user.history : []);
});

app.post('/api/notifications/read-all', (req, res) => {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.sendStatus(400);
    if (pushJobs[subscription.endpoint]) {
        pushJobs[subscription.endpoint].history = (pushJobs[subscription.endpoint].history || []).map(n => ({ ...n, isRead: true }));
    }
    res.sendStatus(200);
});

app.post('/api/notifications/clear', (req, res) => {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.sendStatus(400);
    if (pushJobs[subscription.endpoint]) {
        pushJobs[subscription.endpoint].history = [];
    }
    res.sendStatus(200);
});

app.post('/api/notifications/mark-read', (req, res) => {
    const { subscription, id } = req.body;
    if (!subscription || !subscription.endpoint) return res.sendStatus(400);
    if (pushJobs[subscription.endpoint] && pushJobs[subscription.endpoint].history) {
        const idx = pushJobs[subscription.endpoint].history.findIndex(n => n.id === id);
        if (idx !== -1) pushJobs[subscription.endpoint].history[idx].isRead = true;
    }
    res.sendStatus(200);
});

// 4. Тестовий пуш
app.post('/api/send-test-push', (req, res) => {
    const { title, body, playSound } = req.body;
    const payload = JSON.stringify({ title: title || 'Тест', body: body || 'Тест', playSound: playSound !== false });

    Promise.all(Object.keys(pushJobs).map(endpoint => {
        return webpush.sendNotification(pushJobs[endpoint].subscription, payload)
            .then(() => {
                addNotificationToHistory(endpoint, title || 'Тест', body || 'Тест');
            })
            .catch(err => console.error('[Тест Помилка]', err));
    }))
    .then(() => res.status(200).json({ message: 'Сповіщення успішно розіслані.' }))
    .catch(err => res.status(500).json({ error: err.toString() }));
});

// ==========================================
// CRON JOB: Працює кожну хвилину (24/7)
// ==========================================
cron.schedule('* * * * *', () => {
    const now = Date.now();

    for (const endpoint in pushJobs) {
        const user = pushJobs[endpoint];
        
        user.queue = user.queue.filter(job => {
            if (now >= job.timestamp) {
                if (now - job.timestamp < 5 * 60 * 1000) {
                    const payload = JSON.stringify({
                        title: job.title,
                        body: job.body,
                        playSound: user.soundEnabled
                    });
                    
                    webpush.sendNotification(user.subscription, payload)
                        .then(() => {
                            console.log(`[Push Відправлено] ${job.title}`);
                            addNotificationToHistory(endpoint, job.title, job.body);
                        })
                        .catch(err => {
                            console.error('[Помилка Push]', err.statusCode);
                            if (err.statusCode === 410 || err.statusCode === 404) {
                                delete pushJobs[endpoint];
                            }
                        });
                }
                return false;
            }
            return true;
        });
    }
});

// 5. Маршрут для Keep Alive сервісів (UptimeRobot)
app.get('/health', (req, res) => {
    res.status(200).send('Я бадьорий!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на port ${PORT}`);
});