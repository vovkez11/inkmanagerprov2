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

## Development
The app consists of:
- `index.html` - Main application with inline CSS and core JavaScript
- `assets/app.js` - PWA install, mobile menu, routing, and UI interactions
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline functionality and notifications

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up your development environment
- Coding standards and style guide
- Testing procedures
- How to submit changes

## Filing Issues

Found a bug or have a feature request? Please file an issue on GitHub:

- **Bug Reports**: Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) to report issues
- **Feature Requests**: Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) to suggest new features

When filing issues, please include:
- Browser and version information
- Steps to reproduce (for bugs)
- Screenshots if applicable
- Console errors (check browser DevTools)

## Support

For questions or general support, please open an issue on GitHub with the `question` label.

## License
MIT License - feel free to use and modify.
