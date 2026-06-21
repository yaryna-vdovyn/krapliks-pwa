// --- СЛОВНИК ПЕРЕКЛАДІВ ---
const i18n = {
    ua: {
        app_title: "Krapliks",
        eye_left: "Ліве",
        eye_both: "Обидва",
        eye_right: "Праве",
        btn_drop: "Закапати",
        timer_wait: "⏳ Зачекайте",
        timer_before_next: "перед наступним",
        today_no_drops: "Сьогодні ще не капали",
        history_empty: "Історія порожня",
        my_meds: "Мої препарати",
        calendar_title: "Календар",
        notif_title: "Сповіщення",
        btn_manage: "Керування",
        btn_read_all: "Прочитати всі",
        btn_clear_notifs_history: "Очистити історію сповіщень",
        no_notifs: "Немає нових сповіщень.",
        sound_toggle: "Звук сповіщень:",
        visit_doctor: "Візит до лікаря",
        expiry_end: "Закінчення терміну",
        settings_title: "Налаштування",
        menu_add_med: "Додати новий препарат",
        menu_adv_notif: "Розширені сповіщення",
        menu_doctor: "Візит до лікаря",
        menu_data: "Дані (Експорт/Імпорт)",
        menu_language: "Мова",
        menu_feedback: "Залишити відгук",
        menu_theme: "Темна тема",
        notif_settings_title: "🔔 Розширені сповіщення",
        notif_mode: "Глобальний режим пуш-сповіщень:",
        notif_enabled: "Увімкнено (Звук + Банер)",
        notif_silent: "Без звуку (Лише банер)",
        notif_disabled: "Вимкнено (Лише в історії)",
        doctor_visits_title: "🩺 Візити до лікаря",
        btn_add: "Додати",
        add_med_title: "➕ Додати препарат",
        edit_med_title: "✏️ Редагувати препарат",
        med_name_ph: "Назва препарату...",
        date_opened: "Дата відкриття флакона:",
        exp_days: "Термін придатності (днів):",
        schedule_type: "Режим прийому:",
        sched_need: "Не фіксований",
        sched_interval: "Інтервал (у годинах)",
        sched_exact: "Конкретний час",
        sched_interval_ph: "Напр. 4 (кожні 4 години)",
        enable_reminder: "Надсилати нагадування перед прийомом:",
        reminder_offset: "Час нагадування про закапування:",
        remind_0: "Вчасно",
        remind_5: "За 5 хв",
        remind_10: "За 10 хв",
        remind_15: "За 15 хв",
        remind_off: "Вимкнено",
        block_btn_pause: "Пауза між препаратами:",
        pause_time_mins: "Час паузи (у хвилинах):",
        btn_save_med: "Зберегти препарат",
        btn_save_changes: "Зберегти зміни",
        feedback_title: "📝 Залишити відгук",
        feedback_email: "Ваш Email (обов'язково):",
        feedback_rating: "Оцінка додатка:",
        feedback_message: "Повідомлення (необов'язково):",
        btn_submit_feedback: "Відправити",
        feedback_success: "Дякуємо за відгук!",
        feedback_error: "Помилка відправки.",
        btn_import: "⬇️ Імпорт даних (.json)",
        btn_export: "⬆️ Експорт даних (Резервна копія)",
        dark_theme: "Темна тема",
        language_label: "Мова",
        nav_home: "Головна",
        nav_calendar: "Календар",
        nav_notifications: "Сповіщ.",
        nav_settings: "Налашт.",
        modal_drop_title: "Що закапуємо?",
        modal_details_title: "Деталі",
        success_drop: "Успішно!",
        enabled: "Увімкнено",
        disabled: "Вимкнено",
        empty_meds: "Немає доданих препаратів. Перейдіть у Налаштування.",
        days_left: "Залишилось: <span class=\"days-left\">{days} днів</span>",
        days_expired: "Термін вийшов <span class=\"days-left\">{days} днів</span> тому",
        last_day: "Закінчується <span class=\"days-left\">сьогодні</span>",
        status_active: "Активний",
        status_expired: "Прострочено",
        status_last_day: "Останній день",
        status_soon: "Скоро",
        next_dose: "Наступний:",
        today_at: "Сьогодні о ",
        tmrw_at: "Завтра о ",
        already_time: "Сьогодні (вже час)",
        time_to_drop: "Час капати!",
        find_tabletki: "💊 Знайти на Tabletki.ua",
        opened: "Відкрито:",
        term_days: "Термін: {days} дн.",
        today: "Сьогодні:",
        times: "раз(и)",
        alert_med_expired: "Препарат прострочено!",
        alert_delete_med: "Ви впевнені, що хочете видалити цей препарат?",
        alert_enter_name: "Введіть назву препарату",
        alert_choose_date: "Оберіть дату відкриття",
        alert_med_saved: "Препарат успішно збережено!",
        alert_no_active_meds: "У вас немає активних препаратів.",
        alert_delete_drop: "Видалити цей сеанс закапування?",
        alert_import_success: "Дані успішно відновлено!",
        alert_import_error: "Помилка імпорту. Неправильний формат або пошкоджений файл.",
        alert_missing_schedule: "Будь ласка, вкажіть час або інтервал для прийому",
        reminder_today: "СЬОГОДНІ",
        reminder_tmrw: "ЗАВТРА",
        reminder_days: "Через {days} дні(в)",
        reminder_text: "🩺 Нагадування: Візит до лікаря",
        modal_doctor_alert: "🩺 Заплановано візит до лікаря",
        modal_expiry_alert: "⚠️ Термін придатності <b>{name}</b> закінчується",
        modal_no_drops: "Немає записів про закапування за цей день.",
        last_time_today: "Останній раз: сьогодні о",
        notif_type_doc: "🩺 Візит до лікаря",
        notif_type_exp: "⚠️ Термін придатності",
        notif_type_rem: "💧 Нагадування про прийом",
        notif_timer_done: "Час капати! Кнопка розблокована.",
        months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
    },
    en: {
        app_title: "Krapliks",
        eye_left: "Left",
        eye_both: "Both",
        eye_right: "Right",
        btn_drop: "Drop",
        timer_wait: "⏳ Wait",
        timer_before_next: "before next",
        today_no_drops: "No drops today yet",
        history_empty: "History is empty",
        my_meds: "My Medications",
        calendar_title: "Calendar",
        notif_title: "Notifications",
        btn_manage: "Manage",
        btn_read_all: "Mark all read",
        btn_clear_notifs_history: "Clear notification history",
        no_notifs: "No new notifications.",
        sound_toggle: "Notification Sound:",
        visit_doctor: "Doctor Visit",
        expiry_end: "Expiration Date",
        settings_title: "Settings",
        menu_add_med: "Add new medication",
        menu_adv_notif: "Advanced notifications",
        menu_doctor: "Doctor Visit",
        menu_data: "Data (Export/Import)",
        menu_language: "Language",
        menu_feedback: "Leave feedback",
        menu_theme: "Dark Theme",
        notif_settings_title: "🔔 Advanced Notifications",
        notif_mode: "Global Push Mode:",
        notif_enabled: "Enabled (Sound + Banner)",
        notif_silent: "Silent (Banner only)",
        notif_disabled: "Disabled (History only)",
        doctor_visits_title: "🩺 Doctor Visits",
        btn_add: "Add",
        add_med_title: "➕ Add Medication",
        edit_med_title: "✏️ Edit Medication",
        med_name_ph: "Medication name...",
        date_opened: "Date opened:",
        exp_days: "Shelf life (days):",
        schedule_type: "Schedule:",
        sched_need: "Non-fixed",
        sched_interval: "Interval (in hours)",
        sched_exact: "Exact time",
        sched_interval_ph: "E.g. 4 (every 4 hours)",
        enable_reminder: "Send reminder before drop:",
        reminder_offset: "Drop reminder time:",
        remind_0: "On time",
        remind_5: "5 mins before",
        remind_10: "10 mins before",
        remind_15: "15 mins before",
        remind_off: "Disabled",
        block_btn_pause: "Pause between medications:",
        pause_time_mins: "Pause time (minutes):",
        btn_save_med: "Save",
        btn_save_changes: "Save changes",
        feedback_title: "📝 Leave Feedback",
        feedback_email: "Your Email (required):",
        feedback_rating: "App Rating:",
        feedback_message: "Message (optional):",
        btn_submit_feedback: "Submit",
        feedback_success: "Thank you for your feedback!",
        feedback_error: "Submission error.",
        btn_import: "⬇️ Import Data (.json)",
        btn_export: "⬆️ Export Data (Backup)",
        dark_theme: "Dark Theme",
        language_label: "Language",
        nav_home: "Home",
        nav_calendar: "Calendar",
        nav_notifications: "Alerts",
        nav_settings: "Settings",
        modal_drop_title: "Which medication?",
        modal_details_title: "Details",
        success_drop: "Success!",
        enabled: "Enabled",
        disabled: "Disabled",
        empty_meds: "No medications added. Go to Settings.",
        days_left: "<span class=\"days-left\">{days} days</span> left",
        days_expired: "Expired <span class=\"days-left\">{days} days</span> ago",
        last_day: "Expires <span class=\"days-left\">today</span>",
        status_active: "Active",
        status_expired: "Expired",
        status_last_day: "Last Day",
        status_soon: "Soon",
        next_dose: "Next:",
        today_at: "Today at ",
        tmrw_at: "Tomorrow at ",
        already_time: "Today (already time)",
        time_to_drop: "Time to drop!",
        find_tabletki: "💊 Find on Tabletki.ua",
        opened: "Opened:",
        term_days: "Shelf life: {days} d.",
        today: "Today:",
        times: "time(s)",
        alert_med_expired: "Medication is expired!",
        alert_delete_med: "Are you sure you want to delete this medication?",
        alert_enter_name: "Enter medication name",
        alert_choose_date: "Choose opening date",
        alert_med_saved: "Medication saved successfully!",
        alert_no_active_meds: "You have no active medications.",
        alert_delete_drop: "Delete this drop session?",
        alert_import_success: "Data restored successfully!",
        alert_import_error: "Import error. Invalid format or corrupted file.",
        alert_missing_schedule: "Please specify the time or interval for the medication",
        reminder_today: "TODAY",
        reminder_tmrw: "TOMORROW",
        reminder_days: "In {days} day(s)",
        reminder_text: "🩺 Reminder: Doctor visit",
        modal_doctor_alert: "🩺 Doctor visit scheduled",
        modal_expiry_alert: "⚠️ Expiration date for <b>{name}</b> is ending",
        modal_no_drops: "No drop records for this day.",
        last_time_today: "Last time: today at",
        notif_type_doc: "🩺 Doctor Visit",
        notif_type_exp: "⚠️ Expiration",
        notif_type_rem: "💧 Drop Reminder",
        notif_timer_done: "Time to drop! Button unlocked.",
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    }
};

let currentLang = localStorage.getItem('appLang') || 'ua';

function t(key) { return i18n[currentLang][key] || key; }

function updateStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) el.innerHTML = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
    });

    const weekdaysDiv = document.getElementById('calendar-weekdays');
    if (weekdaysDiv) weekdaysDiv.innerHTML = t('weekdays').map(w => `<span>${w}</span>`).join('');

    ['med-pause', 'edit-med-pause', 'med-reminder', 'edit-med-reminder', 'notif-sound'].forEach(prefix => {
        const toggleText = document.getElementById(`${prefix}-text`);
        const toggleInput = document.getElementById(`${prefix}-toggle`);
        if (toggleText && toggleInput) toggleText.innerText = toggleInput.checked ? t('enabled') : t('disabled');
    });
}

function translateEyeValue(eyeVal) {
    if (eyeVal === 'left' || eyeVal === 'Ліве') return t('eye_left');
    if (eyeVal === 'right' || eyeVal === 'Праве') return t('eye_right');
    return t('eye_both'); 
}

document.addEventListener('DOMContentLoaded', () => {

    function getLocalYMD(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.value = currentLang;
        langToggle.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('appLang', currentLang);
            updateStaticTranslations();
            renderMedications();
            renderCalendar();
            updateTodayStats();
            renderNotifications();
            syncPushesWithServer();
        });
    }
    updateStaticTranslations();

    // --- НАВІГАЦІЯ ТА ТЕМИ ---
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreenId = item.getAttribute('data-target');
            navItems.forEach(nav => nav.classList.remove('active'));
            screens.forEach(screen => screen.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(targetScreenId).classList.add('active');
            
            if(targetScreenId === 'screen-calendar') renderCalendar();
            if(targetScreenId === 'screen-home') renderMedications(); 
            if(targetScreenId === 'screen-notifications') renderNotifications();
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('appTheme') === 'dark') { body.classList.add('dark-theme'); if (themeToggleBtn) themeToggleBtn.checked = true; }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('change', () => {
            if (themeToggleBtn.checked) { body.classList.add('dark-theme'); localStorage.setItem('appTheme', 'dark'); } 
            else { body.classList.remove('dark-theme'); localStorage.setItem('appTheme', 'light'); }
        });
    }

    // --- МОДАЛЬНІ ВІКНА (УПРАВЛІННЯ) ---
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-open-modal');
            const modal = document.getElementById(modalId);
            if(modal) modal.style.display = 'flex';
        });
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').style.display = 'none';
        });
    });

    const medicationsDB = [
        { name: "Дорзопт плюс", image: "images/dorzopt.webp", link: "https://tabletki.ua/uk/%D0%94%D0%BE%D1%80%D0%B7%D0%BE%D0%BF%D1%82-%D0%BF%D0%BB%D1%8E%D1%81/38691/" },
        { name: "Латасопт", image: "images/latasopt.webp", link: "https://tabletki.ua/uk/%D0%9B%D0%B0%D1%82%D0%B0%D1%81%D0%BE%D0%BF%D1%82/39876/" },
        { name: "Ектал", image: "images/ektal.jpg", link: "https://tabletki.ua/uk/Ektal/1077228/" }
    ];
    const DEFAULT_ICON = "images/default.png"; 

    // --- РОЗШИРЕНІ СПОВІЩЕННЯ (Звук) ---
    const notifSoundToggle = document.getElementById('notif-sound-toggle');
    const notifSoundText = document.getElementById('notif-sound-text');
    const isSoundEnabled = localStorage.getItem('appSoundEnabled') !== 'false';
    
    if (notifSoundToggle) {
        notifSoundToggle.checked = isSoundEnabled;
        if(notifSoundText) notifSoundText.innerText = isSoundEnabled ? t('enabled') : t('disabled');
        
        notifSoundToggle.addEventListener('change', (e) => {
            localStorage.setItem('appSoundEnabled', e.target.checked);
            if(notifSoundText) notifSoundText.innerText = e.target.checked ? t('enabled') : t('disabled');
            syncPushesWithServer();
        });
    }

    function showPushToast(title, bodyText) {
        const toast = document.getElementById('push-toast');
        const tTitle = document.getElementById('push-toast-title');
        const tBody = document.getElementById('push-toast-body');
        if(!toast) return;

        tTitle.innerText = title;
        tBody.innerText = bodyText;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
    }

    function triggerPushNotification(key, type, titleKey, text) {
        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        if (!notifs.find(n => n.key === key)) {
            const newLocalNotif = { id: Date.now(), key, type, titleKey, text, isRead: false, timestamp: Date.now() };
            notifs.unshift(newLocalNotif);
            localStorage.setItem('appNotifications', JSON.stringify(notifs));
            updateBadge();
            showPushToast(t(titleKey), text);
            syncPushesWithServer(); // Синхронізуємо нову подію з сервером
        }
    }

    function updateBadge() {
        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        const badge = document.getElementById('nav-badge');
        const hasUnread = notifs.some(n => !n.isRead);
        if (badge) badge.style.display = hasUnread ? 'block' : 'none';
    }

    // ОНОВЛЕНА СИНХРОНІЗАЦІЯ ІСТОРІЇ З БЕКЕНДОМ
    async function renderNotifications() {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const reg = await navigator.serviceWorker.ready;
                const sub = await reg.pushManager.getSubscription();
                if (sub) {
                    const res = await fetch('/api/notifications/get', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subscription: sub })
                    });
                    if (res.ok) {
                        const serverNotifs = await res.json();
                        const localNotifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
                        
                        const historyMap = new Map();
                        localNotifs.forEach(n => historyMap.set(n.id, n));
                        serverNotifs.forEach(n => {
                            if (!historyMap.has(n.id)) {
                                historyMap.set(n.id, n);
                            } else {
                                if (n.isRead) historyMap.get(n.id).isRead = true;
                            }
                        });
                        
                        const merged = Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);
                        localStorage.setItem('appNotifications', JSON.stringify(merged));
                    }
                }
            } catch (e) {
                console.error('Помилка підтягування серверної історії:', e);
            }
        }

        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        list.innerHTML = '';

        if (notifs.length === 0) {
            list.innerHTML = `<p class="empty-state-text">${t('no_notifs')}</p>`;
            updateBadge(); return;
        }

        notifs.forEach(notif => {
            const card = document.createElement('div');
            card.className = `notif-card ${notif.isRead ? '' : 'unread'}`;
            const timeStr = new Date(notif.timestamp).toLocaleString('uk-UA', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
            
            card.innerHTML = `
                <div class="notif-title"><span>${t(notif.titleKey)}</span><span class="notif-time">${timeStr}</span></div>
                <div class="notif-body">${notif.text}</div>
            `;

            card.addEventListener('click', async () => {
                card.classList.toggle('expanded');
                if (!notif.isRead) {
                    notif.isRead = true;
                    card.classList.remove('unread');
                    const updatedNotifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
                    const index = updatedNotifs.findIndex(n => n.id === notif.id);
                    if (index !== -1) {
                        updatedNotifs[index].isRead = true;
                        localStorage.setItem('appNotifications', JSON.stringify(updatedNotifs));
                    }
                    updateBadge();

                    try {
                        const reg = await navigator.serviceWorker.ready;
                        const sub = await reg.pushManager.getSubscription();
                        if (sub) {
                            await fetch('/api/notifications/mark-read', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ subscription: sub, id: notif.id })
                            });
                        }
                    } catch(e){}
                }
            });
            list.appendChild(card);
        });
        updateBadge();
    }

    document.getElementById('btn-read-all')?.addEventListener('click', async () => {
        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        notifs.forEach(n => n.isRead = true);
        localStorage.setItem('appNotifications', JSON.stringify(notifs));
        renderNotifications();

        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await fetch('/api/notifications/read-all', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription: sub })
                });
            }
        } catch(e){}
    });

    document.getElementById('btn-modal-delete-all')?.addEventListener('click', async () => {
        localStorage.removeItem('appNotifications');
        renderNotifications();
        document.getElementById('modal-manage-notifs').style.display = 'none';

        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await fetch('/api/notifications/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription: sub })
                });
            }
        } catch(e){}
    });

    function checkScheduledNotifications() {
        const todayStr = getLocalYMD();
        const now = new Date();
        const currentHour = now.getHours();
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];

        if (currentHour >= 12) {
            const tmrw = new Date(now); tmrw.setDate(tmrw.getDate() + 1);
            const tmrwStr = getLocalYMD(tmrw);

            const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
            visits.forEach(vDateStr => {
                if (vDateStr === tmrwStr) triggerPushNotification(`doc_push_${vDateStr}`, 'doctor', 'notif_type_doc', `${t('reminder_tmrw')} (${new Date(vDateStr).toLocaleDateString('uk-UA')})`);
            });

            savedMeds.forEach(med => {
                const op = new Date(med.openedDate);
                op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
                if (getLocalYMD(op) === tmrwStr) {
                    triggerPushNotification(`exp_push_${med.id}_${tmrwStr}`, 'expiry', 'notif_type_exp', t('modal_expiry_alert').replace('{name}', med.name).replace(/<[^>]*>?/gm, ''));
                }
            });
        }

        savedMeds.forEach(med => {
            if(!med.scheduleType) return;
            if(med.reminderEnabled === false || med.reminderOffset === 'off') return; 

            const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
            const offsetMins = parseInt(med.reminderOffset) || 0;
            
            if(med.scheduleType === 'exact' && med.scheduleTimes && med.scheduleTimes.length > 0) {
                med.scheduleTimes.forEach(timeStr => {
                    const [h, m] = timeStr.split(':').map(Number);
                    const trig = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
                    trig.setMinutes(trig.getMinutes() - offsetMins);
                    if(now.getHours() === trig.getHours() && now.getMinutes() === trig.getMinutes()) {
                        triggerPushNotification(`ind_exact_${med.id}_${todayStr}_${timeStr}`, 'reminder', 'notif_type_rem', `${t('time_to_drop')} ${med.name}`);
                    }
                });
            } else if (med.scheduleType === 'interval' && med.scheduleValue) {
                const medDrops = history.filter(h => h.medId === med.id).sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
                if(medDrops.length > 0) {
                    const lastD = medDrops[medDrops.length - 1];
                    const nextT = new Date(new Date(`${lastD.date}T${lastD.time}`).getTime() + parseFloat(med.scheduleValue) * 60 * 60 * 1000);
                    nextT.setMinutes(nextT.getMinutes() - offsetMins);
                    if(now.getHours() === nextT.getHours() && now.getMinutes() === nextT.getMinutes() && now.getDate() === nextT.getDate() && now.getMonth() === nextT.getMonth()) {
                        triggerPushNotification(`ind_int_${med.id}_${lastD.date}_${lastD.time}`, 'reminder', 'notif_type_rem', `${t('time_to_drop')} ${med.name}`);
                    }
                }
            }
        });
    }

    setInterval(checkScheduledNotifications, 60000);
    setTimeout(checkScheduledNotifications, 2000);

    // --- ФОРМА ВІДГУКУ (FORMSPREE) ---
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }})
            .then(response => {
                if (response.ok) { 
                    alert(t('feedback_success')); 
                    this.reset(); 
                    document.getElementById('modal-feedback').style.display = 'none';
                } else alert(t('feedback_error'));
            }).catch(error => alert(t('feedback_error')));
        });
    }

    // --- ІМПОРТ ТА ЕКСПОРТ ---
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const data = {
            appMedications: JSON.parse(localStorage.getItem('appMedications')) || [],
            appDropHistory: JSON.parse(localStorage.getItem('appDropHistory')) || [],
            appDoctorVisits: JSON.parse(localStorage.getItem('appDoctorVisits')) || [],
            appNotifications: JSON.parse(localStorage.getItem('appNotifications')) || [],
            appTheme: localStorage.getItem('appTheme') || 'light',
            appLang: localStorage.getItem('appLang') || 'ua',
            appSoundEnabled: localStorage.getItem('appSoundEnabled') || 'true'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `drops-backup-${getLocalYMD()}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    });

    document.getElementById('file-import')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.appMedications) localStorage.setItem('appMedications', JSON.stringify(data.appMedications));
                if (data.appDropHistory) localStorage.setItem('appDropHistory', JSON.stringify(data.appDropHistory));
                if (data.appDoctorVisits) localStorage.setItem('appDoctorVisits', JSON.stringify(data.appDoctorVisits));
                if (data.appNotifications) localStorage.setItem('appNotifications', JSON.stringify(data.appNotifications));
                if (data.appTheme) localStorage.setItem('appTheme', data.appTheme);
                if (data.appLang) localStorage.setItem('appLang', data.appLang);
                if (data.appSoundEnabled) localStorage.setItem('appSoundEnabled', data.appSoundEnabled);
                alert(t('alert_import_success')); 
                syncPushesWithServer();
                location.reload(); 
            } catch (err) { alert(t('alert_import_error')); }
        };
        reader.readAsText(file);
    });

    function checkDoctorVisitsUI() {
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        const reminderDiv = document.getElementById('doctor-reminder');
        reminderDiv.style.display = 'none';
        if (visits.length === 0) return;

        const today = new Date(getLocalYMD());
        let closestVisit = null, minDiff = Infinity;
        visits.forEach(vDateStr => {
            const diffDays = Math.ceil((new Date(vDateStr) - today) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 2 && diffDays < minDiff) { minDiff = diffDays; closestVisit = { dateStr: vDateStr, days: diffDays }; }
        });

        if (closestVisit) {
            reminderDiv.style.display = 'block';
            let daysText = closestVisit.days === 0 ? t('reminder_today') : (closestVisit.days === 1 ? t('reminder_tmrw') : t('reminder_days').replace('{days}', closestVisit.days));
            reminderDiv.innerHTML = `${t('reminder_text')} ${daysText} (${new Date(closestVisit.dateStr).toLocaleDateString('uk-UA')})`;
        }
    }

    const doctorDateInput = document.getElementById('doctor-date-input');
    function renderDoctorVisits() {
        const list = document.getElementById('doctor-visits-list');
        if (!list) return;
        list.innerHTML = '';
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        visits.sort().forEach(dateStr => {
            const tag = document.createElement('div');
            tag.className = 'time-tag';
            tag.innerHTML = `${new Date(dateStr).toLocaleDateString('uk-UA')} <span>✖</span>`;
            tag.querySelector('span').addEventListener('click', () => {
                let currentVisits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
                localStorage.setItem('appDoctorVisits', JSON.stringify(currentVisits.filter(d => d !== dateStr)));
                renderDoctorVisits(); checkDoctorVisitsUI(); syncPushesWithServer();
            });
            list.appendChild(tag);
        });
    }

    document.getElementById('btn-add-doctor')?.addEventListener('click', () => {
        const dateVal = doctorDateInput.value;
        if(!dateVal) return;
        let visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        if(!visits.includes(dateVal)) {
            visits.push(dateVal); localStorage.setItem('appDoctorVisits', JSON.stringify(visits));
            renderDoctorVisits(); checkDoctorVisitsUI(); syncPushesWithServer();
        }
        doctorDateInput.value = '';
    });

    function calculateNextDose(medId, scheduleType, scheduleValue, scheduleTimes) {
        if (!scheduleType) return null;
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const medDrops = history.filter(h => h.medId === medId).sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
        const lastDrop = medDrops.length > 0 ? medDrops[medDrops.length - 1] : null;
        const now = new Date();

        if (scheduleType === 'interval' && scheduleValue) {
            if (!lastDrop) return t('already_time');
            const nextTime = new Date(new Date(`${lastDrop.date}T${lastDrop.time}`).getTime() + parseFloat(scheduleValue) * 60 * 60 * 1000);
            if (nextTime <= now) return t('time_to_drop');
            return (nextTime.getDate() !== now.getDate() || nextTime < now ? t('tmrw_at') : t('today_at')) + nextTime.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
        }

        if (scheduleType === 'exact' && scheduleTimes && scheduleTimes.length > 0) {
            let sortedTimes = [...scheduleTimes].sort();
            const currentStr = now.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
            let nextStr = sortedTimes.find(t => t > currentStr);
            return nextStr ? `${t('today_at')} ${nextStr}` : `${t('tmrw_at')} ${sortedTimes[0]}`;
        }
        return null;
    }

    // --- РЕНДЕР КАРТОК ПРЕПАРАТІВ ---
    const medsContainer = document.getElementById('medications-container');

    function renderMedications() {
        if (!medsContainer) return;
        medsContainer.innerHTML = '';
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        if (savedMeds.length === 0) {
            medsContainer.innerHTML = `<p class="empty-state-text">${t('empty_meds')}</p>`;
            return;
        }

        const today = new Date(getLocalYMD());

        savedMeds.forEach(med => {
            const openDate = new Date(med.openedDate); openDate.setHours(0, 0, 0, 0);
            const expDays = parseInt(med.expDays) || 28; 
            
            const expireDate = new Date(openDate); expireDate.setDate(expireDate.getDate() + expDays);
            const diffDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));

            let statusClass = 'status-ok', statusText = t('status_active'), isExpired = false;
            let daysText = t('days_left').replace('{days}', diffDays);

            if (diffDays <= 0) { statusClass = 'status-expired'; statusText = t('status_expired'); isExpired = true; daysText = t('days_expired').replace('{days}', Math.abs(diffDays) + 1); } 
            else if (diffDays === 1) { statusClass = 'status-warning'; statusText = t('status_last_day'); daysText = t('last_day'); } 
            else if (diffDays <= 5) { statusClass = 'status-warning'; statusText = t('status_soon'); }

            const nextDoseText = calculateNextDose(med.id, med.scheduleType, med.scheduleValue, med.scheduleTimes);
            const nextDoseHtml = nextDoseText ? `<div class="next-dose">${t('next_dose')} ${nextDoseText}</div>` : '';

            let searchUrl = `https://tabletki.ua/uk/${encodeURIComponent(med.name)}`;
            const knownMed = medicationsDB.find(m => m.name.toLowerCase() === med.name.toLowerCase());
            if (knownMed && knownMed.link) searchUrl = knownMed.link;
            
            let tabletkiBtnHtml = '';
            if (diffDays <= 3) {
                tabletkiBtnHtml = `<a href="${searchUrl}" target="_blank" class="btn-tabletki" title="${t('find_tabletki')}">${t('find_tabletki')}</a>`;
            }

            const card = document.createElement('div');
            card.className = `med-card ${isExpired ? 'expired' : ''}`;
            card.setAttribute('data-id', med.id);
            card.innerHTML = `
                <img src="${med.image}" alt="${med.name}" class="med-card-thumb" onerror="this.src='${DEFAULT_ICON}'">
                <div class="med-info">
                    <h3>${med.name}</h3>
                    <p>${t('opened')} ${openDate.toLocaleDateString('uk-UA')} (${t('term_days').replace('{days}', expDays)})</p>
                    <p>${daysText}</p>
                    ${nextDoseHtml}
                    <br>
                    ${tabletkiBtnHtml}
                </div>
                <div class="card-actions">
                    <div class="card-top-buttons">
                        <button class="icon-action-btn edit-med-btn" data-id="${med.id}" title="Edit">✏️</button>
                        <button class="icon-action-btn delete-med-btn" data-id="${med.id}" title="Delete">🗑️</button>
                    </div>
                    <div class="med-status ${statusClass}">${statusText}</div>
                </div>
            `;
            medsContainer.appendChild(card);
        });

        document.querySelectorAll('.delete-med-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if(confirm(t('alert_delete_med'))) {
                    let savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
                    savedMeds = savedMeds.filter(m => m.id !== parseInt(this.getAttribute('data-id')));
                    localStorage.setItem('appMedications', JSON.stringify(savedMeds));
                    renderMedications();
                    syncPushesWithServer();
                }
            });
        });

        document.querySelectorAll('.edit-med-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                openEditMedModal(parseInt(this.getAttribute('data-id')));
            });
        });
    }

    // --- ЛОГІКА РЕДАГУВАННЯ ПРЕПАРАТУ ---
    const modalEditMed = document.getElementById('modal-edit-med');
    const editMedIdInput = document.getElementById('edit-med-id');
    const editMedNameDisplay = document.getElementById('edit-med-name-display');
    
    const editMedScheduleType = document.getElementById('edit-med-schedule-type');
    const editMedScheduleValWrapper = document.getElementById('edit-med-schedule-val-wrapper');
    const editMedScheduleValInput = document.getElementById('edit-med-schedule-val');
    const editMedScheduleExactWrapper = document.getElementById('edit-med-schedule-exact-wrapper');
    const editTimeInputAdd = document.getElementById('edit-time-input-add');
    const btnEditAddTime = document.getElementById('edit-btn-add-time');
    const editAddedTimesList = document.getElementById('edit-added-times-list');
    let editExactTimesArray = [];
    
    const editMedReminderToggleWrapper = document.getElementById('edit-med-reminder-toggle-wrapper');
    const editMedReminderToggle = document.getElementById('edit-med-reminder-toggle');
    const editMedReminderOffsetWrapper = document.getElementById('edit-med-reminder-offset-wrapper');
    const editMedReminderText = document.getElementById('edit-med-reminder-text');
    const editMedReminderOffset = document.getElementById('edit-med-reminder-offset');

    const editMedPauseToggle = document.getElementById('edit-med-pause-toggle');
    const editMedPauseDurationWrapper = document.getElementById('edit-med-pause-duration-wrapper');
    const editMedPauseDuration = document.getElementById('edit-med-pause-duration');
    const editMedPauseText = document.getElementById('edit-med-pause-text');

    function renderEditExactTimes() {
        editAddedTimesList.innerHTML = '';
        editExactTimesArray.forEach(time => {
            const tag = document.createElement('div'); tag.className = 'time-tag'; tag.innerHTML = `${time} <span>✖</span>`;
            tag.querySelector('span').addEventListener('click', () => { editExactTimesArray = editExactTimesArray.filter(t => t !== time); renderEditExactTimes(); });
            editAddedTimesList.appendChild(tag);
        });
    }

    if (editMedScheduleType) {
        editMedScheduleType.addEventListener('change', (e) => {
            const type = e.target.value;
            editMedScheduleValWrapper.style.display = type === 'interval' ? 'block' : 'none';
            editMedScheduleExactWrapper.style.display = type === 'exact' ? 'block' : 'none';
            if (type !== 'exact') { editExactTimesArray = []; renderEditExactTimes(); }
            
            if (type === "") {
                if (editMedReminderToggleWrapper) editMedReminderToggleWrapper.style.display = 'none';
                if (editMedReminderOffsetWrapper) editMedReminderOffsetWrapper.style.display = 'none';
            } else {
                if (editMedReminderToggleWrapper) editMedReminderToggleWrapper.style.display = 'block';
                if (editMedReminderOffsetWrapper && editMedReminderToggle) {
                    editMedReminderOffsetWrapper.style.display = editMedReminderToggle.checked ? 'block' : 'none';
                }
            }
            if(editMedScheduleValInput) editMedScheduleValInput.classList.remove('error-border');
            if(editTimeInputAdd) editTimeInputAdd.classList.remove('error-border');
        });
    }

    if (btnEditAddTime) {
        btnEditAddTime.addEventListener('click', () => {
            const timeVal = editTimeInputAdd.value;
            if(!timeVal) return;
            if(!editExactTimesArray.includes(timeVal)) { 
                editExactTimesArray.push(timeVal); 
                editExactTimesArray.sort(); 
                renderEditExactTimes(); 
                editTimeInputAdd.classList.remove('error-border');
            }
            editTimeInputAdd.value = '';
        });
    }

    if(editMedScheduleValInput) editMedScheduleValInput.addEventListener('input', () => editMedScheduleValInput.classList.remove('error-border'));
    if(editTimeInputAdd) editTimeInputAdd.addEventListener('input', () => editTimeInputAdd.classList.remove('error-border'));

    function openEditMedModal(medId) {
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const med = savedMeds.find(m => m.id === medId);
        if(!med) return;

        editMedIdInput.value = med.id;
        editMedNameDisplay.innerText = med.name;

        editMedScheduleType.value = med.scheduleType || "";
        editMedScheduleValWrapper.style.display = med.scheduleType === 'interval' ? 'block' : 'none';
        editMedScheduleExactWrapper.style.display = med.scheduleType === 'exact' ? 'block' : 'none';
        editMedScheduleValInput.value = med.scheduleValue || "";
        editExactTimesArray = med.scheduleTimes ? [...med.scheduleTimes] : [];
        renderEditExactTimes();
        
        const isRemEnabled = med.reminderEnabled !== undefined ? med.reminderEnabled : (med.reminderOffset !== 'off');
        if(editMedReminderToggle) editMedReminderToggle.checked = isRemEnabled;
        if(editMedReminderText) editMedReminderText.innerText = isRemEnabled ? t('enabled') : t('disabled');
        if(editMedReminderOffset) editMedReminderOffset.value = (med.reminderOffset && med.reminderOffset !== 'off') ? med.reminderOffset : "0";
        
        if (editMedReminderToggleWrapper) editMedReminderToggleWrapper.style.display = (med.scheduleType === "") ? 'none' : 'block';
        if (editMedReminderOffsetWrapper) editMedReminderOffsetWrapper.style.display = (med.scheduleType !== "" && isRemEnabled) ? 'block' : 'none';

        const isPauseEnabled = med.pauseEnabled !== undefined ? med.pauseEnabled : false;
        if(editMedPauseToggle) editMedPauseToggle.checked = isPauseEnabled;
        if(editMedPauseDuration) editMedPauseDuration.value = med.pauseDuration || 10;
        if(editMedPauseDurationWrapper) editMedPauseDurationWrapper.style.display = isPauseEnabled ? 'block' : 'none';
        if(editMedPauseText) editMedPauseText.innerText = isPauseEnabled ? t('enabled') : t('disabled');

        if(editMedScheduleValInput) editMedScheduleValInput.classList.remove('error-border');
        if(editTimeInputAdd) editTimeInputAdd.classList.remove('error-border');

        modalEditMed.style.display = 'flex';
    }

    if (editMedReminderToggle) {
        editMedReminderToggle.addEventListener('change', (e) => {
            editMedReminderOffsetWrapper.style.display = e.target.checked ? 'block' : 'none';
            if(editMedReminderText) editMedReminderText.innerText = e.target.checked ? t('enabled') : t('disabled');
        });
    }

    if (editMedPauseToggle) {
        editMedPauseToggle.addEventListener('change', (e) => {
            editMedPauseDurationWrapper.style.display = e.target.checked ? 'block' : 'none';
            if(editMedPauseText) editMedPauseText.innerText = e.target.checked ? t('enabled') : t('disabled');
        });
    }

    document.getElementById('save-edit-med-btn')?.addEventListener('click', () => {
        const medId = parseInt(editMedIdInput.value);
        let savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const index = savedMeds.findIndex(m => m.id === medId);
        
        if(index !== -1) {
            const scheduleType = editMedScheduleType.value;
            if (scheduleType === 'interval') {
                if (!editMedScheduleValInput.value.trim()) {
                    alert(t('alert_missing_schedule'));
                    editMedScheduleValInput.classList.add('error-border');
                    return;
                }
            } else if (scheduleType === 'exact') {
                if (editExactTimesArray.length === 0) {
                    alert(t('alert_missing_schedule'));
                    editTimeInputAdd.classList.add('error-border');
                    return;
                }
            }

            savedMeds[index].scheduleType = scheduleType;
            savedMeds[index].scheduleValue = editMedScheduleValInput.value;
            savedMeds[index].scheduleTimes = [...editExactTimesArray];
            savedMeds[index].reminderEnabled = editMedReminderToggle.checked;
            savedMeds[index].reminderOffset = editMedReminderOffset.value;
            savedMeds[index].pauseEnabled = editMedPauseToggle.checked;
            savedMeds[index].pauseDuration = parseInt(editMedPauseDuration.value) || 10;
            localStorage.setItem('appMedications', JSON.stringify(savedMeds));
            
            modalEditMed.style.display = 'none';
            renderMedications();
            syncPushesWithServer();
        }
    });

    // --- ЛОГІКА ТАЙМЕРА ПАУЗИ ---
    const btnDrop = document.getElementById('btn-drop');
    const timerDisplay = document.getElementById('timer-display');
    const timerTimeSpan = document.getElementById('timer-time');
    const lastActionText = document.getElementById('last-action-text');
    const todayStatsContainer = document.getElementById('today-stats');
    
    let dropTimerInterval;

    function updateTimerUI(remainingMs) {
        const totalSeconds = Math.floor(remainingMs / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        if (timerTimeSpan) timerTimeSpan.innerText = `${minutes}:${seconds}`;
    }

    function finishTimer() {
        clearInterval(dropTimerInterval);
        if (btnDrop) btnDrop.disabled = false;
        if (timerDisplay) timerDisplay.style.display = 'none';
        localStorage.removeItem('appTimerEndTime');
        
        triggerPushNotification(`timer_done_${Date.now()}`, 'reminder', 'notif_type_rem', t('notif_timer_done'));
    }

    function startTimer(endTime) {
        clearInterval(dropTimerInterval);
        if (btnDrop) btnDrop.disabled = true;
        if (timerDisplay) timerDisplay.style.display = 'block';

        function tick() {
            const remaining = endTime - Date.now();
            if (remaining <= 0) finishTimer(); else updateTimerUI(remaining);
        }
        tick(); dropTimerInterval = setInterval(tick, 1000);
    }

    function checkTimerOnLoad() {
        const endTimeStr = localStorage.getItem('appTimerEndTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (Date.now() < endTime) startTimer(endTime); else localStorage.removeItem('appTimerEndTime');
        }
    }

    function updateTodayStats() {
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const todayDrops = history.filter(item => item.date === getLocalYMD());

        if (todayDrops.length === 0) {
            todayStatsContainer.innerHTML = `<p>${t('history_empty')}</p>`;
            lastActionText.innerText = t('today_no_drops');
            return;
        }

        const lastDrop = todayDrops[todayDrops.length - 1];
        lastActionText.innerText = `${t('last_time_today')} ${lastDrop.time} (${lastDrop.medName}, ${translateEyeValue(lastDrop.eye)})`;

        const stats = {};
        todayDrops.forEach(d => { stats[d.medName] = (stats[d.medName] || 0) + 1; });
        let html = `<p><strong>${t('today')}</strong></p>`;
        for (const [name, count] of Object.entries(stats)) html += `<span class="stat-pill">${name}: ${count} ${t('times')}</span>`;
        todayStatsContainer.innerHTML = html;
    }

    const dropModal = document.getElementById('drop-modal');
    const dropModalList = document.getElementById('drop-modal-list');
    const dropModalSuccess = document.getElementById('drop-modal-success');

    document.getElementById('drop-modal-close').addEventListener('click', () => { dropModal.style.display = 'none'; });

    if (btnDrop) {
        btnDrop.addEventListener('click', () => {
            btnDrop.blur();
            if (btnDrop.disabled) return;
            
            const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
            const today = new Date(getLocalYMD());

            const activeMeds = savedMeds.filter(med => {
                const op = new Date(med.openedDate); op.setHours(0,0,0,0);
                const expireDate = new Date(op); expireDate.setDate(expireDate.getDate() + (parseInt(med.expDays) || 28));
                return expireDate > today; 
            });

            if (activeMeds.length === 0) { alert(t('alert_no_active_meds')); return; }

            dropModalList.style.display = 'flex';
            dropModalSuccess.style.display = 'none';
            dropModalList.innerHTML = '';
            
            activeMeds.forEach(med => {
                const item = document.createElement('div');
                item.className = 'drop-med-item';
                item.innerHTML = `<img src="${med.image}" alt="${med.name}" class="drop-med-thumb" onerror="this.src='${DEFAULT_ICON}'"> <span class="drop-med-name">${med.name}</span>`;
                
                item.addEventListener('click', () => {
                    dropModalList.style.display = 'none';
                    dropModalSuccess.style.display = 'block';
                    
                    setTimeout(() => {
                        executeDrop(med);
                        dropModal.style.display = 'none';
                    }, 1500);
                });
                dropModalList.appendChild(item);
            });
            dropModal.style.display = 'flex';
        });
    }

    function executeDrop(med) {
        const eyeRadios = document.getElementsByName('eye');
        let selectedEye = 'both';
        for (let r of eyeRadios) if (r.checked) selectedEye = r.value;

        const now = new Date();
        const newDropRecord = {
            id: Date.now(), medId: med.id, medName: med.name, eye: selectedEye,
            date: getLocalYMD(now), time: now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) 
        };

        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        history.push(newDropRecord);
        localStorage.setItem('appDropHistory', JSON.stringify(history));

        const isPauseEnabled = med.pauseEnabled !== undefined ? med.pauseEnabled : false; 
        const pauseMins = med.pauseDuration || 10;

        if (isPauseEnabled) {
            const endTimeMs = Date.now() + (pauseMins * 60 * 1000);
            localStorage.setItem('appTimerEndTime', endTimeMs.toString());
            startTimer(endTimeMs);
        } else {
            if (btnDrop) { 
                btnDrop.style.transform = 'scale(1.1)'; 
                setTimeout(() => btnDrop.style.transform = '', 150); 
            }
        }

        updateTodayStats(); renderMedications(); 
        if(document.getElementById('screen-calendar').classList.contains('active')) renderCalendar();
        syncPushesWithServer();
    }

    // --- КАЛЕНДАР ---
    let currentCalDate = new Date();
    const calendarGrid = document.getElementById('calendar-grid');
    const dayModal = document.getElementById('day-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-date-title');

    function deleteDropSession(dropId) {
        if(confirm(t('alert_delete_drop'))) {
            let history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
            history = history.filter(h => h.id !== dropId);
            localStorage.setItem('appDropHistory', JSON.stringify(history));
            dayModal.style.display = 'none'; renderCalendar(); updateTodayStats(); renderMedications();
            syncPushesWithServer();
        }
    }

    function renderCalendar() {
        if(!calendarGrid) return;
        calendarGrid.innerHTML = '';
        const year = currentCalDate.getFullYear(); const month = currentCalDate.getMonth();
        document.getElementById('calendar-month-year').innerText = `${t('months')[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let emptyDays = firstDay === 0 ? 6 : firstDay - 1;

        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const doctorVisitsSet = new Set(JSON.parse(localStorage.getItem('appDoctorVisits')) || []);
        
        const daysWithDrops = new Set(history.map(item => item.date));
        const expiryDates = new Set();
        
        savedMeds.forEach(med => {
            const op = new Date(med.openedDate); op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
            expiryDates.add(getLocalYMD(op));
        });

        const todayStr = getLocalYMD();

        for (let i = 0; i < emptyDays; i++) {
            const emptyDiv = document.createElement('div'); emptyDiv.className = 'cal-day empty';
            calendarGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div'); dayDiv.className = 'cal-day'; dayDiv.innerText = day;
            const cellDate = new Date(year, month, day); const cellDateStr = getLocalYMD(cellDate);
            const indicatorsDiv = document.createElement('div'); indicatorsDiv.className = 'cal-indicators';

            if (daysWithDrops.has(cellDateStr)) dayDiv.classList.add('completed');
            if (cellDateStr === todayStr) dayDiv.classList.add('active-day');
            if (doctorVisitsSet.has(cellDateStr)) indicatorsDiv.innerHTML += '<span class="dot dot-doctor"></span>';
            if (expiryDates.has(cellDateStr)) indicatorsDiv.innerHTML += '<span class="dot dot-expiry"></span>';
            
            dayDiv.appendChild(indicatorsDiv);

            dayDiv.addEventListener('click', () => {
                const dayHistory = history.filter(h => h.date === cellDateStr);
                modalTitle.innerText = `${t('modal_details_title')}: ${cellDate.toLocaleDateString('uk-UA')}`;
                let modalContentHtml = '';

                if (doctorVisitsSet.has(cellDateStr)) modalContentHtml += `<div class="modal-alert doctor-alert">${t('modal_doctor_alert')}</div>`;
                const expiringMeds = savedMeds.filter(med => {
                    const op = new Date(med.openedDate); op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
                    return getLocalYMD(op) === cellDateStr;
                });
                expiringMeds.forEach(med => { modalContentHtml += `<div class="modal-alert expiry-alert">${t('modal_expiry_alert').replace('{name}', med.name)}</div>`; });

                if(dayHistory.length === 0) {
                    modalContentHtml += `<p class="empty-state-text">${t('modal_no_drops')}</p>`;
                    modalBody.innerHTML = modalContentHtml;
                } else {
                    modalBody.innerHTML = modalContentHtml; 
                    dayHistory.forEach(drop => {
                        const item = document.createElement('div'); item.className = 'modal-list-item';
                        item.innerHTML = `<div class="history-info"><span class="history-time">${drop.time}</span> ${drop.medName} (${translateEyeValue(drop.eye)})</div><button class="icon-action-btn delete-med-btn" title="Delete">🗑️</button>`;
                        item.querySelector('button').addEventListener('click', () => deleteDropSession(drop.id));
                        modalBody.appendChild(item);
                    });
                }
                dayModal.style.display = 'flex';
            });
            calendarGrid.appendChild(dayDiv);
        }
    }

    document.getElementById('cal-prev-month')?.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('cal-next-month')?.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendar(); });

    // --- ДОДАВАННЯ ПРЕПАРАТУ ---
    const medInput = document.getElementById('med-name-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    const medDateInput = document.getElementById('med-date-input');
    const medExpDaysInput = document.getElementById('med-exp-days');
    const saveMedBtn = document.getElementById('save-med-btn');
    
    const medScheduleType = document.getElementById('med-schedule-type');
    const medScheduleValWrapper = document.getElementById('med-schedule-val-wrapper');
    const medScheduleValInput = document.getElementById('med-schedule-val');
    
    const medScheduleExactWrapper = document.getElementById('med-schedule-exact-wrapper');
    const timeInputAdd = document.getElementById('time-input-add');
    const btnAddTime = document.getElementById('btn-add-time');
    const addedTimesList = document.getElementById('added-times-list');

    const medReminderToggleWrapper = document.getElementById('med-reminder-toggle-wrapper');
    const medReminderToggle = document.getElementById('med-reminder-toggle');
    const medReminderOffsetWrapper = document.getElementById('med-reminder-offset-wrapper');
    const medReminderText = document.getElementById('med-reminder-text');
    const medReminderOffsetInput = document.getElementById('med-reminder-offset');

    const medPauseToggle = document.getElementById('med-pause-toggle');
    const medPauseDurationWrapper = document.getElementById('med-pause-duration-wrapper');
    const medPauseDuration = document.getElementById('med-pause-duration');
    const medPauseText = document.getElementById('med-pause-text');
    
    let currentSelectedImage = DEFAULT_ICON;
    let exactTimesArray = [];

    if (medDateInput) medDateInput.value = getLocalYMD(); 

    if (medScheduleType) {
        medScheduleType.addEventListener('change', (e) => {
            const type = e.target.value;
            medScheduleValWrapper.style.display = type === 'interval' ? 'block' : 'none';
            medScheduleExactWrapper.style.display = type === 'exact' ? 'block' : 'none';
            if (type !== 'exact') { exactTimesArray = []; renderExactTimes(); }
            
            if (type === "") {
                if (medReminderToggleWrapper) medReminderToggleWrapper.style.display = 'none';
                if (medReminderOffsetWrapper) medReminderOffsetWrapper.style.display = 'none';
            } else {
                if (medReminderToggleWrapper) medReminderToggleWrapper.style.display = 'block';
                if (medReminderOffsetWrapper && medReminderToggle) medReminderOffsetWrapper.style.display = medReminderToggle.checked ? 'block' : 'none';
            }
            if(medScheduleValInput) medScheduleValInput.classList.remove('error-border');
            if(timeInputAdd) timeInputAdd.classList.remove('error-border');
        });
    }

    if (btnAddTime) {
        btnAddTime.addEventListener('click', () => {
            const timeVal = timeInputAdd.value;
            if(!timeVal) return;
            if(!exactTimesArray.includes(timeVal)) { 
                exactTimesArray.push(timeVal); 
                exactTimesArray.sort(); 
                renderExactTimes(); 
                timeInputAdd.classList.remove('error-border');
            }
            timeInputAdd.value = '';
        });
    }

    if(medInput) medInput.addEventListener('input', function() { this.classList.remove('error-border'); });
    if(medDateInput) { medDateInput.addEventListener('input', () => medDateInput.classList.remove('error-border')); medDateInput.addEventListener('change', () => medDateInput.classList.remove('error-border')); }
    if(medScheduleValInput) medScheduleValInput.addEventListener('input', () => medScheduleValInput.classList.remove('error-border'));
    if(timeInputAdd) timeInputAdd.addEventListener('input', () => timeInputAdd.classList.remove('error-border'));

    function renderExactTimes() {
        addedTimesList.innerHTML = '';
        exactTimesArray.forEach(time => {
            const tag = document.createElement('div'); tag.className = 'time-tag'; tag.innerHTML = `${time} <span>✖</span>`;
            tag.querySelector('span').addEventListener('click', () => { exactTimesArray = exactTimesArray.filter(t => t !== time); renderExactTimes(); });
            addedTimesList.appendChild(tag);
        });
    }

    if (medReminderToggle) {
        medReminderToggle.addEventListener('change', (e) => {
            medReminderOffsetWrapper.style.display = e.target.checked ? 'block' : 'none';
            if(medReminderText) medReminderText.innerText = e.target.checked ? t('enabled') : t('disabled');
        });
    }

    if (medPauseToggle) {
        medPauseToggle.addEventListener('change', (e) => {
            medPauseDurationWrapper.style.display = e.target.checked ? 'block' : 'none';
            if(medPauseText) medPauseText.innerText = e.target.checked ? t('enabled') : t('disabled');
        });
    }

    if (medInput && autocompleteList) {
        medInput.addEventListener('input', function() {
            const val = this.value.trim().toLowerCase(); autocompleteList.innerHTML = ''; 
            if (!val) { autocompleteList.classList.remove('show'); currentSelectedImage = DEFAULT_ICON; return; }
            const matches = medicationsDB.filter(med => med.name.toLowerCase().includes(val));
            if (matches.length > 0) {
                autocompleteList.classList.add('show');
                matches.forEach(med => {
                    const item = document.createElement('div'); item.className = 'autocomplete-item';
                    item.innerHTML = `<img src="${med.image}" alt="${med.name}" class="autocomplete-thumb" onerror="this.src='${DEFAULT_ICON}'"> <span>${med.name}</span>`;
                    item.addEventListener('click', () => { medInput.value = med.name; medInput.classList.remove('error-border'); currentSelectedImage = med.image; autocompleteList.innerHTML = ''; autocompleteList.classList.remove('show'); });
                    autocompleteList.appendChild(item);
                });
            } else { autocompleteList.classList.remove('show'); currentSelectedImage = DEFAULT_ICON; }
        });

        document.addEventListener('click', (e) => {
            if (e.target !== medInput && e.target !== autocompleteList) { autocompleteList.innerHTML = ''; autocompleteList.classList.remove('show'); }
        });

        if (saveMedBtn) {
            saveMedBtn.addEventListener('click', () => {
                const finalName = medInput.value.trim();
                
                if (!finalName) { alert(t('alert_enter_name')); medInput.classList.add('error-border'); return; }
                if (!medDateInput.value) { alert(t('alert_choose_date')); medDateInput.classList.add('error-border'); return; }

                const scheduleType = medScheduleType.value;
                if (scheduleType === 'interval') {
                    if (!medScheduleValInput.value.trim()) { alert(t('alert_missing_schedule')); medScheduleValInput.classList.add('error-border'); return; }
                } else if (scheduleType === 'exact') {
                    if (exactTimesArray.length === 0) { alert(t('alert_missing_schedule')); timeInputAdd.classList.add('error-border'); return; }
                }

                const exactMatch = medicationsDB.find(med => med.name.toLowerCase() === finalName.toLowerCase());
                if (exactMatch) currentSelectedImage = exactMatch.image;

                const isReminderEnabled = medReminderToggle ? medReminderToggle.checked : false;
                const remOffset = medReminderOffsetInput ? medReminderOffsetInput.value : "0";

                const isPauseEnabled = medPauseToggle ? medPauseToggle.checked : false;
                const pauseMins = medPauseDuration ? (parseInt(medPauseDuration.value) || 10) : 10;

                const newMed = {
                    id: Date.now(), name: finalName, image: currentSelectedImage,
                    openedDate: medDateInput.value, expDays: medExpDaysInput.value || 28, 
                    scheduleType: scheduleType, scheduleValue: medScheduleValInput.value,
                    scheduleTimes: [...exactTimesArray], 
                    reminderEnabled: isReminderEnabled, reminderOffset: remOffset,
                    pauseEnabled: isPauseEnabled, pauseDuration: pauseMins
                };

                const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
                savedMeds.push(newMed);
                localStorage.setItem('appMedications', JSON.stringify(savedMeds));

                alert(t('alert_med_saved'));
                
                medInput.value = ''; currentSelectedImage = DEFAULT_ICON;
                medDateInput.value = getLocalYMD(); medExpDaysInput.value = '28';
                medScheduleType.value = "exact"; medScheduleValWrapper.style.display = "none";
                medScheduleExactWrapper.style.display = "block"; medScheduleValInput.value = "";
                exactTimesArray = []; renderExactTimes();
                
                if (medReminderToggleWrapper) medReminderToggleWrapper.style.display = "block";
                if (medReminderToggle) { medReminderToggle.checked = false; if(medReminderText) medReminderText.innerText = t('disabled'); }
                if (medReminderOffsetWrapper) medReminderOffsetWrapper.style.display = "none";
                if (medReminderOffsetInput) medReminderOffsetInput.value = "0";

                if (medPauseToggle) { medPauseToggle.checked = false; if(medPauseText) medPauseText.innerText = t('disabled'); }
                if (medPauseDurationWrapper) medPauseDurationWrapper.style.display = "none";
                if (medPauseDuration) medPauseDuration.value = "10";

                if(medInput) medInput.classList.remove('error-border');
                if(medDateInput) medDateInput.classList.remove('error-border');
                if(medScheduleValInput) medScheduleValInput.classList.remove('error-border');
                if(timeInputAdd) timeInputAdd.classList.remove('error-border');

                document.getElementById('modal-add-med').style.display = 'none';
                renderMedications(); renderCalendar(); checkScheduledNotifications();
                syncPushesWithServer();
            });
        }
    }

    // ==========================================
    // ФУНКЦІЇ ДЛЯ СИНХРОНІЗАЦІЇ PUSH З СЕРВЕРОМ
    // ==========================================
    const PUBLIC_VAPID_KEY = 'BJpknjzyzE5DAdJIrnoQKdr2WDroqKVp179pnCT3dj3mxq2ksLXUDUN3ONbma9xenddguEZWOvLjg6AOzMwbxNo';

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function generatePushQueue() {
        const queue = [];
        const now = new Date();
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];

        visits.forEach(vDateStr => {
            const vDate = new Date(vDateStr);
            vDate.setDate(vDate.getDate() - 1);
            vDate.setHours(12, 0, 0, 0);
            if (vDate > now) {
                queue.push({ timestamp: vDate.getTime(), title: t('notif_type_doc'), body: `${t('reminder_tmrw')} (${vDateStr})` });
            }
        });

        savedMeds.forEach(med => {
            const op = new Date(med.openedDate);
            op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
            op.setHours(12, 0, 0, 0);
            if (op > now) {
                queue.push({ timestamp: op.getTime(), title: t('notif_type_exp'), body: t('modal_expiry_alert').replace('{name}', med.name).replace(/<[^>]*>?/gm, '') });
            }
        });

        savedMeds.forEach(med => {
            if (!med.scheduleType) return;
            if (med.reminderEnabled === false || med.reminderOffset === 'off') return;

            const offsetMins = parseInt(med.reminderOffset) || 0;

            if (med.scheduleType === 'exact' && med.scheduleTimes && med.scheduleTimes.length > 0) {
                for (let i = 0; i < 3; i++) {
                    const tDate = new Date(now);
                    tDate.setDate(tDate.getDate() + i);
                    med.scheduleTimes.forEach(timeStr => {
                        const [h, m] = timeStr.split(':').map(Number);
                        tDate.setHours(h, m, 0, 0);
                        const pushTime = tDate.getTime() - (offsetMins * 60 * 1000);
                        if (pushTime > now.getTime()) {
                            queue.push({ timestamp: pushTime, title: t('notif_type_rem'), body: `${t('time_to_drop')} ${med.name}` });
                        }
                    });
                }
            } else if (med.scheduleType === 'interval' && med.scheduleValue) {
                const medDrops = history.filter(h => h.medId === med.id).sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
                if (medDrops.length > 0) {
                    const lastD = medDrops[medDrops.length - 1];
                    const nextT = new Date(new Date(`${lastD.date}T${lastD.time}`).getTime() + parseFloat(med.scheduleValue) * 60 * 60 * 1000);
                    const pushTime = nextT.getTime() - (offsetMins * 60 * 1000);
                    if (pushTime > now.getTime()) {
                        queue.push({ timestamp: pushTime, title: t('notif_type_rem'), body: `${t('time_to_drop')} ${med.name}` });
                    }
                }
            }
        });

        const endTimeStr = localStorage.getItem('appTimerEndTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (endTime > now.getTime()) {
                queue.push({ timestamp: endTime, title: t('notif_type_rem'), body: t('notif_timer_done') });
            }
        }

        return queue;
    }

    // ОНОВЛЕНЕ НАДСИЛАННЯ ДАНИХ З ЛОКАЛЬНОЮ ІСТОРІЄЮ
    async function syncPushesWithServer() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (!sub) return;

            const queue = generatePushQueue();
            const soundEnabled = localStorage.getItem('appSoundEnabled') !== 'false';
            const localHistory = JSON.parse(localStorage.getItem('appNotifications')) || [];
            
            await fetch('/api/sync-pushes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: sub, queue, soundEnabled, localHistory })
            });
        } catch (e) {
            console.error('Помилка синхронізації з сервером:', e);
        }
    }

    async function registerServiceWorkerAndSubscribe() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const register = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker зареєстровано.');

                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                });

                await fetch('/api/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log('Успішно підписано на Web Push!');
                
                syncPushesWithServer();

            } catch (error) {
                console.error('Помилка підписки на Web Push:', error);
            }
        }
    }

    // --- ІНІЦІАЛІЗАЦІЯ ---
    updateBadge(); 
    checkTimerOnLoad(); 
    renderDoctorVisits();
    checkDoctorVisitsUI();
    renderMedications();
    updateTodayStats();
    renderCalendar();
    renderNotifications();
    
    registerServiceWorkerAndSubscribe();

    setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);

});