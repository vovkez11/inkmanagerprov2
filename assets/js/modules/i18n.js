/**
 * InkManager Pro - Internationalization Module
 * Handles translations and currency formatting
 */

// Currency configuration for different locales
export const currencyConfig = {
    'en': { symbol: '$', code: 'USD', locale: 'en-US' },
    'es': { symbol: '€', code: 'EUR', locale: 'es-ES' },
    'ru': { symbol: '₽', code: 'RUB', locale: 'ru-RU' },
    'he': { symbol: '₪', code: 'ILS', locale: 'he-IL' }
};

// Translation resources for all supported languages
{
                    en: {
                        // Navigation
                        "main_navigation": "Main Navigation",
                        "dashboard": "Dashboard",
                        "clients": "Clients",
                        "sessions": "Sessions",
                        "inventory": "Inventory",
                        "language": "Language",
                        "all": "All",
                        "calendar": "Calendar",
                        "reports": "Reports",
                        "quick_actions": "Quick Actions",
                        "add_client": "Add Client",
                        "schedule_session": "Schedule Session",
                        "add_inventory": "Add Inventory",
                        "collapse_sidebar": "Collapse Sidebar",
                        "expand_sidebar": "Expand Sidebar",
                        
                        // Header
                        "tagline": "Professional Tattoo Studio Management System",
                        "install_app": "Install App",
                        "apply": "Apply",
                        
                        // Dashboard
                        "studio_overview": "Studio Overview",
                        "backup_data": "Backup Data",
                        "total_clients": "Total Clients",
                        "upcoming_sessions": "Upcoming Sessions",
                        "monthly_revenue": "Monthly Revenue",
                        "low_stock_items": "Low Stock Items",
                        "todays_schedule": "Today's Schedule",
                        "no_sessions_today": "No Sessions Today",
                        "schedule_clear": "Your schedule is clear for today",
                        "quick_insights": "Quick Insights",
                        "no_data_yet": "No Data Yet",
                        "start_adding_data": "Start adding clients and sessions to see insights",
                        
                        // Clients
                        "client_management": "Client Management",
                        "new_client": "New Client",
                        "search_clients": "Search clients by name, phone, or email...",
                        "no_clients_yet": "No Clients Yet",
                        "build_client_database": "Start building your professional client database",
                        "add_first_client": "Add Your First Client",
                        "edit_client": "Edit Client",
                        "update_client": "Update Client",
                        "regular_client": "Regular",
                        
                        // Sessions
                        "session_management": "Session Management",
                        "new_session": "New Session",
                        "no_sessions_scheduled": "No Sessions Scheduled",
                        "schedule_first_session": "Schedule your first professional tattoo session",
                        "create_first_session": "Create First Session",
                        "edit_session": "Edit Session",
                        "update_session": "Update Session",
                        "session_completed": "Completed",
                        "session_today": "Today",
                        "session_upcoming": "Upcoming",
                        "starting_soon": "Starting soon!",
                        
                        // Inventory
                        "inventory_management": "Inventory Management",
                        "new_item": "New Item",
                        "search_inventory": "Search inventory items...",
                        "no_inventory_items": "No Inventory Items",
                        "track_supplies": "Track your needles, ink, and professional supplies",
                        "add_first_item": "Add First Item",
                        "edit_inventory_item": "Edit Inventory Item",
                        "update_item": "Update Item",
                        "low_stock": "Low Stock",
                        
                        // Calendar
                        "studio_calendar": "Studio Calendar",
                        "previous": "Previous",
                        "next": "Next",
                        
                        // Reports
                        "analytics_reports": "Analytics & Reports",
                        "total_sessions": "Total Sessions",
                        "total_revenue": "Total Revenue",
                        "avg_session_price": "Avg Session Price",
                        "client_retention": "Client Retention",
                        "data_export": "Data Export",
                        "full_backup": "Full Backup",
                        "export_clients": "Export Clients",
                        "export_sessions": "Export Sessions",
                        "export_inventory": "Export Inventory",
                        
                        // Install Prompt
                        "install_prompt": "Install InkManager Pro for the ultimate experience?",
                        "install_now": "Install Now",
                        "maybe_later": "Maybe Later",
                        
                        // Client Modal
                        "create_new_client": "Create New Client",
                        "full_name": "Full Name",
                        "name_placeholder": "John Smith",
                        "phone_number": "Phone Number",
                        "phone_placeholder": "+1 (555) 123-4567",
                        "email_address": "Email Address",
                        "email_placeholder": "john@example.com",
                        "birth_date": "Birth Date",
                        "skin_type": "Skin Type",
                        "select_skin_type": "Select skin type...",
                        "normal": "Normal",
                        "sensitive": "Sensitive",
                        "oily": "Oily",
                        "dry": "Dry",
                        "combination": "Combination",
                        "emergency_contact": "Emergency Contact",
                        "emergency_placeholder": "Name and phone number",
                        "notes_preferences": "Notes & Preferences",
                        "notes_placeholder": "Allergies, style preferences, important medical notes, design ideas...",
                        "cancel": "Cancel",
                        "save_client": "Save Client",
                        
                        // Session Modal
                        "schedule_session": "Schedule Session",
                        "client": "Client",
                        "select_client": "Select a client...",
                        "session_title": "Session Title",
                        "session_title_placeholder": "e.g., Sleeve Outline, Cover-up, New Tattoo...",
                        "date_time": "Date & Time",
                        "duration_hours": "Duration (hours)",
                        "price": "Price",
                        "materials_used": "Materials Used",
                        "item": "Item",
                        "select_item": "Select item...",
                        "quantity": "Quantity",
                        "add": "Add",
                        "session_notes": "Session Notes",
                        "session_notes_placeholder": "Design details, placement, special requests, aftercare instructions...",
                        "save_session": "Save Session",
                        "materials": "Materials",
                        
                        // Inventory Modal
                        "new_inventory_item": "New Inventory Item",
                        "item_name": "Item Name",
                        "item_name_placeholder": "Round Liner 5RL, Eternal Ink Black, Disposable Grips...",
                        "type": "Type",
                        "select_type": "Select type...",
                        "needle": "Needle",
                        "ink": "Ink",
                        "machine": "Machine",
                        "supply": "Supply",
                        "aftercare": "Aftercare",
                        "safety": "Safety Equipment",
                        "current_quantity": "Current Quantity",
                        "low_stock_alert": "Low Stock Alert",
                        "price_per_unit": "Price per Unit",
                        "supplier_notes": "Supplier & Notes",
                        "supplier_notes_placeholder": "Supplier information, color codes, expiration dates...",
                        "save_item": "Save Item",
                        
                        // Additional UI elements
                        "last_visit": "Last visit",
                        "total_sessions": "Total sessions",
                        "last_updated": "Updated",
                        
                        // Settings
                        "settings": "Settings",
                        "appearance": "Appearance",
                        "theme": "Theme",
                        "dark_theme": "Dark (Default)",
                        "light_theme": "Light",
                        "auto_theme": "Auto (System)",
                        "language_preference": "Language Preference",
                        "business_settings": "Business Settings",
                        "studio_name": "Studio Name",
                        "currency_symbol": "Currency Symbol",
                        "default_session_duration": "Default Session Duration (hours)",
                        "inventory_settings": "Inventory Settings",
                        "default_low_stock_alert": "Default Low Stock Alert Threshold",
                        "low_stock_help": "You'll be notified when items reach this quantity",
                        "auto_deduct_materials": "Auto-deduct materials after sessions",
                        "notifications": "Notifications",
                        "enable_notifications": "Enable notifications",
                        "notifications_help": "Get notified about upcoming sessions",
                        "session_reminder": "Session Reminder (hours before)",
                        "reminder_help": "You'll be notified this many hours before a session starts",
                        "test_notifications": "Test Notifications",
                        "data_management": "Data Management",
                        "auto_save": "Auto-save changes",
                        "auto_save_help": "Changes are saved automatically to your browser",
                        "backup_all_data": "Backup All Data",
                        "import_data": "Import Data",
                        "clear_all_data": "Clear All Data",
                        "about": "About",
                        "about_description": "Professional Tattoo Studio Management System",
                        "made_with": "Made with",
                        "for_artists": "for tattoo artists worldwide",
                        "reset_defaults": "Reset to Defaults",
                        "save_settings": "Save Settings",
                        "settings_saved": "Settings saved successfully!",
                        "settings_reset": "Settings reset to defaults",
                        "confirm_clear_data": "Are you sure you want to clear all data? This cannot be undone!",
                        "data_cleared": "All data has been cleared"
                    },
                    es: {
                        // Navigation
                        "main_navigation": "Navegación Principal",
                        "dashboard": "Panel",
                        "clients": "Clientes",
                        "sessions": "Sesiones",
                        "inventory": "Inventario",
                        "language": "Idioma",
                        "all": "Todo",
                        "calendar": "Calendario",
                        "reports": "Informes",
                        "quick_actions": "Acciones Rápidas",
                        "add_client": "Agregar Cliente",
                        "schedule_session": "Programar Sesión",
                        "add_inventory": "Agregar Inventario",
                        "collapse_sidebar": "Contraer barra lateral",
                        "expand_sidebar": "Expandir barra lateral",
                        
                        // Header
                        "tagline": "Sistema Profesional de Gestión de Estudios de Tatuajes",
                        "install_app": "Instalar App",
                        "apply": "Aplicar",
                        
                        // Dashboard
                        "studio_overview": "Resumen del Estudio",
                        "backup_data": "Respaldar Datos",
                        "total_clients": "Clientes Totales",
                        "upcoming_sessions": "Sesiones Próximas",
                        "monthly_revenue": "Ingresos Mensuales",
                        "low_stock_items": "Artículos Bajos en Stock",
                        "todays_schedule": "Horario de Hoy",
                        "no_sessions_today": "No Hay Sesiones Hoy",
                        "schedule_clear": "Tu horario está libre para hoy",
                        "quick_insights": "Información Rápida",
                        "no_data_yet": "Aún No Hay Datos",
                        "start_adding_data": "Comienza agregando clientes y sesiones para ver información",
                        
                        // Clients
                        "client_management": "Gestión de Clientes",
                        "new_client": "Nuevo Cliente",
                        "search_clients": "Buscar clientes por nombre, teléfono o email...",
                        "no_clients_yet": "Aún No Hay Clientes",
                        "build_client_database": "Comienza a construir tu base de datos profesional de clientes",
                        "add_first_client": "Agregar Tu Primer Cliente",
                        "edit_client": "Editar Cliente",
                        "update_client": "Actualizar Cliente",
                        "regular_client": "Regular",
                        
                        // Sessions
                        "session_management": "Gestión de Sesiones",
                        "new_session": "Nueva Sesión",
                        "no_sessions_scheduled": "No Hay Sesiones Programadas",
                        "schedule_first_session": "Programa tu primera sesión profesional de tatuaje",
                        "create_first_session": "Crear Primera Sesión",
                        "edit_session": "Editar Sesión",
                        "update_session": "Actualizar Sesión",
                        "session_completed": "Completada",
                        "session_today": "Hoy",
                        "session_upcoming": "Próxima",
                        "starting_soon": "¡Comenzando pronto!",
                        
                        // Inventory
                        "inventory_management": "Gestión de Inventario",
                        "new_item": "Nuevo Artículo",
                        "search_inventory": "Buscar artículos de inventario...",
                        "no_inventory_items": "No Hay Artículos en Inventario",
                        "track_supplies": "Rastrea tus agujas, tinta y suministros profesionales",
                        "add_first_item": "Agregar Primer Artículo",
                        "edit_inventory_item": "Editar Artículo de Inventario",
                        "update_item": "Actualizar Artículo",
                        "low_stock": "Stock Bajo",
                        
                        // Calendar
                        "studio_calendar": "Calendario del Estudio",
                        "previous": "Anterior",
                        "next": "Siguiente",
                        
                        // Reports
                        "analytics_reports": "Análisis e Informes",
                        "total_sessions": "Sesiones Totales",
                        "total_revenue": "Ingresos Totales",
                        "avg_session_price": "Precio Promedio por Sesión",
                        "client_retention": "Retención de Clientes",
                        "data_export": "Exportar Datos",
                        "full_backup": "Respaldo Completo",
                        "export_clients": "Exportar Clientes",
                        "export_sessions": "Exportar Sesiones",
                        "export_inventory": "Exportar Inventario",
                        
                        // Install Prompt
                        "install_prompt": "¿Instalar InkManager Pro para la mejor experiencia?",
                        "install_now": "Instalar Ahora",
                        "maybe_later": "Quizás Más Tarde",
                        
                        // Client Modal
                        "create_new_client": "Crear Nuevo Cliente",
                        "full_name": "Nombre Completo",
                        "name_placeholder": "Juan Pérez",
                        "phone_number": "Número de Teléfono",
                        "phone_placeholder": "+1 (555) 123-4567",
                        "email_address": "Correo Electrónico",
                        "email_placeholder": "juan@ejemplo.com",
                        "birth_date": "Fecha de Nacimiento",
                        "skin_type": "Tipo de Piel",
                        "select_skin_type": "Seleccionar tipo de piel...",
                        "normal": "Normal",
                        "sensitive": "Sensible",
                        "oily": "Grasa",
                        "dry": "Seca",
                        "combination": "Mixta",
                        "emergency_contact": "Contacto de Emergencia",
                        "emergency_placeholder": "Nombre y número de teléfono",
                        "notes_preferences": "Notas y Preferencias",
                        "notes_placeholder": "Alergias, preferencias de estilo, notas médicas importantes, ideas de diseño...",
                        "cancel": "Cancelar",
                        "save_client": "Guardar Cliente",
                        
                        // Session Modal
                        "schedule_session": "Programar Sesión",
                        "client": "Cliente",
                        "select_client": "Seleccionar un cliente...",
                        "session_title": "Título de la Sesión",
                        "session_title_placeholder": "ej., Contorno de Manga, Cover-up, Tatuaje Nuevo...",
                        "date_time": "Fecha y Hora",
                        "duration_hours": "Duración (horas)",
                        "price": "Precio",
                        "materials_used": "Materiales Utilizados",
                        "item": "Artículo",
                        "select_item": "Seleccionar artículo...",
                        "quantity": "Cantidad",
                        "add": "Agregar",
                        "session_notes": "Notas de la Sesión",
                        "session_notes_placeholder": "Detalles del diseño, ubicación, solicitudes especiales, instrucciones de cuidado posterior...",
                        "save_session": "Guardar Sesión",
                        "materials": "Materiales",
                        
                        // Inventory Modal
                        "new_inventory_item": "Nuevo Artículo de Inventario",
                        "item_name": "Nombre del Artículo",
                        "item_name_placeholder": "Round Liner 5RL, Tinta Eternal Negra, Empuñaduras Desechables...",
                        "type": "Tipo",
                        "select_type": "Seleccionar tipo...",
                        "needle": "Aguja",
                        "ink": "Tinta",
                        "machine": "Máquina",
                        "supply": "Suministro",
                        "aftercare": "Cuidado Posterior",
                        "safety": "Equipo de Seguridad",
                        "current_quantity": "Cantidad Actual",
                        "low_stock_alert": "Alerta de Stock Bajo",
                        "price_per_unit": "Precio por Unidad",
                        "supplier_notes": "Proveedor y Notas",
                        "supplier_notes_placeholder": "Información del proveedor, códigos de color, fechas de vencimiento...",
                        "save_item": "Guardar Artículo",
                        
                        // Additional UI elements
                        "last_visit": "Última visita",
                        "total_sessions": "Total de sesiones",
                        "last_updated": "Actualizado"
                    },
                    ru: {
                        // Navigation
                        "main_navigation": "Основная Навигация",
                        "dashboard": "Панель управления",
                        "clients": "Клиенты",
                        "sessions": "Сеансы",
                        "inventory": "Инвентарь",
                        "language": "Язык",
                        "all": "Все",
                        "calendar": "Календарь",
                        "reports": "Отчеты",
                        "quick_actions": "Быстрые действия",
                        "add_client": "Добавить клиента",
                        "schedule_session": "Запланировать сеанс",
                        "add_inventory": "Добавить инвентарь",
                        "collapse_sidebar": "Свернуть панель",
                        "expand_sidebar": "Развернуть панель",
                        
                        // Header
                        "tagline": "Профессиональная система управления тату-студией",
                        "install_app": "Установить приложение",
                        "apply": "Применить",
                        
                        // Dashboard
                        "studio_overview": "Обзор студии",
                        "backup_data": "Резервная копия данных",
                        "total_clients": "Всего клиентов",
                        "upcoming_sessions": "Предстоящие сеансы",
                        "monthly_revenue": "Ежемесячный доход",
                        "low_stock_items": "Товары с низким запасом",
                        "todays_schedule": "Сегодняшнее расписание",
                        "no_sessions_today": "Сегодня нет сеансов",
                        "schedule_clear": "Ваше расписание на сегодня свободно",
                        "quick_insights": "Быстрая аналитика",
                        "no_data_yet": "Пока нет данных",
                        "start_adding_data": "Начните добавлять клиентов и сеансы, чтобы увидеть аналитику",
                        
                        // Clients
                        "client_management": "Управление клиентами",
                        "new_client": "Новый клиент",
                        "search_clients": "Поиск клиентов по имени, телефону или email...",
                        "no_clients_yet": "Пока нет клиентов",
                        "build_client_database": "Начните создавать свою профессиональную базу клиентов",
                        "add_first_client": "Добавить первого клиента",
                        "edit_client": "Редактировать клиента",
                        "update_client": "Обновить клиента",
                        "regular_client": "Постоянный",
                        
                        // Sessions
                        "session_management": "Управление сеансами",
                        "new_session": "Новый сеанс",
                        "no_sessions_scheduled": "Нет запланированных сеансов",
                        "schedule_first_session": "Запланируйте свой первый профессиональный тату-сеанс",
                        "create_first_session": "Создать первый сеанс",
                        "edit_session": "Редактировать сеанс",
                        "update_session": "Обновить сеанс",
                        "session_completed": "Завершен",
                        "session_today": "Сегодня",
                        "session_upcoming": "Предстоящий",
                        "starting_soon": "Скоро начинается!",
                        
                        // Inventory
                        "inventory_management": "Управление инвентарем",
                        "new_item": "Новый предмет",
                        "search_inventory": "Поиск предметов инвентаря...",
                        "no_inventory_items": "Нет предметов в инвентаре",
                        "track_supplies": "Отслеживайте свои иглы, чернила и профессиональные принадлежности",
                        "add_first_item": "Добавить первый предмет",
                        "edit_inventory_item": "Редактировать предмет инвентаря",
                        "update_item": "Обновить предмет",
                        "low_stock": "Низкий запас",
                        
                        // Calendar
                        "studio_calendar": "Календарь студии",
                        "previous": "Предыдущий",
                        "next": "Следующий",
                        
                        // Reports
                        "analytics_reports": "Аналитика и отчеты",
                        "total_sessions": "Всего сеансов",
                        "total_revenue": "Общий доход",
                        "avg_session_price": "Средняя цена сеанса",
                        "client_retention": "Удержание клиентов",
                        "data_export": "Экспорт данных",
                        "full_backup": "Полная резервная копия",
                        "export_clients": "Экспорт клиентов",
                        "export_sessions": "Экспорт сеансов",
                        "export_inventory": "Экспорт инвентаря",
                        
                        // Install Prompt
                        "install_prompt": "Установить InkManager Pro для лучшего опыта?",
                        "install_now": "Установить сейчас",
                        "maybe_later": "Возможно позже",
                        
                        // Client Modal
                        "create_new_client": "Создать нового клиента",
                        "full_name": "Полное имя",
                        "name_placeholder": "Иван Иванов",
                        "phone_number": "Номер телефона",
                        "phone_placeholder": "+7 (999) 123-4567",
                        "email_address": "Адрес электронной почты",
                        "email_placeholder": "ivan@example.com",
                        "birth_date": "Дата рождения",
                        "skin_type": "Тип кожи",
                        "select_skin_type": "Выберите тип кожи...",
                        "normal": "Нормальная",
                        "sensitive": "Чувствительная",
                        "oily": "Жирная",
                        "dry": "Сухая",
                        "combination": "Комбинированная",
                        "emergency_contact": "Контакт для экстренных случаев",
                        "emergency_placeholder": "Имя и номер телефона",
                        "notes_preferences": "Заметки и предпочтения",
                        "notes_placeholder": "Аллергии, предпочтения по стилю, важные медицинские заметки, идеи дизайна...",
                        "cancel": "Отмена",
                        "save_client": "Сохранить клиента",
                        
                        // Session Modal
                        "schedule_session": "Запланировать сеанс",
                        "client": "Клиент",
                        "select_client": "Выберите клиента...",
                        "session_title": "Название сеанса",
                        "session_title_placeholder": "напр., Контур рукава, Перекрытие, Новый тату...",
                        "date_time": "Дата и время",
                        "duration_hours": "Продолжительность (часы)",
                        "price": "Цена",
                        "materials_used": "Использованные материалы",
                        "item": "Предмет",
                        "select_item": "Выберите предмет...",
                        "quantity": "Количество",
                        "add": "Добавить",
                        "session_notes": "Заметки к сеансу",
                        "session_notes_placeholder": "Детали дизайна, расположение, особые пожелания, инструкции по уходу...",
                        "save_session": "Сохранить сеанс",
                        "materials": "Материалы",
                        
                        // Inventory Modal
                        "new_inventory_item": "Новый предмет инвентаря",
                        "item_name": "Название предмета",
                        "item_name_placeholder": "Round Liner 5RL, Eternal Ink Black, Одноразовые рукоятки...",
                        "type": "Тип",
                        "select_type": "Выберите тип...",
                        "needle": "Игла",
                        "ink": "Чернила",
                        "machine": "Машинка",
                        "supply": "Расходные материалы",
                        "aftercare": "Уход после",
                        "safety": "Средства безопасности",
                        "current_quantity": "Текущее количество",
                        "low_stock_alert": "Оповещение о низком запасе",
                        "price_per_unit": "Цена за единицу",
                        "supplier_notes": "Поставщик и заметки",
                        "supplier_notes_placeholder": "Информация о поставщике, коды цветов, сроки годности...",
                        "save_item": "Сохранить предмет",
                        
                        // Additional UI elements
                        "last_visit": "Последний визит",
                        "total_sessions": "Всего сеансов",
                        "last_updated": "Обновлено"
                    },
                    he: {
                        // Navigation
                        "main_navigation": "ניווט ראשי",
                        "dashboard": "לוח בקרה",
                        "clients": "לקוחות",
                        "sessions": "פגישות",
                        "inventory": "מלאי",
                        "language": "שפה",
                        "all": "הכל",
                        "calendar": "לוח שנה",
                        "reports": "דוחות",
                        "quick_actions": "פעולות מהירות",
                        "add_client": "הוסף לקוח",
                        "schedule_session": "תזמן פגישה",
                        "add_inventory": "הוסף מלאי",
                        "collapse_sidebar": "כווץ סרגל צד",
                        "expand_sidebar": "הרחב סרגל צד",
                        
                        // Header
                        "tagline": "מערכת ניהול מקצועית לסטודיו קעקועים",
                        "install_app": "התקן אפליקציה",
                        "apply": "החל",
                        
                        // Dashboard
                        "studio_overview": "סקירת הסטודיו",
                        "backup_data": "גיבוי נתונים",
                        "total_clients": "סך הלקוחות",
                        "upcoming_sessions": "פגישות קרובות",
                        "monthly_revenue": "הכנסה חודשית",
                        "low_stock_items": "פריטים במלאי נמוך",
                        "todays_schedule": "לוח הזמנים להיום",
                        "no_sessions_today": "אין פגישות היום",
                        "schedule_clear": "לוח הזמנים שלך פנוי להיום",
                        "quick_insights": "תובנות מהירות",
                        "no_data_yet": "אין עדיין נתונים",
                        "start_adding_data": "התחל להוסיף לקוחות ופגישות כדי לראות תובנות",
                        
                        // Clients
                        "client_management": "ניהול לקוחות",
                        "new_client": "לקוח חדש",
                        "search_clients": "חפש לקוחות לפי שם, טלפון או אימייל...",
                        "no_clients_yet": "אין עדיין לקוחות",
                        "build_client_database": "התחל לבנות את מסד הנתונים המקצועי שלך של לקוחות",
                        "add_first_client": "הוסף את הלקוח הראשון שלך",
                        "edit_client": "ערוך לקוח",
                        "update_client": "עדכן לקוח",
                        "regular_client": "קבוע",
                        
                        // Sessions
                        "session_management": "ניהול פגישות",
                        "new_session": "פגישה חדשה",
                        "no_sessions_scheduled": "אין פגישות מתוזמנות",
                        "schedule_first_session": "תזמן את פגישת הקעקוע המקצועית הראשונה שלך",
                        "create_first_session": "צור פגישה ראשונה",
                        "edit_session": "ערוך פגישה",
                        "update_session": "עדכן פגישה",
                        "session_completed": "הושלם",
                        "session_today": "היום",
                        "session_upcoming": "קרוב",
                        "starting_soon": "מתחיל בקרוב!",
                        
                        // Inventory
                        "inventory_management": "ניהול מלאי",
                        "new_item": "פריט חדש",
                        "search_inventory": "חפש פריטי מלאי...",
                        "no_inventory_items": "אין פריטים במלאי",
                        "track_supplies": "עקוב אחר המחטים, הדיו והאספקה המקצועית שלך",
                        "add_first_item": "הוסף פריט ראשון",
                        "edit_inventory_item": "ערוך פריט מלאי",
                        "update_item": "עדכן פריט",
                        "low_stock": "מלאי נמוך",
                        
                        // Calendar
                        "studio_calendar": "לוח שנה של הסטודיו",
                        "previous": "קודם",
                        "next": "הבא",
                        
                        // Reports
                        "analytics_reports": "ניתוחים ודוחות",
                        "total_sessions": "סך הפגישות",
                        "total_revenue": "סך ההכנסות",
                        "avg_session_price": "מחיר פגישה ממוצע",
                        "client_retention": "שמירת לקוחות",
                        "data_export": "ייצוא נתונים",
                        "full_backup": "גיבוי מלא",
                        "export_clients": "ייצוא לקוחות",
                        "export_sessions": "ייצוא פגישות",
                        "export_inventory": "ייצוא מלאי",
                        
                        // Install Prompt
                        "install_prompt": "להתקין את InkManager Pro לחוויה הטובה ביותר?",
                        "install_now": "התקן עכשיו",
                        "maybe_later": "אולי מאוחר יותר",
                        
                        // Client Modal
                        "create_new_client": "צור לקוח חדש",
                        "full_name": "שם מלא",
                        "name_placeholder": "דוד כהן",
                        "phone_number": "מספר טלפון",
                        "phone_placeholder": "+972 (50) 123-4567",
                        "email_address": "כתובת אימייל",
                        "email_placeholder": "david@example.com",
                        "birth_date": "תאריך לידה",
                        "skin_type": "סוג עור",
                        "select_skin_type": "בחר סוג עור...",
                        "normal": "רגיל",
                        "sensitive": "רגיש",
                        "oily": "שומני",
                        "dry": "יבש",
                        "combination": "מעורב",
                        "emergency_contact": "איש קשר לחירום",
                        "emergency_placeholder": "שם ומספר טלפון",
                        "notes_preferences": "הערות והעדפות",
                        "notes_placeholder": "אלרגיות, העדפות סגנון, הערות רפואיות חשובות, רעיונות לעיצוב...",
                        "cancel": "ביטול",
                        "save_client": "שמור לקוח",
                        
                        // Session Modal
                        "schedule_session": "תזמן פגישה",
                        "client": "לקוח",
                        "select_client": "בחר לקוח...",
                        "session_title": "כותרת הפגישה",
                        "session_title_placeholder": "לדוגמה, מתאר שרוול, כיסוי, קעקוע חדש...",
                        "date_time": "תאריך ושעה",
                        "duration_hours": "משך (שעות)",
                        "price": "מחיר",
                        "materials_used": "חומרים בשימוש",
                        "item": "פריט",
                        "select_item": "בחר פריט...",
                        "quantity": "כמות",
                        "add": "הוסף",
                        "session_notes": "הערות לפגישה",
                        "session_notes_placeholder": "פרטי עיצוב, מיקום, בקשות מיוחדות, הוראות טיפול לאחר...",
                        "save_session": "שמור פגישה",
                        "materials": "חומרים",
                        
                        // Inventory Modal
                        "new_inventory_item": "פריט מלאי חדש",
                        "item_name": "שם הפריט",
                        "item_name_placeholder": "Round Liner 5RL, Eternal Ink Black, ידיות חד-פעמיות...",
                        "type": "סוג",
                        "select_type": "בחר סוג...",
                        "needle": "מחט",
                        "ink": "דיו",
                        "machine": "מכונה",
                        "supply": "אספקה",
                        "aftercare": "טיפול לאחר",
                        "safety": "ציוד בטיחות",
                        "current_quantity": "כמות נוכחית",
                        "low_stock_alert": "התראת מלאי נמוך",
                        "price_per_unit": "מחיר ליחידה",
                        "supplier_notes": "ספק והערות",
                        "supplier_notes_placeholder": "מידע על הספק, קודי צבע, תאריכי תפוגה...",
                        "save_item": "שמור פריט",
                        
                        // Additional UI elements
                        "last_visit": "ביקור אחרון",
                        "total_sessions": "סך הפגישות",
                        "last_updated": "עודכן"
                    }
                };
export const translations = 

/**
 * Format currency amount based on current language
 * @param {number} amount - The amount to format
 * @param {string} language - Current language code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, language) {
    const config = currencyConfig[language] || currencyConfig['en'];
    if (!amount) amount = 0;
    
    try {
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        // Fallback formatting
        return `${config.symbol}${amount.toLocaleString(config.locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    }
}

/**
 * Get translation for a key in the current language
 * @param {string} key - Translation key
 * @param {string} language - Current language code
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
export function translate(key, language, params = {}) {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    
    if (params.count !== undefined) {
        translation = translation.replace('{count}', params.count);
    }
    
    return translation;
}

/**
 * Update all DOM elements with data-i18n attributes
 * @param {string} language - Language code to apply
 */
export function updateDOMTranslations(language) {
    // Update text content
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Update placeholders
    const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
    i18nPlaceholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[language] && translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });
}
