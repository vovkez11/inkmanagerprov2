# InkManager Pro V2

🎨 Professional Tattoo Studio Management App

## Features
- 👥 **Client Management** - Detailed client profiles with contact info, skin type, and history
- 📅 **Appointment Scheduling** - Visual calendar with session tracking
- 🔔 **Push Notifications** - Get notified about upcoming sessions (NEW!)
- 📦 **Inventory Tracking** - Real-time stock management with low-stock alerts
- 💰 **Multi-Currency Support** - USD, EUR, GBP, ILS, RUB, MXN
- 🌍 **Multi-Language Interface** - English, Spanish, Russian, Hebrew
- 📱 **Progressive Web App** - Install on any device and work offline
- 📊 **Analytics & Reports** - Track revenue, sessions, and client retention
- 💾 **Data Export & Backup** - Export your data anytime
- 🎨 **Customizable Themes** - Choose from Dark, Light, and Accent themes (NEW!)

## PWA Features (New!)
- 📲 **Install Prompt** - Get prompted to install the app on your device
- 🔔 **Session Reminders** - Browser notifications for upcoming appointments
- 🔄 **Service Worker** - Offline functionality with smart caching
- 📱 **Mobile-Optimized** - Responsive design with mobile menu toggle
- ⚡ **Fast Performance** - Network-first caching strategy
- 🏠 **App Shortcuts** - Quick access to Dashboard, Clients, and Sessions

## Notification Features (NEW!)
- 🔔 **Session Reminders** - Get notified before sessions start (configurable time window)
- ⚙️ **Customizable Settings** - Set reminder time (hours before session)
- 📱 **Mobile Support** - Vibration alerts on mobile devices
- 🧪 **Test Notifications** - Verify your notifications are working
- 🔕 **Easy Toggle** - Enable/disable notifications anytime in settings
- 🎯 **Smart Tracking** - Prevents duplicate notifications for the same session

### How to Enable Notifications:
1. Navigate to **Settings** in the app
2. Check the "Enable notifications" option
3. Allow browser notifications when prompted
4. Configure your preferred reminder time (default: 2 hours before session)
5. Click "Test Notifications" to verify everything works
6. Save settings

## Theming (NEW!)

InkManager Pro V2 now supports multiple themes to customize your experience. Choose from three professionally designed themes with full accessibility support.

### Available Themes

- **🌙 Dark Theme** (Default) - Professional dark interface optimized for low-light environments
- **☀️ Light Theme** - Clean light interface with high contrast for bright environments
- **🎨 Accent Theme** - Vibrant cyan/orange accent theme with enhanced visual appeal

### How to Change Themes

1. Navigate to **Settings** in the app
2. Under **Appearance**, select your preferred theme from the dropdown
3. The theme applies instantly (no reload required)
4. Click "Save Settings" to persist your choice

### Theme Customization

All themes are built using CSS custom properties for easy customization. You can add your own theme by:

1. Open `index.html` in a text editor
2. Add a new theme block in the `<style>` section:

```css
[data-theme="your-theme-name"] {
    --color-bg: #yourBackgroundColor;
    --color-bg-darker: #yourDarkerBackground;
    --color-bg-elevated: #yourElevatedBackground;
    --color-text: #yourTextColor;
    --color-text-muted: rgba(r, g, b, 0.6);
    --color-border: #yourBorderColor;
    --color-accent: #yourAccentColor;
    --color-shadow: rgba(0, 0, 0, 0.4);
}
```

3. Add your theme option to the Settings dropdown:

```html
<option value="your-theme-name" data-i18n="your_theme">Your Theme Name</option>
```

4. Update the `applyTheme()` function to include your theme's meta color:

```javascript
const themeColors = {
    'dark': '#00bcd4',
    'light': '#007a8a',
    'accent': '#ff9800',
    'your-theme-name': '#yourMetaColor'
};
```

### Accessibility

All built-in themes meet WCAG AA accessibility standards with contrast ratios ≥4.5:1 for body text. When creating custom themes, ensure sufficient contrast between text and background colors for readability.

## Mobile Experience
- 🍔 **Hamburger Menu** - Easy navigation on mobile devices
- 📱 **Touch-Optimized** - All buttons and interactions are touch-friendly
- 🔄 **Adaptive Layout** - Automatically adjusts to screen size
- 💫 **Smooth Animations** - Polished transitions and effects

## Technical Details
- **Client-Side Only** - No backend required, runs entirely in the browser
- **LocalStorage** - All data stored securely on your device
- **Service Worker** - Offline-first architecture with runtime caching
- **Web Notifications API** - Browser-native notification support
- **Vanilla JavaScript** - No framework dependencies, lightweight and fast
- **PWA Manifest** - Installable on iOS, Android, and Desktop
- **CSS Custom Properties** - Dynamic theming with CSS variables

## Getting Started
1. Open the app in a modern browser (Chrome, Firefox, Safari, Edge)
2. Click the "Install App" button when prompted (or use browser's install option)
3. Choose your preferred theme in Settings
4. Enable notifications in Settings for session reminders
5. Start adding clients, sessions, and inventory items
6. Export your data regularly for backup

## Privacy
This app stores all data locally on your device. **No data is sent to servers or third parties.** Your client information and business data remain completely private. Notifications are generated locally by your browser.

## Browser Support
- ✅ Chrome/Edge 90+ (Full notification support)
- ✅ Firefox 88+ (Full notification support)
- ✅ Safari 14+ (Notification support may vary)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Note:** Notification features require browser permission and may not be available in all browsers or configurations.

## Storage Versioning

InkManager Pro uses a versioned storage system to safely evolve saved data without user data loss.

### How It Works

- **Version Key**: `inkmanager_storage_version` tracks the current storage schema version
- **Automatic Migration**: On app startup, the storage system detects the current version and runs necessary migrations
- **Idempotent Migrations**: All migrations are safe to run multiple times without data corruption
- **User Notification**: When migrations run, users see a dismissible banner confirming the successful upgrade

### Current Storage Version

The current storage version is **v3**. The storage module handles three migration paths:

- **v0 → v1**: Initialize storage with default settings and empty data arrays
- **v1 → v2**: Add notification tracking and inventory filter/sort defaults
- **v2 → v3**: Add sidebar state and perform data integrity checks

### Adding a New Migration

To add a new migration:

1. Open `assets/js/modules/storage.js`
2. Increment the `CURRENT_VERSION` constant
3. Add a new migration object to the `migrations` array:

```javascript
{
    version: 4,  // Next version number
    description: 'Brief description of what this migration does',
    up: function() {
        console.log('📦 Running migration v3 → v4: Your description');
        
        // Your migration code here
        // Always check if data exists before creating (idempotent)
        if (!getData('inkmanager_newFeature')) {
            setData('inkmanager_newFeature', defaultValue);
            console.log('  ✓ Added new feature data');
        }
        
        console.log('✅ Migration v3 → v4 complete');
    }
}
```

4. Test the migration using `tests/storage-migration.html`

### Important Guidelines

- **Always make migrations idempotent**: Check if data exists before creating/modifying it
- **Never delete user data**: Only add or transform data, never remove it unless explicitly migrating away from deprecated fields
- **Test thoroughly**: Use the test page to verify migrations work correctly
- **Document changes**: Update this README when adding new migrations

### Testing Migrations

Open `tests/storage-migration.html` in your browser to:

- Simulate different storage versions
- Run automated migration tests
- Verify data integrity and idempotence
- View current storage state

The test page includes automated tests that verify:
- Migrations from each version work correctly
- Data is preserved (no data loss)
- Migrations are idempotent (safe to run multiple times)

## Development
The app consists of:
- `index.html` - Main application with inline CSS and core JavaScript
- `assets/app.js` - PWA install, mobile menu, routing, and UI interactions
- `assets/js/modules/storage.js` - Versioned storage management and migrations
- `assets/js/modules/ui.js` - UI components (migration banners, etc.)
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline functionality and notifications
- `tests/storage-migration.html` - Storage migration test suite

## Support
For issues or feature requests, please open an issue on GitHub.

## License
MIT License - feel free to use and modify.
