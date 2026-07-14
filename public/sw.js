const CACHE_NAME = 'krapliks-cache-v4'; // Оновлюємо версію на v4

// Список всіх файлів та іконок, які потрібно зберегти для офлайн-режиму
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/images/logoweb.png',
    '/images/badge-icon.png',
    '/images/default.png',       // ДОДАНО: Дефолтна картинка
    '/images/dorzopt.webp',      // ДОДАНО: Картинка препарату
    '/images/latasopt.webp',     // ДОДАНО: Картинка препарату
    '/images/ektal.jpg',         // ДОДАНО: Картинка препарату
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
            // Завантажуємо файли по одному. Якщо якогось немає - просто ігноруємо і йдемо далі!
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
        }).then(() => self.clients.claim()) // ДОДАНО: миттєво бере контроль над усіма вкладками
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', function(event) {
    if (!event.data) return;
    try {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/images/logoweb.png', 
            badge: '/images/badge-icon.png', 
            vibrate: [200, 100, 200, 100, 200, 100, 200], // Більш агресивна вібрація
            silent: data.playSound === false, 
            requireInteraction: true, // Залишає сповіщення на екрані до дії користувача
            data: { url: '/' }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then(clients => {
                // Надсилаємо сигнал у відкритий додаток, щоб оновити вкладку сповіщень
                clients.forEach(client => {
                    client.postMessage({ type: 'PUSH_RECEIVED', data: data });
                });
            })
        );
    } catch (e) {
        console.error('Помилка обробки Push:', e);
    }
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