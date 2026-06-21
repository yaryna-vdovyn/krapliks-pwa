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

// Сховище розкладів у пам'яті (Ключ - це унікальний endpoint пристрою)
const pushJobs = {};

// 1. Початкова підписка
app.post('/api/subscribe', (req, res) => {
    res.status(201).json({ message: 'Підписку ініціалізовано.' });
});

// 2. НОВИЙ МАРШРУТ: Збереження черги сповіщень від клієнта
app.post('/api/sync-pushes', (req, res) => {
    const { subscription, queue, soundEnabled } = req.body;
    if (!subscription || !subscription.endpoint) return res.sendStatus(400);
    
    // Оновлюємо розклад для цього пристрою
    pushJobs[subscription.endpoint] = { subscription, queue, soundEnabled };
    console.log(`[Синхронізація] Оновлено розклад. Сповіщень у черзі: ${queue.length}`);
    res.sendStatus(200);
});

// 3. Тестовий пуш (для розробки)
app.post('/api/send-test-push', (req, res) => {
    const { title, body, playSound } = req.body;
    const payload = JSON.stringify({ title: title || 'Тест', body: body || 'Тест', playSound: playSound !== false });

    Promise.all(Object.values(pushJobs).map(job => webpush.sendNotification(job.subscription, payload)))
        .then(() => res.status(200).json({ message: 'Сповіщення успішно розіслані.' }))
        .catch(err => res.status(500).json({ error: err.toString() }));
});

// ==========================================
// CRON JOB: Працює кожну хвилину (24/7)
// ==========================================
cron.schedule('* * * * *', () => {
    const now = Date.now(); // Поточний час сервера в мілісекундах

    for (const endpoint in pushJobs) {
        const user = pushJobs[endpoint];
        
        user.queue = user.queue.filter(job => {
            // Якщо час події настав (і пройшло не більше 5 хв, щоб не спамити старими)
            if (now >= job.timestamp) {
                if (now - job.timestamp < 5 * 60 * 1000) {
                    const payload = JSON.stringify({
                        title: job.title,
                        body: job.body,
                        playSound: user.soundEnabled
                    });
                    
                    webpush.sendNotification(user.subscription, payload)
                        .then(() => console.log(`[Push Відправлено] ${job.title}`))
                        .catch(err => {
                            console.error('[Помилка Push]', err.statusCode);
                            // Якщо користувач відкликав дозвіл (410 Gone), видаляємо його з бази
                            if (err.statusCode === 410 || err.statusCode === 404) {
                                delete pushJobs[endpoint];
                            }
                        });
                }
                return false; // Видаляємо з черги після обробки
            }
            return true; // Залишаємо в черзі майбутні події
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});