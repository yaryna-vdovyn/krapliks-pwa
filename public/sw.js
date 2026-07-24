const CACHE_NAME = 'krapliks-cache-v42'; // Оновлено

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
    '/assets/icons/stats.svg',
    '/assets/icons/gripper.svg'
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

// === [ЩИТ ВІД ДУБЛІКАТІВ: Оперативна пам'ять Service Worker] ===
const recentlyShown = new Map();

function isDuplicateAndLock(text, timestamp) {
    const now = Date.now();
    // 1. У ключі залишаємо ВИКЛЮЧНО чисту назву ліків (без жодних хвилин та timeBucket!)
    const cleanText = (text || '').replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, '').toLowerCase().slice(0, 15);
    
    if (recentlyShown.has(cleanText)) {
        const lastTime = recentlyShown.get(cleanText);
        // 2. Якщо ліки з такою ж назвою вже показувалися протягом останніх 15 секунд — блокуємо дублікат
        if (now - lastTime < 15000) {
            console.log(`[Дублікат заблоковано] Пуш "${text}" вже виведено на екран.`);
            return true; 
        }
    }

    // 3. Записуємо в пам'ять тільки назву ліків і точний час показу
    recentlyShown.set(cleanText, now);

    // 4. Очищаємо стару пам'ять від записів, старших за 2 хвилини
    for (const [key, time] of recentlyShown) {
        if (now - time > 120000) recentlyShown.delete(key);
    }
    return false;
}

// Цей блок не чіпає базу, він лише розводить бульбашки на екрані з інтервалом у 2 секунди
let displayQueue = Promise.resolve();

function safeShowNotification(title, options) {
    displayQueue = displayQueue.then(() => {
        return self.registration.showNotification(title, options)
            .then(() => new Promise(resolve => setTimeout(resolve, 2000))); // Затримка 2 секунди
    }).catch(e => console.error('[SW] Помилка показу пуша:', e));
    return displayQueue;
}

// 1. ОБРОБНИК ПУШІВ З СЕРВЕРА (RENDER)
self.addEventListener('push', function(event) {
    if (!event.data) return;
    try {
        const data = event.data.json();
        
        if (isDuplicateAndLock(data.body || data.title, data.timestamp)) return;
        
        const unifiedTag = data.tag || 'krapliks_cloud';

        // Шукаємо правильний тип
        let detectedType = 'reminder';
        if (data.type) detectedType = data.type;
        else if (unifiedTag.includes('doctor')) detectedType = 'doctor';
        else if (unifiedTag.includes('expiry')) detectedType = 'expiry';
        else if (unifiedTag.includes('pause')) detectedType = 'pause';

        // --- ДОДАЙТЕ ЦЕЙ БЛОК: Гарантовано зберігаємо хмарний пуш як НЕПРОЧИТАНИЙ ---
        saveToIndexedDB({
            id: unifiedTag,
            titleText: data.title || 'Krapliks',
            text: data.body || 'Час капати!',
            timestamp: data.timestamp || Date.now(),
            isRead: false, 
            type: detectedType // Тепер тип визначається динамічно
        }).catch(() => {});
        
        const options = {
            body: data.body,
            icon: '/images/logoweb.png', 
            badge: '/images/badge-icon.png', 
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            silent: data.playSound === false, 
            requireInteraction: true,
            tag: data.tag || 'krapliks_cloud',
            renotify: false, // ВИПРАВЛЕНО: Забороняємо ОС повторно пікати при оновленні вікна
            data: { url: '/' }
        };

        if (data.timestamp && data.timestamp > Date.now() && 'showTrigger' in Notification.prototype && typeof TimestampTrigger !== 'undefined') {
            options.showTrigger = new TimestampTrigger(data.timestamp);
        }

        event.waitUntil(
            safeShowNotification(data.title || 'Krapliks', options)
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then(clients => {
                clients.forEach(client => client.postMessage({ type: 'PUSH_RECEIVED', data: data }));
            })
        );
    } catch (e) { console.error('Помилка обробки Push:', e); }
});

// 2. ОБРОБНИК ДЛЯ ЛОКАЛЬНОГО ПЛАНУВАННЯ
let fallbackTimeouts = []; // Масив для утримання резервних таймерів

self.addEventListener('message', event => {
    if (!event.data) return;
    
    if (event.data.type === 'CLEAR_OLD_TRIGGERS') {
        // 1. Очищаємо резервні таймери
        fallbackTimeouts.forEach(clearTimeout);
        fallbackTimeouts = [];
        
        // 2. Вбиваємо старі системні тригери
        if ('getNotifications' in self.registration) {
            event.waitUntil(
                self.registration.getNotifications({ includeTriggered: true }).then(notifs => {
                    notifs.forEach(n => { if (n.tag && n.tag.startsWith('auto-')) n.close(); });
                }).catch(() => {})
            );
        }

        // 3. ЗНИЩЕННЯ ПРИВИДІВ: Видаляємо з бази скасовані майбутні нагадування
        const req = indexedDB.open('KrapliksDB');
        req.onsuccess = (e) => {
            const db = e.target.result;
            if (db.objectStoreNames.contains('offline_notifs')) {
                const tx = db.transaction('offline_notifs', 'readwrite');
                const store = tx.objectStore('offline_notifs');
                const now = Date.now();
                
                store.openCursor().onsuccess = (cursorEvent) => {
                    const cursor = cursorEvent.target.result;
                    if (cursor) {
                        // Видаляємо ТІЛЬКИ ті таймери, час яких ще не настав
                        // Вже отримані пуші залишаються цілими!
                        if (cursor.value.timestamp > now) cursor.delete();
                        cursor.continue();
                    }
                };
            }
        };
        return;
    }

    if (event.data.type === 'SCHEDULE_NOTIFICATION') {
        const data = event.data;
        const targetTime = data.timestamp;
        const now = Date.now();
        const supportsTriggers = 'showTrigger' in Notification.prototype && typeof TimestampTrigger !== 'undefined';
        
        const safeText = data.body ? data.body.replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, '') : 'drop';
        const uniqueId = data.tag || (`notif_${targetTime}_${safeText}`);
        
        // Визначаємо правильний тип сповіщення на основі тегу
        let detectedType = 'reminder';
        if (event.data.notifType) detectedType = event.data.notifType;
        else if (uniqueId.includes('doctor')) detectedType = 'doctor';
        else if (uniqueId.includes('expiry')) detectedType = 'expiry';
        else if (uniqueId.includes('pause')) detectedType = 'pause';

        // Зберігаємо в IndexedDB
        saveToIndexedDB({
            id: uniqueId,
            titleText: data.title || 'Krapliks',
            text: data.body || 'Час капати!',
            timestamp: targetTime,
            isRead: false,
            type: detectedType // База отримує точний тип
        }).catch(() => {});

        const options = {
            body: data.body || 'Час капати!',
            icon: '/images/logoweb.png',
            badge: '/images/badge-icon.png',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: uniqueId,
            renotify: false, 
            requireInteraction: true,
            data: { url: '/' }
        };
        
        const triggerDisplay = () => {
            // ЗАХИСТ ВІД "РОЗМОРОЗКИ" IOS...
            if (Date.now() - targetTime > 60000) {
                console.log('[SW] Локальний таймер безнадійно запізнився. Скасовуємо.');
                return;
            }
            
            if (isDuplicateAndLock(data.body || data.title, targetTime)) return;
            safeShowNotification(data.title || 'Krapliks', options);
        };
        
        if (supportsTriggers && targetTime > now) {
            options.showTrigger = new TimestampTrigger(targetTime);
            event.waitUntil(self.registration.showNotification(data.title || 'Krapliks', options));
        } else if (targetTime > now) {
            const timerId = setTimeout(triggerDisplay, targetTime - now);
            fallbackTimeouts.push(timerId);
        } else {
            triggerDisplay();
        }
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

// --- 3. ОБРОБНИК ФОНОВОЇ СИНХРОНІЗАЦІЇ (BACKGROUND SYNC) ---
self.addEventListener('sync', event => {
    if (event.tag === 'sync-pushes-queue') {
        console.log('[SW Sync] З\'явився інтернет! Відправляємо чергу на сервер...');
        event.waitUntil(
            self.clients.matchAll({ type: 'window' }).then(clients => {
                // Сповіщаємо відкриту вкладку додатка, щоб вона повторила відправку fetch
                if (clients && clients.length > 0) {
                    clients[0].postMessage({ type: 'RETRY_SYNC' });
                }
            })
        );
    }
});

// === [ВИПРАВЛЕННЯ 2: Розумне збереження в базі без створення дублікатів] ===
function saveToIndexedDB(data) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KrapliksDB');
        request.onsuccess = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('offline_notifs')) {
                resolve(); return;
            }
            const tx = db.transaction('offline_notifs', 'readwrite');
            const store = tx.objectStore('offline_notifs');
            const getAllReq = store.getAll();
            
            getAllReq.onsuccess = function() {
                const allItems = getAllReq.result || [];
                const cleanNewText = (data.text || data.titleText || '').replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, '').toLowerCase();
                const newTime = data.timestamp || Date.now();
                
                // Шукаємо, чи немає вже в базі цих ліків з різницею в часі до 3 хвилин (180000 мс)
                const isDuplicate = allItems.some(item => {
                    const cleanExisting = (item.text || item.titleText || '').replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, '').toLowerCase();
                    const timeDiff = Math.abs((item.timestamp || 0) - newTime);
                    return cleanExisting === cleanNewText && timeDiff < 180000;
                });

                if (isDuplicate) {
                    console.log('[SW Storage] Цей препарат вже є в базі. Пропускаємо дублювання рядка.');
                    resolve();
                } else {
                    store.put(data);
                    resolve();
                }
            };
            tx.oncomplete = () => resolve();
        };
        request.onerror = () => reject();
    });
}