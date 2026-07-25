// --- ДИНАМІЧНІ ТЕКСТИ ---
const uiText = {
    eye_left: "Ліве", eye_both: "Обидва", eye_right: "Праве",
    today_no_drops: "Сьогодні ще не закапували",
    no_notifs: "Немає нових сповіщень.",
    already_time: "Вже час", time_to_drop: "Час капати!",
    today_at: "Сьогодні о ", tmrw_at: "Завтра о ",
    alert_delete_med: "Видалити цей препарат?", alert_enter_name: "Введіть назву",
    alert_choose_date: "Оберіть дату", alert_med_saved: "Збережено!",
    alert_no_active_meds: "Немає активних препаратів.", alert_delete_drop: "Видалити сеанс?",
    alert_import_success: "Дані відновлено!", alert_import_error: "Помилка імпорту.",
    alert_missing_schedule: "Вкажіть час або інтервал",
    reminder_today: "СЬОГОДНІ", reminder_tmrw: "ЗАВТРА",
    notif_type_doc: "Візит до лікаря", notif_type_exp: "Термін придатності",
    notif_type_rem: "Нагадування", notif_type_pause: "Паузу завершено", notif_timer_done: "Можна закапувати наступний препарат",
    months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    status_active: "Активний", status_expired: "Прострочено", status_soon: "Скоро"
};

function translateEyeValue(eyeVal) {
    if (eyeVal === 'left') return uiText.eye_left;
    if (eyeVal === 'right') return uiText.eye_right;
    return uiText.eye_both; 
}

document.addEventListener('DOMContentLoaded', () => {

    let tempVisits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
    let isMigrated = false;
    tempVisits = tempVisits.map(v => {
        if (typeof v === 'string') { isMigrated = true; return { id: Date.now() + Math.random(), date: v, time: '12:00' }; }
        return v;
    });
    if(isMigrated) localStorage.setItem('appDoctorVisits', JSON.stringify(tempVisits));

    function getLocalYMD(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    
    // --- НАВІГАЦІЯ ---
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
            
            window.scrollTo({ top: 0, behavior: 'instant' });

            if(targetScreenId === 'screen-calendar') renderCalendar();
            if(targetScreenId === 'screen-home') renderMedications(); 
            if(targetScreenId === 'screen-notifications') renderNotifications();
        });
    });

    // --- АНІМАЦІЯ ЗАКРИТТЯ МОДАЛОК ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('closing');
            modal.style.display = 'flex';
        }
    }

    function closeModal(modalElement) {
        if(!modalElement) return;
        modalElement.classList.add('closing');
        setTimeout(() => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('closing');
        }, 200); 
    }

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal-overlay'));
        });
    });

    const medicationsDB = [
        { name: "Дорзопт плюс", image: "images/dorzopt.webp" },
        { name: "Латасопт", image: "images/latasopt.webp" },
        { name: "Ектал", image: "images/ektal.jpg" }
    ];
    const DEFAULT_ICON = "images/default.png"; 

    // --- РОЗШИРЕНІ СПОВІЩЕННЯ ТА ПРОСЛУХОВУВАННЯ PUSH ---
    const notifSoundToggle = document.getElementById('notif-sound-toggle');
    const notifSoundText = document.getElementById('notif-sound-text');
    const isSoundEnabled = localStorage.getItem('appSoundEnabled') !== 'false';
    
    if (notifSoundToggle) {
        notifSoundToggle.checked = isSoundEnabled;
        if(notifSoundText) notifSoundText.innerText = isSoundEnabled ? "Увімкнено" : "Вимкнено";
        
        notifSoundToggle.addEventListener('change', (e) => {
            localStorage.setItem('appSoundEnabled', e.target.checked);
            if(notifSoundText) notifSoundText.innerText = e.target.checked ? "Увімкнено" : "Вимкнено";
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

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'PUSH_RECEIVED') {
                const pushData = event.data.data;
                showPushToast(pushData.title, pushData.body);
                renderNotifications();
            }

            // --- ПЕРЕНЕСЕНО СЮДИ (ВСЕРЕДИНУ СЛУХАЧА MESSAGE) ---
            if (event.data && event.data.type === 'RETRY_SYNC') {
                console.log('[Sync] Отримано команду фонової синхронізації від SW. Повторюємо відправку...');
                syncPushesWithServer();
            }
        });
    }
    
    function updateBadge() {
        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        const badge = document.getElementById('nav-badge');
        const hasUnread = notifs.some(n => !n.isRead);
        if (badge) badge.style.display = hasUnread ? 'block' : 'none';
    }

    // === [НОВА ФУНКЦІЯ: ЗЧИТУВАННЯ БАЗИ INDEXEDDB] ===
    async function getOfflineNotifsFromDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open('KrapliksDB', 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('offline_notifs')) {
                    db.createObjectStore('offline_notifs', { keyPath: 'id' });
                }
            };
            request.onsuccess = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('offline_notifs')) { resolve([]); return; }
                const tx = db.transaction('offline_notifs', 'readwrite');
                const store = tx.objectStore('offline_notifs');
                const getAllReq = store.getAll();
                
                getAllReq.onsuccess = () => {
                    const allItems = getAllReq.result || [];
                    const now = Date.now();
                    
                    // 1. Відбираємо ТІЛЬКИ ті пуші, час прийому яких уже настав або минув
                    const readyItems = allItems.filter(item => item.timestamp <= now);

                    // === [ДОДАЙТЕ ЦЕЙ РЯДОК]: Примусово захищаємо статус "непрочитано", щоб пуші ЗАВЖДИ були зеленими ===
                    readyItems.forEach(item => {
                        item.isRead = (item.isRead !== undefined && item.isRead !== null) ? item.isRead : false;
                    });
                    // ===================================================================================================

                    // 2. Видаляємо з IndexedDB виключно ті записи, які ми зараз переносимо в історію.
                    // Майбутні заплановані прийоми залишаються в базі і не губляться.
                    readyItems.forEach(item => store.delete(item.id));
                    
                    resolve(readyItems);
                };
                getAllReq.onerror = () => resolve([]);
            };
            request.onerror = () => resolve([]);
        });
    }

    async function renderNotifications(skipServerSync = false) {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        // === [ВСТАВИТИ СЮДИ: ПЕРЕНЕСЕННЯ ОФЛАЙН-ПУШІВ В ІСТОРІЮ] ===
        const idbNotifs = await getOfflineNotifsFromDB();
        if (idbNotifs.length > 0) {
            const localNotifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
            const tempMap = new Map();
            localNotifs.forEach(n => tempMap.set(n.id + '_' + n.text, n));
            idbNotifs.forEach(n => {
                // Додаємо в історію тільки ті сповіщення, час прийому яких вже настав
                if (n.timestamp <= Date.now() && !tempMap.has(n.id + '_' + n.text)) {
                    tempMap.set(n.id + '_' + n.text, n);
                }
            });
            const updated = Array.from(tempMap.values()).sort((a, b) => b.timestamp - a.timestamp);
            localStorage.setItem('appNotifications', JSON.stringify(updated));
        }
        // ==========================================================
    
        const drawLocalList = () => {
            const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
            list.innerHTML = '';
        
            if (notifs.length === 0) {
                list.innerHTML = `<p class="empty-state-text">${uiText.no_notifs}</p>`;
                updateBadge(); 
                return;
            }

            notifs.forEach(notif => {
                const card = document.createElement('div');
                card.className = `notif-card ${notif.isRead ? '' : 'unread'}`;
                const timeStr = new Date(notif.timestamp).toLocaleString('uk-UA', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
                
                const finalTitle = notif.titleText || uiText[notif.titleKey] || "Сповіщення";
                
                let iconHtml = '';
                if (notif.type === 'doctor') iconHtml = `<img src="assets/icons/doctor.svg" class="inline-icon">`;
                else if (notif.type === 'expiry') iconHtml = `<img src="assets/icons/warning.svg" class="inline-icon">`;
                else if (notif.type === 'reminder') iconHtml = `<img src="assets/icons/drops.svg" class="inline-icon">`;
                else if (notif.type === 'pause') iconHtml = `<img src="assets/icons/hourglass.svg" class="inline-icon">`;

                card.innerHTML = `
                    <div class="notif-title"><span style="display:flex; align-items:center;">${iconHtml} ${finalTitle}</span><span class="notif-time">${timeStr}</span></div>
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
                            if (sub) fetch('/api/notifications/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub, id: notif.id }) });
                        } catch(e){}
                    }
                });
                list.appendChild(card);
            });
            updateBadge();
        };

        drawLocalList();

        // Не робимо запит на сервер, якщо ми викликали рендер після локального очищення
        if (!skipServerSync && 'serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const reg = await navigator.serviceWorker.ready;
                const sub = await reg.pushManager.getSubscription();
                if (sub) {
                    const res = await fetch('/api/notifications/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub }) });
                    if (res.ok) {
                        const serverNotifs = await res.json();
                        const localNotifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
                        // === [ФІНАЛЬНА ОБРОБКА: ЗАХИСТ ВІД ДУБЛІКАТІВ + ПІДТРИМКА ОДНОЧАСНИХ ПРИЙОМІВ] ===
                        const historyMap = new Map();
                        
                        // 1. Записуємо всі локальні сповіщення. Ключ = id + текст
                        localNotifs.forEach(n => historyMap.set(n.id + '_' + n.text, n));
                        
                        // 2. Обробляємо хмарні сповіщення з сервера Render
                        serverNotifs.forEach(serverN => {
                            const exactKey = serverN.id + '_' + serverN.text;
                            
                            // Шукаємо, чи є вже в пам'яті локальне нагадування з ТАКИМ САМИМ текстом
                            // і близьким часом створення (різниця менше 10 хвилин)
                            const duplicateKey = Array.from(historyMap.keys()).find(key => {
                                const localN = historyMap.get(key);
                                const isSameText = localN.text === serverN.text;
                                // Збільшуємо до 24 годин, щоб зловити хмарні пуші, які запізнилися через нічний сон пристрою
                                const isCloseInTime = Math.abs(localN.timestamp - serverN.timestamp) < (24 * 60 * 60 * 1000);
                                return isSameText && isCloseInTime;
                            });

                            if (duplicateKey) {
                                // Якщо знайшли локального "близнюка" (наприклад, створеного в офлайні з тимчасовим ID):
                                // Видаляємо старий запис і зберігаємо оновлений з офіційним ID з бази даних
                                const existing = historyMap.get(duplicateKey);
                                historyMap.delete(duplicateKey);
                                historyMap.set(exactKey, {
                                    ...existing,
                                    id: serverN.id, // Підміняємо тимчасовий ID на постійний серверний
                                    isRead: existing.isRead || serverN.isRead // Зберігаємо статус прочитання
                                });
                            } else if (!historyMap.has(exactKey)) {
                                // Якщо це абсолютно нове сповіщення — просто додаємо його
                                historyMap.set(exactKey, serverN);
                            } else if (serverN.isRead) {
                                // Якщо сповіщення вже є, але на сервері воно позначено прочитаним — оновлюємо статус
                                historyMap.get(exactKey).isRead = true;
                            }
                        });

                        const merged = Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);
                        localStorage.setItem('appNotifications', JSON.stringify(merged));
                        
                        drawLocalList();
                        // ===============================================================================
                    }
                }
            } catch (e) {}
        }
    }

    document.getElementById('btn-read-all')?.addEventListener('click', async () => {
        const notifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
        notifs.forEach(n => n.isRead = true); 
        localStorage.setItem('appNotifications', JSON.stringify(notifs));
        
        // Передаємо true: миттєве локальне оновлення без ризику повернути старі дані з хмари
        renderNotifications(true); 
        
        try {
            const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription();
            if (sub) fetch('/api/notifications/read-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub }) });
        } catch(e){}
    });

    document.getElementById('btn-modal-delete-all')?.addEventListener('click', async () => {
        // Надійно записуємо пустий масив замість повного removeItem
        localStorage.setItem('appNotifications', JSON.stringify([])); 
        
        // Передаємо true: список очищується миттєво з ПЕРШОГО кліку
        renderNotifications(true); 
        closeModal(document.getElementById('modal-manage-notifs'));
        
        try {
            const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription();
            if (sub) fetch('/api/notifications/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub }) });
        } catch(e){}
    });

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            fetch(this.action, { method: 'POST', body: new FormData(this), headers: { 'Accept': 'application/json' }})
            .then(response => { if (response.ok) { alert("Дякуємо за відгук!"); this.reset(); closeModal(document.getElementById('modal-feedback')); } else alert("Помилка відправки."); })
            .catch(error => alert("Помилка відправки."));
        });
    }

    document.getElementById('btn-export')?.addEventListener('click', () => {
        const data = {
            appMedications: JSON.parse(localStorage.getItem('appMedications')) || [], appDropHistory: JSON.parse(localStorage.getItem('appDropHistory')) || [],
            appDoctorVisits: JSON.parse(localStorage.getItem('appDoctorVisits')) || [], appNotifications: JSON.parse(localStorage.getItem('appNotifications')) || [],
            appSoundEnabled: localStorage.getItem('appSoundEnabled') || 'true'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `drops-backup-${getLocalYMD()}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    });

    document.getElementById('file-import')?.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.appMedications) localStorage.setItem('appMedications', JSON.stringify(data.appMedications));
                if (data.appDropHistory) localStorage.setItem('appDropHistory', JSON.stringify(data.appDropHistory));
                if (data.appDoctorVisits) localStorage.setItem('appDoctorVisits', JSON.stringify(data.appDoctorVisits));
                if (data.appNotifications) localStorage.setItem('appNotifications', JSON.stringify(data.appNotifications));
                if (data.appSoundEnabled) localStorage.setItem('appSoundEnabled', data.appSoundEnabled);
                alert(uiText.alert_import_success); syncPushesWithServer(); location.reload(); 
            } catch (err) { alert(uiText.alert_import_error); }
        };
        reader.readAsText(file);
    });

    // --- ВІЗИТ ДО ЛІКАРЯ ---
    function checkDoctorVisitsUI() {
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        const reminderDiv = document.getElementById('doctor-reminder'); reminderDiv.style.display = 'none';
        if (visits.length === 0) return;

        const today = new Date(getLocalYMD()); let closestVisit = null, minDiff = Infinity;
        visits.forEach(v => {
            const diffDays = Math.ceil((new Date(v.date) - today) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 2 && diffDays < minDiff) { minDiff = diffDays; closestVisit = { dateStr: v.date, timeStr: v.time, days: diffDays }; }
        });

        if (closestVisit) {
            reminderDiv.style.display = 'block';
            let daysText = closestVisit.days === 0 ? uiText.reminder_today : (closestVisit.days === 1 ? uiText.reminder_tmrw : `через ${closestVisit.days} дн.`);
            reminderDiv.innerHTML = `Візит до лікаря: ${daysText} (${new Date(closestVisit.dateStr).toLocaleDateString('uk-UA')} о ${closestVisit.timeStr})`;
        }
    }

    const doctorDateInput = document.getElementById('doctor-date-input');
    const doctorTimeInput = document.getElementById('doctor-time-input');
    function renderDoctorVisits() {
        const list = document.getElementById('doctor-visits-list'); if (!list) return;
        list.innerHTML = '';
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        
        visits.sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time)).forEach(v => {
            const tag = document.createElement('div'); tag.className = 'time-tag'; tag.innerHTML = `${new Date(v.date).toLocaleDateString('uk-UA')} о ${v.time} <span>✖</span>`;
            tag.querySelector('span').addEventListener('click', () => {
                let currentVisits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
                localStorage.setItem('appDoctorVisits', JSON.stringify(currentVisits.filter(item => item.id !== v.id)));
                renderDoctorVisits(); checkDoctorVisitsUI(); syncPushesWithServer();
            });
            list.appendChild(tag);
        });
    }

    document.getElementById('btn-add-doctor')?.addEventListener('click', () => {
        const dateVal = doctorDateInput.value; 
        const timeVal = doctorTimeInput.value || '12:00';
        if(!dateVal) return;
        let visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        visits.push({ id: Date.now(), date: dateVal, time: timeVal }); 
        localStorage.setItem('appDoctorVisits', JSON.stringify(visits));
        renderDoctorVisits(); checkDoctorVisitsUI(); syncPushesWithServer();
        doctorDateInput.value = ''; doctorTimeInput.value = '';
    });

    function calculateNextDose(medId, scheduleType, scheduleValue, scheduleTimes) {
        if (!scheduleType) return null;
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const medDrops = history.filter(h => h.medId === medId).sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
        const lastDrop = medDrops.length > 0 ? medDrops[medDrops.length - 1] : null; const now = new Date();

        if (scheduleType === 'interval' && scheduleValue) {
            if (!lastDrop) return uiText.already_time;
            const nextTime = new Date(new Date(`${lastDrop.date}T${lastDrop.time}`).getTime() + parseFloat(scheduleValue) * 60 * 60 * 1000);
            if (nextTime <= now) return uiText.time_to_drop;
            return (nextTime.getDate() !== now.getDate() || nextTime < now ? uiText.tmrw_at : uiText.today_at) + nextTime.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
        }

        if (scheduleType === 'exact' && scheduleTimes && scheduleTimes.length > 0) {
            let sortedTimes = [...scheduleTimes].sort();
            const currentStr = now.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
            let nextStr = sortedTimes.find(t => t > currentStr);
            return nextStr ? `${uiText.today_at} ${nextStr}` : `${uiText.tmrw_at} ${sortedTimes[0]}`;
        }
        return null;
    }

    // --- ОНОВЛЕНИЙ І ВИПРАВЛЕНИЙ DRAG AND DROP ---
    let draggedItem = null;
    
    function handleDragStart(e) {
        draggedItem = this;
        
        // Додаємо дані для сумісності з мобільними та Firefox
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
        }
        
        setTimeout(() => this.classList.add('dragging'), 0);
        document.body.classList.add('is-dragging');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

        const scrollThreshold = 100; // Розширена зона для автоскролу
        const scrollSpeed = 20;      // Швидкість прокрутки
        
        if (e.clientY < scrollThreshold) {
            window.scrollBy(0, -scrollSpeed);
        } else if (window.innerHeight - e.clientY < scrollThreshold) {
            window.scrollBy(0, scrollSpeed);
        }

        const container = document.getElementById('medications-container');
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedItem);
        } else {
            container.insertBefore(draggedItem, afterElement);
        }
    }
    
    function handleDrop(e) { 
        e.preventDefault(); 
    }
    
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        this.draggable = false; // Вимикаємо драг після завершення перетягування
        draggedItem = null;
        document.body.classList.remove('is-dragging');
        saveMedicationsOrder();
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.med-card:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    function saveMedicationsOrder() {
        const container = document.getElementById('medications-container');
        const cards = container.querySelectorAll('.med-card');
        const currentMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const reorderedMeds = [];
        cards.forEach(card => {
            const id = parseInt(card.getAttribute('data-id'));
            const med = currentMeds.find(m => m.id === id);
            if (med) reorderedMeds.push(med);
        });
        localStorage.setItem('appMedications', JSON.stringify(reorderedMeds));
    }

    const medsContainer = document.getElementById('medications-container');

    const iconEditSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19.7778H6.425L16.2 8.91667L14.775 7.33333L5 18.1944V19.7778ZM3 22V17.2778L16.2 2.63889C16.4 2.43519 16.621 2.27778 16.863 2.16667C17.105 2.05556 17.359 2 17.625 2C17.891 2 18.1493 2.05556 18.4 2.16667C18.6507 2.27778 18.8673 2.44444 19.05 2.66667L20.425 4.22222C20.625 4.42593 20.771 4.66667 20.863 4.94444C20.955 5.22222 21.0007 5.5 21 5.77778C21 6.07407 20.9543 6.35667 20.863 6.62556C20.7717 6.89444 20.6257 7.13963 20.425 7.36111L7.25 22H3ZM15.475 8.13889L14.775 7.33333L16.2 8.91667L15.475 8.13889Z" fill="#D4A373"/></svg>`;
    const iconDeleteSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.28571 19.7778C4.28571 20.3671 4.55663 20.9324 5.03887 21.3491C5.5211 21.7659 6.17516 22 6.85714 22H17.1429C17.8248 22 18.4789 21.7659 18.9611 21.3491C19.4434 20.9324 19.7143 20.3671 19.7143 19.7778V6.44444H4.28571V19.7778ZM6.85714 8.66667H17.1429V19.7778H6.85714V8.66667ZM16.5 3.11111L15.2143 2H8.78571L7.5 3.11111H3V5.33333H21V3.11111H16.5Z" fill="#D4A373"/></svg>`;

    function renderMedications() {
        if (!medsContainer) return;
        medsContainer.innerHTML = '';
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        if (savedMeds.length === 0) {
            medsContainer.innerHTML = `<p class="empty-state-text">${uiText.alert_no_active_meds}</p>`;
            return;
        }

        const today = new Date(getLocalYMD());

        savedMeds.forEach(med => {
            const openDate = new Date(med.openedDate); openDate.setHours(0, 0, 0, 0);
            const expDays = parseInt(med.expDays) || 28; 
            const expireDate = new Date(openDate); expireDate.setDate(expireDate.getDate() + expDays);
            const diffDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));

            let statusClass = 'status-ok', statusText = uiText.status_active, isExpired = false;
            let daysText = `${diffDays} дн.`;

            if (diffDays <= 0) { 
                statusClass = 'status-expired'; 
                statusText = uiText.status_expired; 
                isExpired = true; 
                daysText = diffDays === 0 ? "0 дн." : `-${Math.abs(diffDays)} дн.`; 
            } 
            else if (diffDays === 1) { 
                statusClass = 'status-last-day'; 
                statusText = "Останній день"; 
            }
            else if (diffDays <= 5) { 
                statusClass = 'status-warning'; 
                statusText = uiText.status_soon; 
            }

            let progressPercent = (diffDays / expDays) * 100;
            if (progressPercent > 100) progressPercent = 100;
            if (progressPercent < 0) progressPercent = 0;

            const nextDoseText = calculateNextDose(med.id, med.scheduleType, med.scheduleValue, med.scheduleTimes);
            const nextDoseHtml = nextDoseText ? `<div class="next-dose-box">Наступний прийом:<br>${nextDoseText}</div>` : '';

            let tabletkiBtnHtml = '';
            if (diffDays <= 3) {
                let searchUrl = `https://tabletki.ua/uk/${encodeURIComponent(med.name)}`;
                tabletkiBtnHtml = `<a href="${searchUrl}" target="_blank" class="btn-tabletki"><img src="assets/icons/search.svg" class="inline-icon"> Знайти на Tabletki.ua</a>`;
            }

            const card = document.createElement('div');
            card.className = `med-card ${isExpired ? 'expired' : ''}`;
            card.setAttribute('data-id', med.id);
            // ПРИМІТКА: Початково draggable false. Вмикається ТІЛЬКИ через іконку ☰
            card.draggable = false; 

            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('drop', handleDrop);
            card.addEventListener('dragenter', e => e.preventDefault());
            card.addEventListener('dragend', handleDragEnd);

            card.innerHTML = `
                <div class="med-card-header">
                    <span class="drag-handle" title="Потягніть, щоб змінити порядок"><img src="assets/icons/gripper.svg" class="drag-icon" alt="Порядок"></span>
                    <img src="${med.image}" alt="${med.name}" class="med-card-thumb" onerror="this.src='${DEFAULT_ICON}'">
                    <div class="med-title-wrap">
                        <h3>${med.name}</h3>
                        <div class="med-actions">
                            <button class="icon-action-btn edit-med-btn" data-id="${med.id}">${iconEditSvg}</button>
                            <button class="icon-action-btn delete-med-btn" data-id="${med.id}">${iconDeleteSvg}</button>
                        </div>
                    </div>
                </div>
                
                <div class="med-stats">
                    <div class="stat-col"><span class="stat-label">Відкрито:</span><span class="stat-val">${openDate.toLocaleDateString('uk-UA', {day:'2-digit', month:'2-digit', year:'numeric'})}</span></div>
                    <div class="stat-col"><span class="stat-label">Термін:</span><span class="stat-val">${expDays} дн.</span></div>
                    <div class="stat-col"><span class="stat-label">Доза:</span><span class="stat-val">${med.dropsQty || 1} кр.</span></div>
                    <div class="stat-col"><span class="stat-label">Залишилось:</span><span class="stat-val accent">${daysText}</span></div>
                </div>

                <div class="med-progress">
                    <div class="progress-bar" style="width: ${progressPercent}%"></div>
                </div>

                <div class="med-footer">
                    <div class="med-status ${statusClass}">${statusText}</div>
                    ${nextDoseHtml}
                </div>
                ${tabletkiBtnHtml}
            `;

            // Активуємо перетягування ТІЛЬКИ через іконку ☰
            const handle = card.querySelector('.drag-handle');
            
            const enableDrag = () => { card.draggable = true; };
            const disableDrag = () => { card.draggable = false; };

            handle.addEventListener('mousedown', enableDrag);
            handle.addEventListener('touchstart', enableDrag, { passive: true });

            handle.addEventListener('mouseup', disableDrag);
            handle.addEventListener('mouseleave', disableDrag);
            handle.addEventListener('touchend', disableDrag);
            handle.addEventListener('touchcancel', disableDrag);

            medsContainer.appendChild(card);
        });

        document.querySelectorAll('.delete-med-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if(confirm(uiText.alert_delete_med)) {
                    let savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
                    savedMeds = savedMeds.filter(m => m.id !== parseInt(this.getAttribute('data-id')));
                    localStorage.setItem('appMedications', JSON.stringify(savedMeds));
                    renderMedications(); syncPushesWithServer();
                }
            });
        });

        document.querySelectorAll('.edit-med-btn').forEach(btn => {
            btn.addEventListener('click', function() { openEditMedModal(parseInt(this.getAttribute('data-id'))); });
        });
    }

    const modalEditMed = document.getElementById('modal-edit-med');
    const editMedIdInput = document.getElementById('edit-med-id');
    const editMedNameDisplay = document.getElementById('edit-med-name-display');
    const editMedDropsQty = document.getElementById('edit-med-drops-qty');
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
                if (editMedReminderOffsetWrapper && editMedReminderToggle) editMedReminderOffsetWrapper.style.display = editMedReminderToggle.checked ? 'block' : 'none';
            }
            editMedScheduleValInput.classList.remove('error-border'); editTimeInputAdd.classList.remove('error-border');
        });
    }

    if (btnEditAddTime) {
        btnEditAddTime.addEventListener('click', () => {
            const timeVal = editTimeInputAdd.value; if(!timeVal) return;
            if(!editExactTimesArray.includes(timeVal)) { 
                editExactTimesArray.push(timeVal); editExactTimesArray.sort(); renderEditExactTimes(); editTimeInputAdd.classList.remove('error-border');
            }
            editTimeInputAdd.value = '';
        });
    }

    function openEditMedModal(medId) {
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const med = savedMeds.find(m => m.id === medId); if(!med) return;

        editMedIdInput.value = med.id; editMedNameDisplay.innerText = med.name;
        if(editMedDropsQty) editMedDropsQty.value = med.dropsQty || 1;
        editMedScheduleType.value = med.scheduleType || "";
        editMedScheduleValWrapper.style.display = med.scheduleType === 'interval' ? 'block' : 'none';
        editMedScheduleExactWrapper.style.display = med.scheduleType === 'exact' ? 'block' : 'none';
        editMedScheduleValInput.value = med.scheduleValue || "";
        editExactTimesArray = med.scheduleTimes ? [...med.scheduleTimes] : [];
        renderEditExactTimes();
        
        const isRemEnabled = med.reminderEnabled !== undefined ? med.reminderEnabled : (med.reminderOffset !== 'off');
        if(editMedReminderToggle) editMedReminderToggle.checked = isRemEnabled;
        if(editMedReminderText) editMedReminderText.innerText = isRemEnabled ? "Увімкнено" : "Вимкнено";
        if(editMedReminderOffset) editMedReminderOffset.value = (med.reminderOffset && med.reminderOffset !== 'off') ? med.reminderOffset : "0";
        
        if (editMedReminderToggleWrapper) editMedReminderToggleWrapper.style.display = (med.scheduleType === "") ? 'none' : 'block';
        if (editMedReminderOffsetWrapper) editMedReminderOffsetWrapper.style.display = (med.scheduleType !== "" && isRemEnabled) ? 'block' : 'none';

        const isPauseEnabled = med.pauseEnabled !== undefined ? med.pauseEnabled : false;
        if(editMedPauseToggle) editMedPauseToggle.checked = isPauseEnabled;
        if(editMedPauseDuration) editMedPauseDuration.value = med.pauseDuration || 10;
        if(editMedPauseDurationWrapper) editMedPauseDurationWrapper.style.display = isPauseEnabled ? 'block' : 'none';
        if(editMedPauseText) editMedPauseText.innerText = isPauseEnabled ? "Увімкнено" : "Вимкнено";

        openModal('modal-edit-med');
    }

    if (editMedReminderToggle) editMedReminderToggle.addEventListener('change', (e) => { editMedReminderOffsetWrapper.style.display = e.target.checked ? 'block' : 'none'; editMedReminderText.innerText = e.target.checked ? "Увімкнено" : "Вимкнено"; });
    if (editMedPauseToggle) editMedPauseToggle.addEventListener('change', (e) => { editMedPauseDurationWrapper.style.display = e.target.checked ? 'block' : 'none'; editMedPauseText.innerText = e.target.checked ? "Увімкнено" : "Вимкнено"; });

    document.getElementById('save-edit-med-btn')?.addEventListener('click', () => {
        const medId = parseInt(editMedIdInput.value);
        let savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const index = savedMeds.findIndex(m => m.id === medId);
        
        if(index !== -1) {
            const scheduleType = editMedScheduleType.value;
            if (scheduleType === 'interval' && !editMedScheduleValInput.value.trim()) { alert(uiText.alert_missing_schedule); return; }
            if (scheduleType === 'exact' && editExactTimesArray.length === 0) { alert(uiText.alert_missing_schedule); return; }

            savedMeds[index].dropsQty = editMedDropsQty ? parseInt(editMedDropsQty.value) || 1 : 1;
            savedMeds[index].scheduleType = scheduleType; savedMeds[index].scheduleValue = editMedScheduleValInput.value;
            savedMeds[index].scheduleTimes = [...editExactTimesArray]; savedMeds[index].reminderEnabled = editMedReminderToggle.checked;
            savedMeds[index].reminderOffset = editMedReminderOffset.value; savedMeds[index].pauseEnabled = editMedPauseToggle.checked;
            savedMeds[index].pauseDuration = parseInt(editMedPauseDuration.value) || 10;
            localStorage.setItem('appMedications', JSON.stringify(savedMeds));
            
            closeModal(modalEditMed); 
            renderMedications(); syncPushesWithServer();
        }
    });

    const medInput = document.getElementById('med-name-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    const medDateInput = document.getElementById('med-date-input');
    const medExpDaysInput = document.getElementById('med-exp-days');
    const medDropsQtyInput = document.getElementById('med-drops-qty');
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
    
    let currentSelectedImage = DEFAULT_ICON; let exactTimesArray = [];

    if (medDateInput) medDateInput.value = getLocalYMD(); 

    if (medScheduleType) medScheduleType.addEventListener('change', (e) => {
        const type = e.target.value;
        medScheduleValWrapper.style.display = type === 'interval' ? 'block' : 'none';
        medScheduleExactWrapper.style.display = type === 'exact' ? 'block' : 'none';
        if (type !== 'exact') { exactTimesArray = []; renderExactTimes(); }
        if (type === "") { medReminderToggleWrapper.style.display = 'none'; medReminderOffsetWrapper.style.display = 'none'; } 
        else { medReminderToggleWrapper.style.display = 'block'; if (medReminderToggle) medReminderOffsetWrapper.style.display = medReminderToggle.checked ? 'block' : 'none'; }
    });

    if (btnAddTime) btnAddTime.addEventListener('click', () => {
        const timeVal = timeInputAdd.value; if(!timeVal) return;
        if(!exactTimesArray.includes(timeVal)) { exactTimesArray.push(timeVal); exactTimesArray.sort(); renderExactTimes(); }
        timeInputAdd.value = '';
    });

    function renderExactTimes() {
        addedTimesList.innerHTML = '';
        exactTimesArray.forEach(time => {
            const tag = document.createElement('div'); tag.className = 'time-tag'; tag.innerHTML = `${time} <span>✖</span>`;
            tag.querySelector('span').addEventListener('click', () => { exactTimesArray = exactTimesArray.filter(t => t !== time); renderExactTimes(); });
            addedTimesList.appendChild(tag);
        });
    }

    if (medReminderToggle) medReminderToggle.addEventListener('change', (e) => { medReminderOffsetWrapper.style.display = e.target.checked ? 'block' : 'none'; medReminderText.innerText = e.target.checked ? "Увімкнено" : "Вимкнено"; });
    if (medPauseToggle) medPauseToggle.addEventListener('change', (e) => { medPauseDurationWrapper.style.display = e.target.checked ? 'block' : 'none'; medPauseText.innerText = e.target.checked ? "Увімкнено" : "Вимкнено"; });

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
                    item.addEventListener('click', () => { medInput.value = med.name; currentSelectedImage = med.image; autocompleteList.innerHTML = ''; autocompleteList.classList.remove('show'); });
                    autocompleteList.appendChild(item);
                });
            } else { autocompleteList.classList.remove('show'); currentSelectedImage = DEFAULT_ICON; }
        });

        document.addEventListener('click', (e) => { if (e.target !== medInput && e.target !== autocompleteList) { autocompleteList.innerHTML = ''; autocompleteList.classList.remove('show'); } });

        if (saveMedBtn) saveMedBtn.addEventListener('click', () => {
            const finalName = medInput.value.trim();
            if (!finalName) { alert(uiText.alert_enter_name); return; }
            if (!medDateInput.value) { alert(uiText.alert_choose_date); return; }

            const scheduleType = medScheduleType.value;
            if (scheduleType === 'interval' && !medScheduleValInput.value.trim()) { alert(uiText.alert_missing_schedule); return; }
            else if (scheduleType === 'exact' && exactTimesArray.length === 0) { alert(uiText.alert_missing_schedule); return; }

            const exactMatch = medicationsDB.find(med => med.name.toLowerCase() === finalName.toLowerCase());
            if (exactMatch) currentSelectedImage = exactMatch.image;

            const newMed = {
                id: Date.now(), name: finalName, image: currentSelectedImage,
                openedDate: medDateInput.value, expDays: medExpDaysInput.value || 28, 
                dropsQty: medDropsQtyInput ? parseInt(medDropsQtyInput.value) || 1 : 1,
                scheduleType: scheduleType, scheduleValue: medScheduleValInput.value, scheduleTimes: [...exactTimesArray], 
                reminderEnabled: medReminderToggle ? medReminderToggle.checked : false, reminderOffset: medReminderOffsetInput ? medReminderOffsetInput.value : "0",
                pauseEnabled: medPauseToggle ? medPauseToggle.checked : false, pauseDuration: medPauseDuration ? (parseInt(medPauseDuration.value) || 10) : 10
            };

            const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
            savedMeds.push(newMed); localStorage.setItem('appMedications', JSON.stringify(savedMeds));
            alert(uiText.alert_med_saved);
            
            medInput.value = ''; currentSelectedImage = DEFAULT_ICON; medDateInput.value = getLocalYMD(); medExpDaysInput.value = '28';
            if (medDropsQtyInput) medDropsQtyInput.value = '1';
            medScheduleType.value = "exact"; medScheduleValWrapper.style.display = "none"; medScheduleExactWrapper.style.display = "block"; medScheduleValInput.value = ""; exactTimesArray = []; renderExactTimes();
            
            if(medPauseToggle) medPauseToggle.checked = false;
            if(medPauseDurationWrapper) medPauseDurationWrapper.style.display = 'none';
            if(medPauseDuration) medPauseDuration.value = '10';
            if(medPauseText) medPauseText.innerText = "Вимкнено";

            closeModal(document.getElementById('modal-add-med'));
            renderMedications(); renderCalendar(); syncPushesWithServer();
        });
    }

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
            todayStatsContainer.innerHTML = ``;
            lastActionText.innerText = uiText.today_no_drops;
            return;
        }

        const lastDrop = todayDrops[todayDrops.length - 1];
        lastActionText.innerText = `Останній раз: сьогодні о ${lastDrop.time} (${lastDrop.medName}, ${translateEyeValue(lastDrop.eye)})`;

        const stats = {};
        todayDrops.forEach(d => { stats[d.medName] = (stats[d.medName] || 0) + 1; });
        let html = ``;
        for (const [name, count] of Object.entries(stats)) html += `<span class="stat-pill">${name}: ${count} р.</span>`;
        todayStatsContainer.innerHTML = html;
    }

    const dropModal = document.getElementById('drop-modal');
    const dropModalList = document.getElementById('drop-modal-list');
    const dropModalSuccess = document.getElementById('drop-modal-success');
    document.getElementById('drop-modal-close').addEventListener('click', () => closeModal(dropModal));

    if (btnDrop) {
        btnDrop.addEventListener('click', () => {
            btnDrop.blur(); if (btnDrop.disabled) return;
            
            const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
            const today = new Date(getLocalYMD());
            const activeMeds = savedMeds.filter(med => {
                const op = new Date(med.openedDate); op.setHours(0,0,0,0);
                const expireDate = new Date(op); expireDate.setDate(expireDate.getDate() + (parseInt(med.expDays) || 28));
                return expireDate > today; 
            });

            if (activeMeds.length === 0) { alert(uiText.alert_no_active_meds); return; }

            dropModalList.style.display = 'flex'; dropModalSuccess.style.display = 'none'; dropModalList.innerHTML = '';
            
            activeMeds.forEach(med => {
                const item = document.createElement('div'); item.className = 'drop-med-item';
                item.innerHTML = `<img src="${med.image}" alt="${med.name}" class="drop-med-thumb" onerror="this.src='${DEFAULT_ICON}'"> <span class="drop-med-name">${med.name} (${med.dropsQty || 1} кр.)</span>`;
                item.addEventListener('click', () => {
                    dropModalList.style.display = 'none'; dropModalSuccess.style.display = 'block';
                    setTimeout(() => { executeDrop(med); closeModal(dropModal); }, 1500);
                });
                dropModalList.appendChild(item);
            });
            openModal('drop-modal');
        });
    }

    function executeDrop(med) {
        const eyeRadios = document.getElementsByName('eye'); let selectedEye = 'both';
        for (let r of eyeRadios) if (r.checked) selectedEye = r.value;

        const now = new Date();
        const newDropRecord = {
            id: Date.now(), medId: med.id, medName: med.name, eye: selectedEye,
            dropsQty: med.dropsQty || 1, 
            date: getLocalYMD(now), time: now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) 
        };

        const history = JSON.parse(localStorage.getItem('appDropHistory')) || []; history.push(newDropRecord);
        localStorage.setItem('appDropHistory', JSON.stringify(history));
        const isPauseEnabled = med.pauseEnabled !== undefined ? med.pauseEnabled : false; 
        const pauseMins = med.pauseDuration || 10;
        
        if (isPauseEnabled) {
            const endTimeMs = Date.now() + (pauseMins * 60 * 1000);
            localStorage.setItem('appTimerEndTime', endTimeMs.toString()); 
            startTimer(endTimeMs);

            // --- [ПОЧАТОК ВСТАВКИ] ВІДПРАВЛЯЄМО ОФЛАЙН-ТАЙМЕР У SERVICE WORKER ---
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SCHEDULE_NOTIFICATION',
                    title: uiText.notif_type_pause, // СТАЛО ТАК
                    body: uiText.notif_timer_done,
                    text: uiText.notif_timer_done, // Додано для захисту від втрати тексту
                    timestamp: endTimeMs, 
                    tag: 'auto-pause-' + med.id,
                    isPause: true // Маркер для повної ізоляції
                });
                console.log(`[Triggers API] Заплановано офлайн-пуш паузи для "${med.name}" через ${pauseMins} хв.`);
            }
            // --- [КІНЕЦЬ ВСТАВКИ] ------------------------------------------------
            // === НОВЕ: ПАРАЛЕЛЬНИЙ ХМАРНИЙ ТАЙМЕР ДЛЯ IOS ===
            if (navigator.onLine && 'serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => reg.pushManager.getSubscription()).then(sub => {
                    if (sub) {
                        fetch('/api/pause-push', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                subscription: sub,
                                title: uiText.notif_type_pause, // СТАЛО ТАК
                                body: uiText.notif_timer_done,
                                delayMs: pauseMins * 60 * 1000,
                                soundEnabled: localStorage.getItem('appSoundEnabled') !== 'false'
                            })
                        }).catch(e => console.log('Не вдалося запустити хмарну паузу', e));
                    }
                });
            }
            // ================================================
        } else {
            if (btnDrop) { btnDrop.style.transform = 'scale(1.1)'; setTimeout(() => btnDrop.style.transform = '', 150); }
        }
        updateTodayStats(); renderMedications(); 
        if(document.getElementById('screen-calendar').classList.contains('active')) renderCalendar();
        syncPushesWithServer();
    }

    // --- КАЛЕНДАР ТА СТАТИСТИКА ---
    let currentCalDate = new Date();
    const calendarGrid = document.getElementById('calendar-grid');
    const dayModal = document.getElementById('day-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-date-title');

    let currentStatsOffset = 0;
    const statsPrev = document.getElementById('stats-prev');
    const statsNext = document.getElementById('stats-next');
    const statsSelector = document.getElementById('stats-range-selector');
    
    if(statsPrev) statsPrev.addEventListener('click', () => { currentStatsOffset--; renderStats(); });
    if(statsNext) statsNext.addEventListener('click', () => { currentStatsOffset++; renderStats(); });
    if(statsSelector) statsSelector.addEventListener('change', () => { currentStatsOffset = 0; renderStats(); });

    function renderStats() {
        const selector = document.getElementById('stats-range-selector');
        const container = document.getElementById('stats-chart-container');
        const periodText = document.getElementById('stats-current-period');
        if (!container || !selector) return;

        const range = selector.value;
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        
        let data = [];
        const now = new Date();
        
        function pad(n) { return String(n).padStart(2, '0'); }
        let periodLabel = "";

        if (range === 'week') {
            const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (currentStatsOffset * 7));
            let dayOfWeek = targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1; 
            const startOfWeek = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() - dayOfWeek);
            const endOfWeek = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() - dayOfWeek + 6);
            
            periodLabel = `${pad(startOfWeek.getDate())}.${pad(startOfWeek.getMonth()+1)}.${startOfWeek.getFullYear()} - ${pad(endOfWeek.getDate())}.${pad(endOfWeek.getMonth()+1)}.${endOfWeek.getFullYear()}`;

            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
                const dStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
                
                const dayDrops = history.filter(h => h.date === dStr);
                data.push({ 
                    label: uiText.weekdays[i], 
                    labelFull: d.toLocaleDateString('uk-UA'), 
                    value: dayDrops.reduce((acc, curr) => acc + (parseInt(curr.dropsQty) || 1), 0),
                    rawDrops: dayDrops
                });
            }
        } else if (range === 'month') {
            const targetDate = new Date(now.getFullYear(), now.getMonth() + currentStatsOffset, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            periodLabel = `${uiText.months[month]} ${year}`;

            for (let i = 1; i <= daysInMonth; i++) {
                const dStr = `${year}-${pad(month+1)}-${pad(i)}`;
                const dayDrops = history.filter(h => h.date === dStr);
                data.push({ 
                    label: String(i), 
                    labelFull: `${pad(i)}.${pad(month+1)}.${year}`, 
                    value: dayDrops.reduce((acc, curr) => acc + (parseInt(curr.dropsQty) || 1), 0),
                    rawDrops: dayDrops
                });
            }
        } else if (range === 'year') {
            const year = now.getFullYear() + currentStatsOffset;
            periodLabel = `${year}`;

            for (let i = 0; i < 12; i++) {
                const mStr = `${year}-${pad(i+1)}`;
                const monthDrops = history.filter(h => h.date.startsWith(mStr));
                data.push({ 
                    label: uiText.months[i].substring(0,3), 
                    labelFull: `${uiText.months[i]} ${year}`, 
                    value: monthDrops.reduce((acc, curr) => acc + (parseInt(curr.dropsQty) || 1), 0),
                    rawDrops: monthDrops
                });
            }
        }

        if(periodText) periodText.innerText = periodLabel;
        window.lastStatsData = data;
        window.lastStatsPeriod = periodLabel;

        const maxVal = Math.max(...data.map(d => d.value), 1);
        
        container.innerHTML = '';
        data.forEach(item => {
            const group = document.createElement('div');
            group.className = 'stat-bar-group';
            
            const heightPct = item.value > 0 ? (item.value / maxVal) * 85 : 2; 
            
            group.innerHTML = `
                <div class="stat-bar-wrapper">
                    <div class="stat-bar-value">${item.value > 0 ? item.value : ''}</div>
                    <div class="stat-bar" style="height: ${heightPct}%;"></div>
                </div>
                <div class="stat-bar-label">${item.label}</div>
            `;
            container.appendChild(group);
        });
    }

    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', () => {
            const printArea = document.getElementById('print-area');
            const periodLabel = window.lastStatsPeriod || "";
            
            let html = `
                <div style="font-family: sans-serif; color: black; padding: 20px; background: white;">
                    <h2 style="color: #2b533f; border-bottom: 2px solid #4ade80; padding-bottom: 10px; margin-top: 0;">Krapliks - Статистика закапувань</h2>
                    <h3 style="color: #333;">Період: ${periodLabel}</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f1eb; text-align: left;">Дата / Період</th>
                            <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f1eb; text-align: center;">Загалом крапель</th>
                            <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f1eb; text-align: left;">Деталізація</th>
                        </tr>
            `;
            
            let totalPeriodDrops = 0;
            let totalLeft = 0;
            let totalRight = 0;
            let totalBoth = 0;

            const dataToPrint = window.lastStatsData || [];
            
            dataToPrint.forEach(item => {
                let detailsHtml = '';
                const grouped = {};

                item.rawDrops.forEach(d => {
                    const q = parseInt(d.dropsQty) || 1;
                    totalPeriodDrops += q;
                    if(d.eye === 'left') totalLeft += q;
                    else if(d.eye === 'right') totalRight += q;
                    else totalBoth += q;

                    const eStr = translateEyeValue(d.eye);
                    const k = `${d.medName} (${eStr})`;
                    grouped[k] = (grouped[k] || 0) + q;
                });

                for (const [k, v] of Object.entries(grouped)) {
                    detailsHtml += `<div style="margin-bottom:2px;">• ${k}: <b>${v} кр.</b></div>`;
                }
                if(detailsHtml === '') detailsHtml = '<span style="color:#999;">-</span>';

                html += `<tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.labelFull}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">${item.value > 0 ? item.value : '-'}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${detailsHtml}</td>
                </tr>`;
            });

            html += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">ЗАГАЛОМ ЗА ПЕРІОД:</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #2b533f; font-size: 16px;">${totalPeriodDrops}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; font-size: 13px;">
                                Обидва: <b>${totalBoth} кр.</b><br>
                                Ліве: <b>${totalLeft} кр.</b><br>
                                Праве: <b>${totalRight} кр.</b>
                            </td>
                        </tr>
                    </table>
                </div>`;
                
            printArea.innerHTML = html;
            window.print();
        });
    }

    function deleteDropSession(dropId) {
        if(confirm(uiText.alert_delete_drop)) {
            let history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
            history = history.filter(h => h.id !== dropId); localStorage.setItem('appDropHistory', JSON.stringify(history));
            closeModal(dayModal); renderCalendar(); updateTodayStats(); renderMedications(); syncPushesWithServer();
        }
    }

    function renderCalendar() {
        if(!calendarGrid) return;
        calendarGrid.innerHTML = '';
        const year = currentCalDate.getFullYear(); const month = currentCalDate.getMonth();
        document.getElementById('calendar-month-year').innerText = `${uiText.months[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
        let emptyDays = firstDay === 0 ? 6 : firstDay - 1;

        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const doctorVisitsList = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];
        const doctorVisitsSet = new Set(doctorVisitsList.map(v => v.date));
        const daysWithDrops = new Set(history.map(item => item.date));
        const expiryDates = new Set();
        
        savedMeds.forEach(med => {
            const op = new Date(med.openedDate); op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
            expiryDates.add(getLocalYMD(op));
        });

        const todayStr = getLocalYMD();

        for (let i = 0; i < emptyDays; i++) {
            const emptyDiv = document.createElement('div'); emptyDiv.className = 'cal-day empty'; calendarGrid.appendChild(emptyDiv);
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
                modalTitle.innerText = `Деталі: ${cellDate.toLocaleDateString('uk-UA')}`;
                
                modalBody.innerHTML = '';
                
                const alertsWrapper = document.createElement('div');
                alertsWrapper.style.display = 'flex';
                alertsWrapper.style.flexDirection = 'column';
                alertsWrapper.style.gap = '8px';

                const dayVisits = doctorVisitsList.filter(v => v.date === cellDateStr);
                dayVisits.forEach(v => {
                    alertsWrapper.innerHTML += `<div class="modal-alert doctor-alert">
                        <img src="assets/icons/doctor.svg" class="inline-icon" style="flex-shrink: 0; margin-right: 8px;"> 
                        <span>Заплановано візит до лікаря о ${v.time}</span>
                    </div>`;
                });
                
                const expiringMeds = savedMeds.filter(med => {
                    const op = new Date(med.openedDate); op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1);
                    return getLocalYMD(op) === cellDateStr;
                });
                
                expiringMeds.forEach(med => { 
                    alertsWrapper.innerHTML += `<div class="modal-alert expiry-alert">
                        <img src="assets/icons/warning.svg" class="inline-icon" style="flex-shrink: 0; margin-right: 8px;"> 
                        <span>Термін придатності <b>${med.name}</b> закінчується</span>
                    </div>`; 
                });
                
                modalBody.appendChild(alertsWrapper);

                const historyWrapper = document.createElement('div');
                if (alertsWrapper.innerHTML !== '') {
                    historyWrapper.style.marginTop = '16px';
                    historyWrapper.style.paddingTop = '16px';
                    historyWrapper.style.borderTop = '1px solid rgba(255,255,255,0.05)';
                }

                if(dayHistory.length === 0) {
                    historyWrapper.innerHTML = `<p class="empty-state-text">Немає записів за цей день.</p>`;
                } else {
                    dayHistory.forEach(drop => {
                        const item = document.createElement('div'); item.className = 'modal-list-item';
                        item.innerHTML = `<div class="history-info"><span class="history-time">${drop.time}</span> ${drop.medName} (${translateEyeValue(drop.eye)}, ${drop.dropsQty || 1} кр.)</div><button class="icon-action-btn delete-med-btn">${iconDeleteSvg}</button>`;
                        item.querySelector('button').addEventListener('click', () => deleteDropSession(drop.id));
                        historyWrapper.appendChild(item);
                    });
                }
                modalBody.appendChild(historyWrapper);
                openModal('day-modal');
            });
            calendarGrid.appendChild(dayDiv);
        }
        
        renderStats();
    }

    document.getElementById('cal-prev-month')?.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('cal-next-month')?.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendar(); });

    // --- СИНХРОНІЗАЦІЯ З СЕРВЕРОМ ---
    const PUBLIC_VAPID_KEY = 'BJpknjzyzE5DAdJIrnoQKdr2WDroqKVp179pnCT3dj3mxq2ksLXUDUN3ONbma9xenddguEZWOvLjg6AOzMwbxNo';

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
        return outputArray;
    }

    function generatePushQueue() {
        const queue = []; const now = new Date();
        const savedMeds = JSON.parse(localStorage.getItem('appMedications')) || [];
        const history = JSON.parse(localStorage.getItem('appDropHistory')) || [];
        const visits = JSON.parse(localStorage.getItem('appDoctorVisits')) || [];

        visits.forEach(v => {
            const [h, m] = (v.time || '12:00').split(':').map(Number);
            const vDate = new Date(v.date); vDate.setDate(vDate.getDate() - 1); vDate.setHours(h, m, 0, 0);
            if (vDate > now) queue.push({ timestamp: vDate.getTime(), type: 'doctor', title: uiText.notif_type_doc, body: `${uiText.reminder_tmrw} о ${v.time} (${new Date(v.date).toLocaleDateString('uk-UA')})` });
        });

        savedMeds.forEach(med => {
            const op = new Date(med.openedDate); op.setDate(op.getDate() + (parseInt(med.expDays) || 28) - 1); op.setHours(12, 0, 0, 0);
            if (op > now) queue.push({ timestamp: op.getTime(), type: 'expiry', title: uiText.notif_type_exp, body: `Термін придатності ${med.name} закінчується завтра` });
        });

        savedMeds.forEach(med => {
            if (!med.scheduleType || med.reminderEnabled === false || med.reminderOffset === 'off') return;
            const offsetMins = parseInt(med.reminderOffset) || 0;

            if (med.scheduleType === 'exact' && med.scheduleTimes && med.scheduleTimes.length > 0) {
                for (let i = 0; i < 3; i++) {
                    const tDate = new Date(now); tDate.setDate(tDate.getDate() + i);
                    med.scheduleTimes.forEach(timeStr => {
                        const [h, m] = timeStr.split(':').map(Number); tDate.setHours(h, m, 0, 0);
                        const pushTime = tDate.getTime() - (offsetMins * 60 * 1000);
                        const timeFmt = new Date(pushTime).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
                        if (pushTime > now.getTime()) queue.push({ timestamp: pushTime, type: 'reminder', title: uiText.notif_type_rem, body: `${uiText.time_to_drop} ${med.name} [${timeFmt}]` });
                    });
                }
            } else if (med.scheduleType === 'interval' && med.scheduleValue) {
                const medDrops = history.filter(h => h.medId === med.id).sort((a, b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
                if (medDrops.length > 0) {
                    const lastD = medDrops[medDrops.length - 1];
                    const nextT = new Date(new Date(`${lastD.date}T${lastD.time}`).getTime() + parseFloat(med.scheduleValue) * 60 * 60 * 1000);
                    const pushTime = nextT.getTime() - (offsetMins * 60 * 1000);
                    const timeFmtInt = new Date(pushTime).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
                    if (pushTime > now.getTime()) queue.push({ timestamp: pushTime, type: 'reminder', title: uiText.notif_type_rem, body: `${uiText.time_to_drop} ${med.name} [${timeFmtInt}]` });
                }
            }
        });

        const endTimeStr = localStorage.getItem('appTimerEndTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            // ЗМІНЕНО: type тепер 'pause' замість 'reminder', і додано поле text
            if (endTime > now.getTime()) queue.push({ timestamp: endTime, type: 'pause', title: uiText.notif_type_pause, body: uiText.notif_timer_done, text: uiText.notif_timer_done, isPause: true });
        }
        return queue;
    }

    async function syncPushesWithServer() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
        const reg = await navigator.serviceWorker.ready; 
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return;
        
        const queue = generatePushQueue(); // Ваша готова черга всіх майбутніх подій
        const soundEnabled = localStorage.getItem('appSoundEnabled') !== 'false';
        const localHistory = JSON.parse(localStorage.getItem('appNotifications')) || [];
        
        if (navigator.serviceWorker.controller) {
            // 1. Спершу даємо команду видалити всі старі заплановані години з пам'яті
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_OLD_TRIGGERS' });

            // 2. Тепер записуємо в абсолютно чистий будильник новий актуальний розклад
            queue.forEach(item => {
                // Витягуємо безпечну назву для тегу (тільки літери та цифри), щоб уникнути колізій
                const safeName = item.body ? item.body.replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, '').slice(-15) : 'drop';
                const deterministicTag = `auto-${item.type}-${item.timestamp}-${safeName}`;

                // Відправляємо кожну подію з розкладу в наш sw.js
                navigator.serviceWorker.controller.postMessage({
                    type: 'SCHEDULE_NOTIFICATION',
                    title: item.title || 'Krapliks',
                    body: item.body,
                    timestamp: item.timestamp,
                    tag: deterministicTag 
                });
            });
            console.log(`[Triggers API] Старі тригери очищено. Заплановано ${queue.length} автономних сповіщень в офлайн-чергу.`);
        }

        // === [ІМУНІТЕТ ДЛЯ ПАУЗ]: Відфільтровуємо паузи перед відправкою на хмару ===
        const serverQueue = queue.filter(item => item.type !== 'pause');
        
        // Ваша стандартна відправка черги на сервер Render (але вже без пауз)
        await fetch('/api/sync-pushes', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, queue: serverQueue, soundEnabled, localHistory })
        });
    } catch (e) {
        console.warn('[Sync] Помилка відправки на Render. Реєструємо Background Sync...', e);
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const reg = await navigator.serviceWorker.ready;
                await reg.sync.register('sync-pushes-queue');
                console.log('[Sync] Тег sync-pushes-queue успішно зареєстровано.');
            } catch (syncErr) {
                console.error('[Sync] Не вдалося зареєструвати фонову синхронізацію:', syncErr);
            }
        }
    }
}

    async function registerServiceWorkerAndSubscribe() {
        if (Notification.permission === 'default' && !localStorage.getItem('pushRequested')) {
            localStorage.setItem('pushRequested', 'true');
            await Notification.requestPermission();
        }

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                // 1. Реєструємо Service Worker
                await navigator.serviceWorker.register('/sw.js');
                
                // 2. ДОДАНО: Суворо чекаємо, поки він ТОЧНО стане активним і готовим до роботи
                const reg = await navigator.serviceWorker.ready; 
                
                if (Notification.permission === 'granted') {
                    // 3. Підписуємося на пуші тільки після повної готовності
                    const subscription = await reg.pushManager.subscribe({ 
                        userVisibleOnly: true, 
                        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY) 
                    });
                    await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(subscription), headers: { 'Content-Type': 'application/json' } });
                    syncPushesWithServer();
                }
            } catch (error) { console.error('Помилка реєстрації SW:', error); }
        }
    }

    // --- ІНІЦІАЛІЗАЦІЯ ---
    // --- ЗАХИСТ ПАМ'ЯТІ ДОДАТКА ВІД ОЧИЩЕННЯ БРАУЗЕРОМ ---
async function requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`[Storage] Статус постійного сховища: ${isPersisted ? 'ПОСТІЙНЕ (Захищено)' : 'ТИМЧАСОВЕ'}`);
    }
}
requestPersistentStorage();

    updateBadge(); checkTimerOnLoad(); renderDoctorVisits(); checkDoctorVisitsUI();
    renderMedications(); updateTodayStats(); renderCalendar(); renderNotifications();
    registerServiceWorkerAndSubscribe();

    setTimeout(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, 50);

// --- УПРАВЛІННЯ ІНДИКАТОРОМ МЕРЕЖІ ---
    const offlineBanner = document.getElementById('offline-banner');
    let offlineTimer = null; // Змінна для зберігання таймера

    function updateNetworkStatus() {
        if (!offlineBanner) return;

        // Очищаємо попередній таймер при будь-якій зміні статусу
        if (offlineTimer) clearTimeout(offlineTimer);

        if (navigator.onLine) {
            offlineBanner.classList.add('hidden');
        } else {
            offlineBanner.classList.remove('hidden');

            // Автоматично ховаємо банер через 5 секунд (5000 мс)
            offlineTimer = setTimeout(() => {
                offlineBanner.classList.add('hidden');
            }, 5000);
        }
    }

    window.addEventListener('online', () => {
        updateNetworkStatus();
        console.log('[Network] З\'явився інтернет. Примусово відправляємо розклад на сервер...');
        // Миттєво синхронізуємо всі створені в офлайні нагадування з Render
        syncPushesWithServer(); 
    });
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
});

// === [РОЗУМНЕ ОЧИЩЕННЯ: Видаляємо пуші, старші за 7 днів] ===
function cleanExpiredNotifications(daysToKeep = 7) {
    const dbName = 'KrapliksDB';
    const storeName = 'offline_notifs';
    const expirationLimit = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

    const request = indexedDB.open(dbName);

    request.onsuccess = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) return;

        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const cursorRequest = store.openCursor();

        let deletedCount = 0;

        cursorRequest.onsuccess = function(e) {
            const cursor = e.target.result;
            if (cursor) {
                // Якщо час сповіщення минув більше 7 днів тому — видаляємо запис
                if (cursor.value.timestamp < expirationLimit) {
                    cursor.delete();
                    deletedCount++;
                }
                cursor.continue(); // Переходимо до наступного запису
            } else if (deletedCount > 0) {
                console.log(`[Storage] Автоочищення: видалено ${deletedCount} застарілих сповіщень з бази.`);
            }
        };
    };

    request.onerror = function() {
        console.error('[Storage] Помилка доступу до IndexedDB при очищенні.');
    };
}

// Запускаємо очищення у фоні при завантаженні додатка
window.addEventListener('load', () => {
    cleanExpiredNotifications(7); // Залишаємо історію тільки за останній тиждень
});