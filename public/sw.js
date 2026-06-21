self.addEventListener('push', function(event) {
    if (!event.data) return;

    try {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/images/logoweb.png', // Ваш основний кольоровий логотип
            badge: '/images/badge-icon.png', // ОНОВЛЕНО: Спеціальна монохромна іконка для Android
            vibrate: [200, 100, 200],
            // Якщо playSound === true, silent стає false (грає системний звук)
            silent: data.playSound === false, 
            data: {
                url: '/' // Куди переходити при кліку
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    } catch (e) {
        console.error('Помилка обробки Push-повідомлення:', e);
    }
});

// Обробка кліку по сповіщенню
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Перевіряємо, чи вікно додатка вже відкрито
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Якщо не відкрито, відкриваємо нове
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});