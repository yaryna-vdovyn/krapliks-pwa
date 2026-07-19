const CACHE_NAME = 'krapliks-cache-v10'; // Оновлено до v10 для активації запобіжника від спаму

// Список всіх файлів та іконок для офлайн-режиму
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/images/logoweb.png',
    '/images/badge-icon.png',
    '/images/default.png',
    '/images/dorzopt.webp',
    '/images/latasopt.webp',
    '/images/ektal.jpg',
    '/assets/icons/drops.svg',
    '/assets/icons/hourglass.svg',
    '/assets/icons/search.svg',
    '/assets/icons/add.svg',
    '/assets/icons/doctor.svg',
    '/assets/icons/data.svg',
    '/assets/icons/export.svg',
    '/assets/icons/import.svg',
    '/assets/icons/feedback.svg',
    '/assets/icons/warning.svg',
    '/assets/icons/stats.svg'
];

self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                urlsToCache.map(url => {
                    return cache.add(url).catch(err => console.error('Не знайдено файл для кешу:', url));
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim()) // Миттєво бере контроль над вкладками
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

// 1. ОБРОБНИК ПУШІВ З СЕРВЕРА
self.addEventListener('push', function(event) {
    if (!event.data) return;
    try {
        const data = event.data.json();
        const uniqueTag = data.tag || ('krapliks-med-' + Date.now() + '-' + Math.round(Math.random() * 1000));
        
        const options = {
            body: data.body,
            icon: '/images/logoweb.png', 
            badge: '/images/badge-icon.png', 
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            silent: data.playSound === false, 
            requireInteraction: true,
            tag: uniqueTag,
            renotify: true,
            data: { url: '/' }
        };

        // Підтримка Triggers API, якщо сервер надіслав мітку майбутнього часу
        if (data.timestamp && data.timestamp > Date.now() && 'showTrigger' in Notification.prototype && typeof TimestampTrigger !== 'undefined') {
            options.showTrigger = new TimestampTrigger(data.timestamp);
        }

        event.waitUntil(
            self.registration.showNotification(data.title, options)
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'PUSH_RECEIVED', data: data });
                });
            })
        );
    } catch (e) {
        console.error('Помилка обробки Push:', e);
    }
});

// 2. ОБРОБНИК ДЛЯ ЛОКАЛЬНОГО ОФЛАЙН-ПЛАНУВАННЯ (З SCRIPT.JS)
self.addEventListener('message', event => {
    if (!event.data || event.data.type !== 'SCHEDULE_NOTIFICATION') return;

    const data = event.data;
    const targetTime = data.timestamp; // Час спрацьовування у мілісекундах
    const now = Date.now();

    // 1. Перевіряємо, чи підтримує браузер тригери (Android Chrome/Samsung)
    const supportsTriggers = 'showTrigger' in Notification.prototype && typeof TimestampTrigger !== 'undefined';

    // 2. ЗАПОБІЖНИК ВІД СПАМУ НА ПК ТА iOS:
    // Якщо це пуш на майбутнє, АЛЕ пристрій не підтримує офлайн-таймери — перериваємо виконання!
    // Ми не виводимо сповіщення зараз, його надішле сервер Render у свій час.
    if (targetTime > now && !supportsTriggers) {
        console.log(`[Triggers API] ПК/iOS не підтримує офлайн-таймер. Пуш "${data.title}" залишено для сервера.`);
        return; 
    }

    const options = {
        body: data.body || 'Час капати!',
        icon: '/images/logoweb.png',
        badge: '/images/badge-icon.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: data.tag || ('krapliks-local-' + targetTime),
        renotify: true,
        requireInteraction: true,
        data: { url: '/' }
    };

    // Вмикаємо Notification Triggers API для підтримуваних Android-пристроїв
    if (supportsTriggers && targetTime > now) {
        options.showTrigger = new TimestampTrigger(targetTime);
        console.log(' [Triggers API] Заплановано точний офлайн-пуш на Android:', new Date(targetTime));
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'Krapliks', options)
        .catch(err => console.error('Помилка реєстрації тригера:', err))
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});