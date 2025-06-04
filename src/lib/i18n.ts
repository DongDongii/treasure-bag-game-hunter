export type Language = 'en' | 'de' | 'it' | 'ru' | 'tr' | 'es' | 'pt' | 'zh'

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' }
] as const

export const translations = {
  en: {
    // Header
    "header.title": "Treasure Bag",
    "header.subtitle": "Game Hunter",
    "header.items": "Items",

    "header.search": "Search Items",

    // Home Page
    "home.title": "Treasure Bag",
    "home.subtitle": "Game Hunter",
    "home.description1": "Professional platform for finding rare game items and equipment",
    "home.description2": "Whatever game equipment or items you need, we'll help you find the best prices",
    "home.browseAll": "Browse All Items",
    "home.advancedSearch": "Advanced Search",
    "home.gameCategories": "Supported Games",
    "home.featuredItems": "Featured Items",
    "home.itemCount": "Item Count",

    "home.copyId": "Copy ID",
    "home.gameService": "Professional game item service platform",
    "home.enterGame": "Enter Game",

    // Blog
    "blog.title": "Latest News & Guides",
    "blog.readMore": "Read More",
    "blog.readTime": "min read",
    "blog.views": "views",
    "blog.category.news": "News",
    "blog.category.guide": "Guides",
    "blog.category.update": "Updates",
    "blog.category.event": "Events",
    "blog.backToBlog": "Back to Blog",
    "blog.share": "Share",
    "blog.shareArticle": "Share Article",
    "blog.continueReading": "Continue Reading",
    "blog.browseAll": "Browse All Articles",
    "blog.articleNotFound": "Article Not Found",
    "blog.articleNotFoundDesc": "The article you're looking for doesn't exist or has been removed.",

    // Items Page
    "items.title": "Item Showcase",
    "items.totalItems": "Total Items",
    "items.backHome": "Back to Home",
    "items.searchPlaceholder": "Search item names, IDs or descriptions...",
    "items.gameType": "Game Type",
    "items.allGames": "All Games",
    "items.category": "Category",
    "items.allCategories": "All Categories",
    "items.rarity": "Rarity",
    "items.allRarities": "All Rarities",

    "items.noResults": "No matching items found",
    "items.adjustFilters": "Please try adjusting your search criteria or filters",
    "items.id": "ID",
    "items.game": "Game",
    "items.price": "Price",

    "items.copied": "Copied!",
    "items.copyInfo": "Copy Info",
    "items.contactUs": "Contact Us",
    "items.platform": "Platform",
    "items.allPlatforms": "All Platforms",

    // Admin
    "admin.title": "Admin Panel",
    "admin.login": "Please enter admin credentials to login",
    "admin.username": "Username",
    "admin.password": "Password",
    "admin.loginButton": "Login",
    "admin.loginHint": "Default credentials: admin / admin",
    "admin.logout": "Logout",
    "admin.itemManagement": "Item Management",
    "admin.gameManagement": "Game Management",

    "admin.addItem": "Add Item",
    "admin.batchImport": "Batch Import",
    "admin.exportData": "Export Data",
    "admin.searchItems": "Search items...",
    "admin.totalItems": "Total Items",
    "admin.legendaryItems": "Legendary Items",
    "admin.epicItems": "Epic Items",
    "admin.todayAdded": "Added Today",
    "admin.categoryManagement": "Category Management",
    "admin.addCategory": "Add Category",
    "admin.editCategory": "Edit Category",
    "admin.deleteCategory": "Delete Category",
    "admin.categoryName": "Category Name",
    "admin.categoryDisplayName": "Display Name",
    "admin.categoryDescription": "Description",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Other Games",

    // Categories
    "categories.costume": "Costume",
    "categories.weapon": "Weapon",
    "categories.armor": "Armor",
    "categories.mount": "Mount",
    "categories.accessory": "Accessory",

    // Rarities
    "rarities.common": "Common",
    "rarities.rare": "Rare",
    "rarities.epic": "Epic",
    "rarities.legendary": "Legendary",

    // Social Contact
    "contact.title": "Contact Us",
    "contact.description": "Contact us through the following methods to get more game item information or technical support",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Contact us via WhatsApp",
    "contact.whatsapp.action": "Contact Now",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Join our Telegram channel",
    "contact.telegram.action": "Contact Now",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Join Discord server",
    "contact.discord.action": "Contact Now",
    "contact.email.title": "Email",
    "contact.email.description": "Send email to us",
    "contact.email.action": "Send Email",
    "contact.copy": "Copy",
    "contact.copied": "Copied!",
    "contact.tip.title": "💡 Quick Contact Tips",
    "contact.tip.description": "Click the corresponding button to contact us directly. WhatsApp and Telegram for fastest replies, Discord for community discussions, Email for formal inquiries",
  },

  de: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Item-Shop",
    "header.items": "Gegenstände",

    "header.search": "Gegenstände suchen",

    // Home Page
    "home.title": "Spiel-Gegenstände",
    "home.subtitle": "Ausstellungszentrum",
    "home.description1": "Entdecken Sie Ihre Lieblings-Spielgegenstände, kopieren Sie einfach Gegenstands-IDs",
    "home.description2": "Unterstützt mehrere Spieltypen, Echtzeit-Preis-Abfragen",
    "home.browseAll": "Alle Gegenstände durchsuchen",
    "home.advancedSearch": "Erweiterte Suche",
    "home.gameCategories": "Spiel-Kategorien",
    "home.featuredItems": "Empfohlene Gegenstände",
    "home.itemCount": "Anzahl Gegenstände",

    "home.copyId": "ID kopieren",
    "home.gameService": "Professionelle Spiel-Artikel-Service-Plattform",
    "home.enterGame": "Spiel betreten",

    // Blog
    "blog.title": "Neueste Nachrichten & Guides",
    "blog.readMore": "Mehr lesen",
    "blog.readTime": "Min. Lesezeit",
    "blog.views": "Aufrufe",
    "blog.category.news": "Nachrichten",
    "blog.category.guide": "Anleitungen",
    "blog.category.update": "Updates",
    "blog.category.event": "Events",

    // Items Page
    "items.title": "Gegenstände-Ausstellung",
    "items.totalItems": "Gesamt Gegenstände",
    "items.backHome": "Zurück zur Startseite",
    "items.searchPlaceholder": "Namen, IDs oder Beschreibungen suchen...",
    "items.gameType": "Spieltyp",
    "items.allGames": "Alle Spiele",
    "items.category": "Kategorie",
    "items.allCategories": "Alle Kategorien",
    "items.rarity": "Seltenheit",
    "items.allRarities": "Alle Seltenheiten",

    "items.noResults": "Keine passenden Gegenstände gefunden",
    "items.adjustFilters": "Bitte versuchen Sie, Ihre Suchkriterien oder Filter anzupassen",
    "items.id": "ID",
    "items.game": "Spiel",
    "items.price": "Preis",

    "items.copied": "Kopiert!",
    "items.copyInfo": "Info Kopieren",
    "items.contactUs": "Kontaktiere uns",
    "items.platform": "Plattform",
    "items.allPlatforms": "Alle Plattformen",

    // Admin
    "admin.title": "Admin-Panel",
    "admin.login": "Bitte geben Sie Admin-Anmeldedaten ein",
    "admin.username": "Benutzername",
    "admin.password": "Passwort",
    "admin.loginButton": "Anmelden",
    "admin.loginHint": "Standard-Anmeldedaten: admin / admin",
    "admin.logout": "Abmelden",
    "admin.itemManagement": "Gegenstände-Verwaltung",
    "admin.gameManagement": "Spiel-Verwaltung",

    "admin.addItem": "Gegenstand hinzufügen",
    "admin.batchImport": "Stapel-Import",
    "admin.exportData": "Daten exportieren",
    "admin.searchItems": "Gegenstände suchen...",
    "admin.totalItems": "Gesamt Gegenstände",
    "admin.legendaryItems": "Legendäre Gegenstände",
    "admin.epicItems": "Epische Gegenstände",
    "admin.todayAdded": "Heute hinzugefügt",

    // Common
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.cancel": "Abbrechen",
    "common.confirm": "Bestätigen",
    "common.close": "Schließen",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Andere Spiele",

    // Categories
    "categories.costume": "Kostüm",
    "categories.weapon": "Waffe",
    "categories.armor": "Rüstung",
    "categories.mount": "Reittier",
    "categories.accessory": "Accessoire",

    // Rarities
    "rarities.common": "Gewöhnlich",
    "rarities.rare": "Selten",
    "rarities.epic": "Episch",
    "rarities.legendary": "Legendär",

    // Social Contact
    "contact.title": "Kontaktieren Sie uns",
    "contact.description": "Kontaktieren Sie uns über die folgenden Methoden, um weitere Informationen zu Spielgegenständen oder technischen Support zu erhalten",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Kontaktieren Sie uns über WhatsApp",
    "contact.whatsapp.action": "Jetzt kontaktieren",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Treten Sie unserem Telegram-Kanal bei",
    "contact.telegram.action": "Jetzt kontaktieren",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Discord-Server beitreten",
    "contact.discord.action": "Jetzt kontaktieren",
    "contact.email.title": "E-Mail",
    "contact.email.description": "Senden Sie uns eine E-Mail",
    "contact.email.action": "E-Mail senden",
    "contact.copy": "Kopieren",
    "contact.copied": "Kopiert!",
    "contact.tip.title": "💡 Schnelle Kontakt-Tipps",
    "contact.tip.description": "Klicken Sie auf die entsprechende Schaltfläche, um uns direkt zu kontaktieren. WhatsApp und Telegram für schnellste Antworten, Discord für Community-Diskussionen, E-Mail für formelle Anfragen",
  },

  it: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Negozio Oggetti",
    "header.items": "Oggetti",

    "header.search": "Cerca Oggetti",

    // Home Page
    "home.title": "Oggetti di Gioco",
    "home.subtitle": "Centro Esposizione",
    "home.description1": "Scopri i tuoi oggetti di gioco preferiti, copia facilmente gli ID degli oggetti",
    "home.description2": "Supporta più tipi di gioco, query sui tassi dell'oro in tempo reale",
    "home.browseAll": "Sfoglia Tutti gli Oggetti",
    "home.advancedSearch": "Ricerca Avanzata",
    "home.gameCategories": "Categorie di Gioco",
    "home.featuredItems": "Oggetti in Evidenza",
    "home.itemCount": "Numero Oggetti",

    "home.copyId": "Copia ID",
    "home.gameService": "Piattaforma professionale di servizi per oggetti e oro",
    "home.enterGame": "Entra nel Gioco",

    // Blog
    "blog.title": "Ultime Notizie e Guide",
    "blog.readMore": "Leggi di più",
    "blog.readTime": "min di lettura",
    "blog.views": "visualizzazioni",
    "blog.category.news": "Notizie",
    "blog.category.guide": "Guide",
    "blog.category.update": "Aggiornamenti",
    "blog.category.event": "Eventi",

    // Items Page
    "items.title": "Vetrina Oggetti",
    "items.totalItems": "Oggetti Totali",
    "items.backHome": "Torna alla Home",
    "items.searchPlaceholder": "Cerca nomi, ID o descrizioni degli oggetti...",
    "items.gameType": "Tipo di Gioco",
    "items.allGames": "Tutti i Giochi",
    "items.category": "Categoria",
    "items.allCategories": "Tutte le Categorie",
    "items.rarity": "Rarità",
    "items.allRarities": "Tutte le Rarità",

    "items.noResults": "Nessun oggetto corrispondente trovato",
    "items.adjustFilters": "Prova ad aggiustare i criteri di ricerca o i filtri",
    "items.id": "ID",
    "items.game": "Gioco",
    "items.price": "Prezzo",

    "items.copied": "Copiato!",
    "items.copyInfo": "Copia Info",
    "items.contactUs": "Contattaci",
    "items.platform": "Piattaforma",
    "items.allPlatforms": "Tutte le Piattaforme",

    // Admin
    "admin.title": "Pannello Admin",
    "admin.login": "Inserisci le credenziali admin per accedere",
    "admin.username": "Nome Utente",
    "admin.password": "Password",
    "admin.loginButton": "Accedi",
    "admin.loginHint": "Credenziali predefinite: admin / admin",
    "admin.logout": "Disconnetti",
    "admin.itemManagement": "Gestione Oggetti",
    "admin.gameManagement": "Gestione Giochi",

    "admin.addItem": "Aggiungi Oggetto",
    "admin.batchImport": "Importazione Batch",
    "admin.exportData": "Esporta Dati",
    "admin.searchItems": "Cerca oggetti...",
    "admin.totalItems": "Oggetti Totali",
    "admin.legendaryItems": "Oggetti Leggendari",
    "admin.epicItems": "Oggetti Epici",
    "admin.todayAdded": "Aggiunti Oggi",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    "common.cancel": "Annulla",
    "common.confirm": "Conferma",
    "common.close": "Chiudi",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Altri Giochi",

    // Categories
    "categories.costume": "Costume",
    "categories.weapon": "Arma",
    "categories.armor": "Armatura",
    "categories.mount": "Cavalcatura",
    "categories.accessory": "Accessorio",

    // Rarities
    "rarities.common": "Comune",
    "rarities.rare": "Raro",
    "rarities.epic": "Epico",
    "rarities.legendary": "Leggendario",

    // Social Contact
    "contact.title": "Contattaci",
    "contact.description": "Contattaci attraverso i seguenti metodi per ottenere maggiori informazioni sugli oggetti di gioco o supporto tecnico",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Contattaci tramite WhatsApp",
    "contact.whatsapp.action": "Contatta Ora",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Unisciti al nostro canale Telegram",
    "contact.telegram.action": "Contatta Ora",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Unisciti al server Discord",
    "contact.discord.action": "Contatta Ora",
    "contact.email.title": "Email",
    "contact.email.description": "Inviaci un'email",
    "contact.email.action": "Invia Email",
    "contact.copy": "Copia",
    "contact.copied": "Copiato!",
    "contact.tip.title": "💡 Suggerimenti per Contatti Rapidi",
    "contact.tip.description": "Clicca il pulsante corrispondente per contattarci direttamente. WhatsApp e Telegram per risposte più veloci, Discord per discussioni della community, Email per richieste formali",
  },

  ru: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Магазин Предметов",
    "header.items": "Предметы",

    "header.search": "Поиск Предметов",

    // Home Page
    "home.title": "Игровые Предметы",
    "home.subtitle": "Центр Демонстрации",
    "home.description1": "Открывайте ваши любимые игровые предметы, легко копируйте ID предметов",
    "home.description2": "Поддерживает множество типов игр, запросы курсов золота в реальном времени",
    "home.browseAll": "Просмотреть Все Предметы",
    "home.advancedSearch": "Расширенный Поиск",
    "home.gameCategories": "Категории Игр",
    "home.featuredItems": "Рекомендуемые Предметы",
    "home.itemCount": "Количество Предметов",

    "home.copyId": "Копировать ID",
    "home.gameService": "Профессиональная платформа услуг предметов и золота",
    "home.enterGame": "Войти в Игру",

    // Blog
    "blog.title": "Последние Новости и Гайды",
    "blog.readMore": "Читать далее",
    "blog.readTime": "мин чтения",
    "blog.views": "просмотров",
    "blog.category.news": "Новости",
    "blog.category.guide": "Гайды",
    "blog.category.update": "Обновления",
    "blog.category.event": "События",

    // Items Page
    "items.title": "Витрина Предметов",
    "items.totalItems": "Всего Предметов",
    "items.backHome": "Вернуться на Главную",
    "items.searchPlaceholder": "Поиск названий, ID или описаний предметов...",
    "items.gameType": "Тип Игры",
    "items.allGames": "Все Игры",
    "items.category": "Категория",
    "items.allCategories": "Все Категории",
    "items.rarity": "Редкость",
    "items.allRarities": "Все Редкости",

    "items.noResults": "Подходящие предметы не найдены",
    "items.adjustFilters": "Попробуйте изменить критерии поиска или фильтры",
    "items.id": "ID",
    "items.game": "Игра",
    "items.price": "Цена",

    "items.copied": "Скопировано!",
    "items.copyInfo": "Копировать Инфо",
    "items.contactUs": "Связаться с нами",
    "items.platform": "Платформа",
    "items.allPlatforms": "Все Платформы",

    // Admin
    "admin.title": "Панель Админа",
    "admin.login": "Введите учетные данные администратора для входа",
    "admin.username": "Имя Пользователя",
    "admin.password": "Пароль",
    "admin.loginButton": "Войти",
    "admin.loginHint": "Учетные данные по умолчанию: admin / admin",
    "admin.logout": "Выйти",
    "admin.itemManagement": "Управление Предметами",
    "admin.gameManagement": "Управление Играми",

    "admin.addItem": "Добавить Предмет",
    "admin.batchImport": "Пакетный Импорт",
    "admin.exportData": "Экспорт Данных",
    "admin.searchItems": "Поиск предметов...",
    "admin.totalItems": "Всего Предметов",
    "admin.legendaryItems": "Легендарные Предметы",
    "admin.epicItems": "Эпические Предметы",
    "admin.todayAdded": "Добавлено Сегодня",

    // Common
    "common.loading": "Загрузка...",
    "common.error": "Ошибка",
    "common.success": "Успех",
    "common.cancel": "Отмена",
    "common.confirm": "Подтвердить",
    "common.close": "Закрыть",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Другие Игры",

    // Categories
    "categories.costume": "Костюм",
    "categories.weapon": "Оружие",
    "categories.armor": "Броня",
    "categories.mount": "Ездовое Животное",
    "categories.accessory": "Аксессуар",

    // Rarities
    "rarities.common": "Обычный",
    "rarities.rare": "Редкий",
    "rarities.epic": "Эпический",
    "rarities.legendary": "Легендарный",

    // Social Contact
    "contact.title": "Свяжитесь с нами",
    "contact.description": "Свяжитесь с нами любым из следующих способов, чтобы получить больше информации об игровых предметах или техническую поддержку",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Свяжитесь с нами через WhatsApp",
    "contact.whatsapp.action": "Связаться сейчас",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Присоединяйтесь к нашему каналу Telegram",
    "contact.telegram.action": "Связаться сейчас",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Присоединяйтесь к серверу Discord",
    "contact.discord.action": "Связаться сейчас",
    "contact.email.title": "Email",
    "contact.email.description": "Отправьте нам письмо",
    "contact.email.action": "Отправить письмо",
    "contact.copy": "Копировать",
    "contact.copied": "Скопировано!",
    "contact.tip.title": "💡 Советы по быстрой связи",
    "contact.tip.description": "Нажмите соответствующую кнопку, чтобы связаться с нами напрямую. WhatsApp и Telegram для самых быстрых ответов, Discord для обсуждений в сообществе, Email для официальных запросов",
  },

  tr: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Eşya Mağazası",
    "header.items": "Eşyalar",

    "header.search": "Eşya Ara",

    // Home Page
    "home.title": "Oyun Eşyaları",
    "home.subtitle": "Sergi Merkezi",
    "home.description1": "Favori oyun eşyalarınızı keşfedin, eşya ID'lerini kolayca kopyalayın",
    "home.description2": "Birden fazla oyun türünü destekler, gerçek zamanlı altın kuru sorguları",
    "home.browseAll": "Tüm Eşyalara Gözat",
    "home.advancedSearch": "Gelişmiş Arama",
    "home.gameCategories": "Oyun Kategorileri",
    "home.featuredItems": "Öne Çıkan Eşyalar",
    "home.itemCount": "Eşya Sayısı",

    "home.copyId": "ID Kopyala",
    "home.gameService": "Profesyonel eşya ve altın hizmet platformu",
    "home.enterGame": "Oyuna Gir",

    // Blog
    "blog.title": "Son Haberler ve Rehberler",
    "blog.readMore": "Devamını Oku",
    "blog.readTime": "dk okuma",
    "blog.views": "görüntüleme",
    "blog.category.news": "Haberler",
    "blog.category.guide": "Rehberler",
    "blog.category.update": "Güncellemeler",
    "blog.category.event": "Etkinlikler",

    // Items Page
    "items.title": "Eşya Vitrini",
    "items.totalItems": "Toplam Eşya",
    "items.backHome": "Ana Sayfaya Dön",
    "items.searchPlaceholder": "Eşya isimlerini, ID'lerini veya açıklamalarını arayın...",
    "items.gameType": "Oyun Türü",
    "items.allGames": "Tüm Oyunlar",
    "items.category": "Kategori",
    "items.allCategories": "Tüm Kategoriler",
    "items.rarity": "Nadir Derece",
    "items.allRarities": "Tüm Nadir Dereceler",

    "items.noResults": "Eşleşen eşya bulunamadı",
    "items.adjustFilters": "Arama kriterlerinizi veya filtrelerinizi ayarlamayı deneyin",
    "items.id": "ID",
    "items.game": "Oyun",
    "items.price": "Fiyat",

    "items.copied": "Kopyalandı!",
    "items.copyInfo": "Bilgi Kopyala",
    "items.contactUs": "Bizimle İletişime Geçin",
    "items.platform": "Platform",
    "items.allPlatforms": "Tüm Platformlar",

    // Admin
    "admin.title": "Yönetici Paneli",
    "admin.login": "Giriş yapmak için yönetici kimlik bilgilerini girin",
    "admin.username": "Kullanıcı Adı",
    "admin.password": "Şifre",
    "admin.loginButton": "Giriş Yap",
    "admin.loginHint": "Varsayılan kimlik bilgileri: admin / admin",
    "admin.logout": "Çıkış Yap",
    "admin.itemManagement": "Eşya Yönetimi",
    "admin.gameManagement": "Oyun Yönetimi",

    "admin.addItem": "Eşya Ekle",
    "admin.batchImport": "Toplu İçe Aktar",
    "admin.exportData": "Veri Dışa Aktar",
    "admin.searchItems": "Eşya ara...",
    "admin.totalItems": "Toplam Eşya",
    "admin.legendaryItems": "Efsanevi Eşyalar",
    "admin.epicItems": "Epik Eşyalar",
    "admin.todayAdded": "Bugün Eklenen",

    // Common
    "common.loading": "Yükleniyor...",
    "common.error": "Hata",
    "common.success": "Başarılı",
    "common.cancel": "İptal",
    "common.confirm": "Onayla",
    "common.close": "Kapat",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Diğer Oyunlar",

    // Categories
    "categories.costume": "Kostüm",
    "categories.weapon": "Silah",
    "categories.armor": "Zırh",
    "categories.mount": "Binek",
    "categories.accessory": "Aksesuar",

    // Rarities
    "rarities.common": "Yaygın",
    "rarities.rare": "Nadir",
    "rarities.epic": "Epik",
    "rarities.legendary": "Efsanevi",

    // Social Contact
    "contact.title": "Bizimle İletişime Geçin",
    "contact.description": "Oyun eşyaları hakkında daha fazla bilgi almak veya teknik destek için aşağıdaki yöntemlerle bizimle iletişime geçin",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "WhatsApp üzerinden bizimle iletişime geçin",
    "contact.whatsapp.action": "Şimdi İletişime Geç",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Telegram kanalımıza katılın",
    "contact.telegram.action": "Şimdi İletişime Geç",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Discord sunucumuza katılın",
    "contact.discord.action": "Şimdi İletişime Geç",
    "contact.email.title": "E-posta",
    "contact.email.description": "Bize e-posta gönderin",
    "contact.email.action": "E-posta Gönder",
    "contact.copy": "Kopyala",
    "contact.copied": "Kopyalandı!",
    "contact.tip.title": "💡 Hızlı İletişim İpuçları",
    "contact.tip.description": "Doğrudan bizimle iletişime geçmek için ilgili düğmeye tıklayın. En hızlı yanıt için WhatsApp ve Telegram, topluluk tartışmaları için Discord, resmi sorular için E-posta kullanın",
  },

  es: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Tienda de Objetos",
    "header.items": "Objetos",

    "header.search": "Buscar Objetos",

    // Home Page
    "home.title": "Objetos del Juego",
    "home.subtitle": "Centro de Exposición",
    "home.description1": "Descubre tus objetos de juego favoritos, copia fácilmente los IDs de objetos",
    "home.description2": "Admite múltiples tipos de juegos, consultas de tasas de oro en tiempo real",
    "home.browseAll": "Explorar Todos los Objetos",
    "home.advancedSearch": "Búsqueda Avanzada",
    "home.gameCategories": "Categorías de Juegos",
    "home.featuredItems": "Objetos Destacados",
    "home.itemCount": "Cantidad de Objetos",

    "home.copyId": "Copiar ID",
    "home.gameService": "Plataforma profesional de servicios de objetos y oro",
    "home.enterGame": "Entrar al Juego",

    // Blog
    "blog.title": "Últimas Noticias y Guías",
    "blog.readMore": "Leer más",
    "blog.readTime": "min de lectura",
    "blog.views": "vistas",
    "blog.category.news": "Noticias",
    "blog.category.guide": "Guías",
    "blog.category.update": "Actualizaciones",
    "blog.category.event": "Eventos",

    // Items Page
    "items.title": "Vitrina de Objetos",
    "items.totalItems": "Objetos Totales",
    "items.backHome": "Volver al Inicio",
    "items.searchPlaceholder": "Buscar nombres, IDs o descripciones de objetos...",
    "items.gameType": "Tipo de Juego",
    "items.allGames": "Todos los Juegos",
    "items.category": "Categoría",
    "items.allCategories": "Todas las Categorías",
    "items.rarity": "Rareza",
    "items.allRarities": "Todas las Rarezas",

    "items.noResults": "No se encontraron objetos coincidentes",
    "items.adjustFilters": "Intenta ajustar tus criterios de búsqueda o filtros",
    "items.id": "ID",
    "items.game": "Juego",
    "items.price": "Precio",

    "items.copied": "¡Copiado!",
    "items.copyInfo": "Copiar Info",
    "items.contactUs": "Contáctanos",
    "items.platform": "Plataforma",
    "items.allPlatforms": "Todas las Plataformas",

    // Admin
    "admin.title": "Panel de Administración",
    "admin.login": "Ingresa las credenciales de administrador para iniciar sesión",
    "admin.username": "Nombre de Usuario",
    "admin.password": "Contraseña",
    "admin.loginButton": "Iniciar Sesión",
    "admin.loginHint": "Credenciales predeterminadas: admin / admin",
    "admin.logout": "Cerrar Sesión",
    "admin.itemManagement": "Gestión de Objetos",
    "admin.gameManagement": "Gestión de Juegos",

    "admin.addItem": "Agregar Objeto",
    "admin.batchImport": "Importación por Lotes",
    "admin.exportData": "Exportar Datos",
    "admin.searchItems": "Buscar objetos...",
    "admin.totalItems": "Objetos Totales",
    "admin.legendaryItems": "Objetos Legendarios",
    "admin.epicItems": "Objetos Épicos",
    "admin.todayAdded": "Agregados Hoy",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.close": "Cerrar",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Otros Juegos",

    // Categories
    "categories.costume": "Disfraz",
    "categories.weapon": "Arma",
    "categories.armor": "Armadura",
    "categories.mount": "Montura",
    "categories.accessory": "Accesorio",

    // Rarities
    "rarities.common": "Común",
    "rarities.rare": "Raro",
    "rarities.epic": "Épico",
    "rarities.legendary": "Legendario",

    // Social Contact
    "contact.title": "Contáctanos",
    "contact.description": "Contáctanos a través de los siguientes métodos para obtener más información sobre objetos del juego o soporte técnico",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Contáctanos a través de WhatsApp",
    "contact.whatsapp.action": "Contactar Ahora",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Únete a nuestro canal de Telegram",
    "contact.telegram.action": "Contactar Ahora",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Únete al servidor de Discord",
    "contact.discord.action": "Contactar Ahora",
    "contact.email.title": "Correo",
    "contact.email.description": "Envíanos un correo electrónico",
    "contact.email.action": "Enviar Correo",
    "contact.copy": "Copiar",
    "contact.copied": "¡Copiado!",
    "contact.tip.title": "💡 Consejos de Contacto Rápido",
    "contact.tip.description": "Haz clic en el botón correspondiente para contactarnos directamente. WhatsApp y Telegram para respuestas más rápidas, Discord para discusiones de la comunidad, Email para consultas formales",
  },

  pt: {
    // Header
    "header.title": "MapleStory",
    "header.subtitle": "Loja de Itens",
    "header.items": "Itens",

    "header.search": "Buscar Itens",

    // Home Page
    "home.title": "Itens do Jogo",
    "home.subtitle": "Centro de Exibição",
    "home.description1": "Descubra seus itens de jogo favoritos, copie facilmente IDs de itens",
    "home.description2": "Suporta múltiplos tipos de jogos, consultas de taxa de ouro em tempo real",
    "home.browseAll": "Navegar por Todos os Itens",
    "home.advancedSearch": "Busca Avançada",
    "home.gameCategories": "Categorias de Jogos",
    "home.featuredItems": "Itens em Destaque",
    "home.itemCount": "Quantidade de Itens",

    "home.copyId": "Copiar ID",
    "home.gameService": "Plataforma profissional de serviços de itens e ouro",
    "home.enterGame": "Entrar no Jogo",

    // Blog
    "blog.title": "Últimas Notícias e Guias",
    "blog.readMore": "Ler mais",
    "blog.readTime": "min de leitura",
    "blog.views": "visualizações",
    "blog.category.news": "Notícias",
    "blog.category.guide": "Guias",
    "blog.category.update": "Atualizações",
    "blog.category.event": "Eventos",

    // Items Page
    "items.title": "Vitrine de Itens",
    "items.totalItems": "Itens Totais",
    "items.backHome": "Voltar ao Início",
    "items.searchPlaceholder": "Buscar nomes, IDs ou descrições de itens...",
    "items.gameType": "Tipo de Jogo",
    "items.allGames": "Todos os Jogos",
    "items.category": "Categoria",
    "items.allCategories": "Todas as Categorias",
    "items.rarity": "Raridade",
    "items.allRarities": "Todas as Raridades",

    "items.noResults": "Nenhum item correspondente encontrado",
    "items.adjustFilters": "Tente ajustar seus critérios de busca ou filtros",
    "items.id": "ID",
    "items.game": "Jogo",
    "items.price": "Preço",

    "items.copied": "Copiado!",
    "items.copyInfo": "Copiar Info",
    "items.contactUs": "Fale Conosco",
    "items.platform": "Plataforma",
    "items.allPlatforms": "Todas as Plataformas",

    // Admin
    "admin.title": "Painel de Administração",
    "admin.login": "Digite as credenciais de administrador para fazer login",
    "admin.username": "Nome de Usuário",
    "admin.password": "Senha",
    "admin.loginButton": "Fazer Login",
    "admin.loginHint": "Credenciais padrão: admin / admin",
    "admin.logout": "Sair",
    "admin.itemManagement": "Gerenciamento de Itens",
    "admin.gameManagement": "Gerenciamento de Jogos",

    "admin.addItem": "Adicionar Item",
    "admin.batchImport": "Importação em Lote",
    "admin.exportData": "Exportar Dados",
    "admin.searchItems": "Buscar itens...",
    "admin.totalItems": "Itens Totais",
    "admin.legendaryItems": "Itens Lendários",
    "admin.epicItems": "Itens Épicos",
    "admin.todayAdded": "Adicionados Hoje",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.close": "Fechar",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "Outros Jogos",

    // Categories
    "categories.costume": "Fantasia",
    "categories.weapon": "Arma",
    "categories.armor": "Armadura",
    "categories.mount": "Montaria",
    "categories.accessory": "Acessório",

    // Rarities
    "rarities.common": "Comum",
    "rarities.rare": "Raro",
    "rarities.epic": "Épico",
    "rarities.legendary": "Lendário",

    // Social Contact
    "contact.title": "Entre em Contato",
    "contact.description": "Entre em contato conosco através dos seguintes métodos para obter mais informações sobre itens do jogo ou suporte técnico",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Entre em contato conosco via WhatsApp",
    "contact.whatsapp.action": "Contactar Agora",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "Junte-se ao nosso canal do Telegram",
    "contact.telegram.action": "Contactar Agora",
    "contact.discord.title": "Discord",
    "contact.discord.description": "Junte-se ao servidor Discord",
    "contact.discord.action": "Contactar Agora",
    "contact.email.title": "Email",
    "contact.email.description": "Envie-nos um email",
    "contact.email.action": "Enviar Email",
    "contact.copy": "Copiar",
    "contact.copied": "Copiado!",
    "contact.tip.title": "💡 Dicas de Contato Rápido",
    "contact.tip.description": "Clique no botão correspondente para entrar em contato conosco diretamente. WhatsApp e Telegram para respostas mais rápidas, Discord para discussões da comunidade, Email para consultas formais",
  },

  zh: {
    // Header
    "header.title": "宝藏猎人",
    "header.subtitle": "游戏专家",
    "header.items": "商品展示",

    "header.search": "搜索商品",

    // Home Page
    "home.title": "宝藏猎人",
    "home.subtitle": "游戏物品专家",
    "home.description1": "专业为玩家寻找珍稀游戏物品和游戏金币的一站式平台",
    "home.description2": "无论您需要什么游戏装备、道具或金币，我们都能帮您找到最优惠的价格",
    "home.browseAll": "浏览所有商品",
    "home.advancedSearch": "高级搜索",
    "home.gameCategories": "支持的游戏",
    "home.featuredItems": "精选商品",
    "home.itemCount": "商品数量",

    "home.copyId": "复制ID",
    "home.gameService": "专业的游戏物品和金币服务平台",
    "home.enterGame": "进入游戏",

    // Blog
    "blog.title": "最新资讯与攻略",
    "blog.readMore": "阅读更多",
    "blog.readTime": "分钟阅读",
    "blog.views": "浏览",
    "blog.category.news": "新闻",
    "blog.category.guide": "攻略",
    "blog.category.update": "更新",
    "blog.category.event": "活动",
    "blog.backToBlog": "返回博客",
    "blog.share": "分享",
    "blog.shareArticle": "分享文章",
    "blog.continueReading": "继续阅读",
    "blog.browseAll": "浏览所有文章",
    "blog.articleNotFound": "文章未找到",
    "blog.articleNotFoundDesc": "您要查找的文章不存在或已被删除。",

    // Items Page
    "items.title": "商品展示",
    "items.totalItems": "总商品数",
    "items.backHome": "返回首页",
    "items.searchPlaceholder": "搜索商品名称、ID或描述...",
    "items.gameType": "游戏类型",
    "items.allGames": "所有游戏",
    "items.category": "分类",
    "items.allCategories": "所有分类",
    "items.rarity": "稀有度",
    "items.allRarities": "所有稀有度",

    "items.noResults": "没有找到匹配的商品",
    "items.adjustFilters": "请尝试调整搜索条件或筛选器",
    "items.id": "ID",
    "items.game": "游戏",
    "items.price": "价格",

    "items.copied": "已复制!",
    "items.copyInfo": "复制信息",
    "items.contactUs": "联系我们",
    "items.platform": "平台",
    "items.allPlatforms": "所有平台",

    // Admin
    "admin.title": "管理后台",
    "admin.login": "请输入管理员凭据登录",
    "admin.username": "用户名",
    "admin.password": "密码",
    "admin.loginButton": "登录",
    "admin.loginHint": "默认凭据: admin / admin",
    "admin.logout": "登出",
    "admin.itemManagement": "商品管理",
    "admin.gameManagement": "游戏管理",

    "admin.addItem": "添加商品",
    "admin.batchImport": "批量导入",
    "admin.exportData": "导出数据",
    "admin.searchItems": "搜索商品...",
    "admin.totalItems": "总商品数",
    "admin.legendaryItems": "传说物品",
    "admin.epicItems": "史诗物品",
    "admin.todayAdded": "今日新增",
    "admin.categoryManagement": "分类管理",
    "admin.addCategory": "添加分类",
    "admin.editCategory": "编辑分类",
    "admin.deleteCategory": "删除分类",
    "admin.categoryName": "分类名称",
    "admin.categoryDisplayName": "显示名称",
    "admin.categoryDescription": "描述",

    // Common
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.close": "关闭",

    // Game names
    "games.maplestory": "MapleStory",
    "games.maplestorym": "MapleStory M",
    "games.maplestory2": "MapleStory 2",
    "games.other": "其他游戏",

    // Categories
    "categories.costume": "时装",
    "categories.weapon": "武器",
    "categories.armor": "防具",
    "categories.mount": "坐骑",
    "categories.accessory": "饰品",

    // Rarities
    "rarities.common": "普通",
    "rarities.rare": "稀有",
    "rarities.epic": "史诗",
    "rarities.legendary": "传说",

    // Social Contact
    "contact.title": "联系我们",
    "contact.description": "通过以下方式与我们联系，获取更多游戏物品信息或技术支持",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "通过WhatsApp联系我们",
    "contact.whatsapp.action": "立即联系",
    "contact.telegram.title": "Telegram",
    "contact.telegram.description": "加入我们的Telegram频道",
    "contact.telegram.action": "立即联系",
    "contact.discord.title": "Discord",
    "contact.discord.description": "加入Discord服务器",
    "contact.discord.action": "立即联系",
    "contact.email.title": "Email",
    "contact.email.description": "发送邮件给我们",
    "contact.email.action": "发送邮件",
    "contact.copy": "复制",
    "contact.copied": "已复制!",
    "contact.tip.title": "💡 快速联系提示",
    "contact.tip.description": "点击对应按钮即可直接联系我们，WhatsApp和Telegram最快回复，Discord可以加入社区讨论，Email适合正式咨询",
  }
}

export function getTranslation(key: string, lang: Language = 'en'): string {
  const langTranslations = translations[lang] || translations.en
  return langTranslations[key as keyof typeof langTranslations] || key
}
