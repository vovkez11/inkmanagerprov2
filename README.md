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
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations

## PWA Features (New!)
- 📲 **Install Prompt** - Get prompted to install the app on your device
- 🔔 **Session Reminders** - Browser notifications for upcoming appointments
- 🔄 **Service Worker** - Offline functionality with smart caching
- 🔄 **Auto-Update Detection** - Aggressive update checking with user-controlled updates
- 📱 **Mobile-Optimized** - Responsive design with mobile menu toggle
- ⚡ **Fast Performance** - Network-first caching strategy
- 🏠 **App Shortcuts** - Quick access to Dashboard, Clients, and Sessions

## Auto-Update Features (NEW!)
- 🔄 **Aggressive Update Detection** - Checks for updates on page load, tab focus, and every 5 minutes
- 🆕 **Update Banner** - Prominent notification when new version is available
- 👆 **Click to Update** - User-controlled update process with clear "Update Now" button
- 🎯 **No Surprise Reloads** - Updates only apply when you click the button
- ⚡ **Fast Deployment** - New versions detected immediately when deployed

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

## Mobile Experience
- 🍔 **Hamburger Menu** - Easy navigation on mobile devices
- 📱 **Touch-Optimized** - All buttons and interactions are touch-friendly
- 🔄 **Adaptive Layout** - Automatically adjusts to screen size
- 💫 **Smooth Animations** - Polished transitions and effects
- 📍 **Bottom Tab Navigation** - Quick access to main sections on mobile (≤768px)
- 🔒 **Safe Area Support** - Respects device notches and safe areas on iOS/Android
- 📏 **Dynamic Viewport Units** - Uses `100dvh` for proper mobile browser chrome handling

## Technical Details
- **Client-Side Only** - No backend required, runs entirely in the browser
- **LocalStorage** - All data stored securely on your device
- **Service Worker** - Offline-first architecture with runtime caching
- **Web Notifications API** - Browser-native notification support
- **Vanilla JavaScript** - No framework dependencies, lightweight and fast
- **PWA Manifest** - Installable on iOS, Android, and Desktop

## Getting Started
1. Open the app in a modern browser (Chrome, Firefox, Safari, Edge)
2. Click the "Install App" button when prompted (or use browser's install option)
3. Enable notifications in Settings for session reminders
4. Start adding clients, sessions, and inventory items
5. Export your data regularly for backup

## Privacy
This app stores all data locally on your device. **No data is sent to servers or third parties.** Your client information and business data remain completely private. Notifications are generated locally by your browser.

## Browser Support
- ✅ Chrome/Edge 90+ (Full notification support)
- ✅ Firefox 88+ (Full notification support)
- ✅ Safari 14+ (Notification support may vary)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Note:** Notification features require browser permission and may not be available in all browsers or configurations.

## Responsive Layout & Mobile Design

### Mobile-First Approach
InkManager Pro uses a mobile-first responsive design that adapts seamlessly to different screen sizes:

- **Mobile (≤768px)**: Bottom tab navigation with off-canvas sidebar
- **Desktop (>768px)**: Side navigation with collapsible sidebar option

### Key Responsive Features

#### Dynamic Viewport Heights
- Uses `100dvh` (dynamic viewport height) with `100vh` fallback
- Handles mobile browser chrome (address bar) appearing/disappearing on iOS Safari and Chrome Android
- Prevents content from being pushed below viewport when browser chrome changes

#### Bottom Tab Bar
- Fixed position at viewport bottom with `z-index: 1100`
- Height managed by CSS variable `--tab-bar-height: 64px`
- Safe-area inset padding: `padding-bottom: max(env(safe-area-inset-bottom), 8px)`
- Prevents overlap with content via calculated padding on `.app-container`

#### Z-Index Hierarchy
Layer stacking ensures proper element visibility:
- Sidebar: `1000`
- Mobile sidebar overlay: `1000`
- Mobile sidebar (when open): `1001`
- Bottom tab navigation: `1100`
- Install prompt / Update banner: `1150`
- Modals: `1200`

#### Safe Area Support
- Respects iOS notches and Android navigation gestures
- Uses `env(safe-area-inset-*)` for proper padding
- Viewport meta tag includes `viewport-fit=cover`

#### Testing Viewports
The app is tested and optimized for these common mobile widths:
- 360px (small Android phones)
- 375px (iPhone SE, iPhone 12/13 mini)
- 390px (iPhone 12/13/14)
- 414px (iPhone Plus models)
- 430px (iPhone 14 Pro Max)
- Landscape orientations

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

## Accessibility

InkManager Pro V2 is designed with accessibility in mind to ensure all users can effectively manage their tattoo studio, regardless of how they interact with the app.

### Accessibility Features

- ♿ **Semantic HTML5** - Proper use of `<header>`, `<nav>`, `<main>`, `<footer>`, and `<section>` elements for clear document structure
- ⌨️ **Keyboard Navigation** - Full app navigation using Tab, Enter, and arrow keys
- 🎯 **Skip Link** - "Skip to main content" link visible on keyboard focus for quick navigation
- 🔍 **Focus Indicators** - Clear, high-contrast focus outlines (WCAG AA compliant) on all interactive elements
- 🏷️ **ARIA Labels** - Proper labeling of icon-only buttons, navigation landmarks, and dynamic content
- 📝 **Form Accessibility** - All form inputs explicitly associated with labels using `for` and `id` attributes
- 🔔 **Live Regions** - Status updates and notifications announced to screen readers using `aria-live`
- 🎨 **High Contrast** - Dark theme with cyan (#00bcd4) accents for excellent visibility
- 📱 **Touch Targets** - Minimum 44×44px touch targets for easy interaction on mobile devices

### Keyboard Shortcuts

- `Tab` - Move forward through interactive elements
- `Shift + Tab` - Move backward through interactive elements
- `Enter` or `Space` - Activate buttons and links
- `Esc` - Close modals and dialogs

### Screen Reader Support

The app has been optimized for screen readers with:
- Descriptive ARIA labels on all navigation elements
- Proper heading hierarchy (h1-h4) for document structure
- `aria-current="page"` to identify the active page
- `role="dialog"` and `aria-modal="true"` for modal dialogs
- `role="status"` for dynamic content updates
- Decorative icons marked with `aria-hidden="true"`

### Contributing to Accessibility

We welcome contributions to improve accessibility! When contributing:

1. **Test with keyboard only** - Ensure all features are accessible without a mouse
2. **Use semantic HTML** - Choose the right HTML element for the job
3. **Add ARIA when needed** - Use ARIA attributes to enhance semantics when HTML alone isn't sufficient
4. **Maintain focus styles** - Never remove focus outlines without providing an alternative
5. **Test with screen readers** - Verify changes work with NVDA, JAWS, or VoiceOver
6. **Check color contrast** - Ensure text meets WCAG AA standards (4.5:1 for normal text)
7. **Document changes** - Update this section when adding accessibility features

### Known Limitations

- Some third-party icon fonts may not be optimally labeled
- Calendar navigation could be enhanced with arrow key support
- Drag-and-drop features are not yet keyboard accessible

### Reporting Accessibility Issues

If you encounter an accessibility barrier, please [open an issue](https://github.com/vovkez11/inkmanagerprov2/issues) with:
- Description of the barrier
- Steps to reproduce
- Browser and assistive technology used
- Suggested improvement (if applicable)

## Troubleshooting

### App appears frozen or won't load
If the app appears frozen or doesn't load properly:

1. **Clear browser cache and reload:**
   - Chrome/Edge: Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac), select "Cached images and files", then click "Clear data"
   - Firefox: Press `Ctrl+Shift+Delete`, select "Cache", then click "Clear Now"
   - Safari: Go to Preferences > Privacy > Manage Website Data, search for the site, and click "Remove"

2. **Unregister the service worker:**
   - Open browser DevTools (F12)
   - Go to Application > Service Workers (Chrome/Edge) or Storage > Service Workers (Firefox)
   - Click "Unregister" next to InkManager Pro
   - Reload the page

3. **Try incognito/private mode:**
   - This helps determine if the issue is cache-related

4. **Check browser console for errors:**
   - Open DevTools (F12) and check the Console tab for any error messages

5. **Verify you're using a supported browser:**
   - Chrome 90+, Edge 90+, Firefox 88+, Safari 14+

### Data not saving
- Ensure your browser allows localStorage
- Check that you're not in private/incognito mode (data won't persist)
- Verify you have sufficient storage space

### Notifications not working
- Allow notification permissions when prompted
- Check browser notification settings
- Test notifications using the "Test Notifications" button in Settings

## Support
For issues or feature requests, please open an issue on GitHub.

## License
MIT License - feel free to use and modify.
