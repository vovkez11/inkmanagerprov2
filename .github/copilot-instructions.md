# GitHub Copilot - InkManager Pro V2 Instructions

## Project Overview

InkManager Pro V2 is a professional tattoo studio management Progressive Web App (PWA) built with vanilla JavaScript. The application runs entirely client-side with no backend, storing all data locally in the browser's LocalStorage. It provides comprehensive studio management including client profiles, appointment scheduling, inventory tracking, and push notifications.

**Key Features:**
- Client management with detailed profiles
- Appointment scheduling with visual calendar
- Inventory tracking with low-stock alerts
- Push notifications for session reminders
- Multi-currency support (USD, EUR, GBP, ILS, RUB, MXN)
- Multi-language interface (English, Spanish, Russian, Hebrew)
- Data export and backup functionality
- Offline-first architecture

## Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **PWA Features:** Service Worker, Web Manifest, Web Notifications API
- **Storage:** LocalStorage for all data persistence
- **Dependencies:** 
  - Font Awesome 6.4.0 (CDN)
  - Google Fonts (Permanent Marker, Roboto)
- **No build tools, no frameworks, no package manager**

## File Structure

```
/
├── index.html              # Main application with inline CSS and core JavaScript
├── landing.html            # Landing page
├── privacy-policy.html     # Privacy policy page
├── offline.html            # Offline fallback page
├── test-notifications.html # Notification testing page
├── manifest.json           # PWA manifest configuration
├── sw.js                   # Service worker for offline functionality and notifications
├── assets/
│   └── app.js             # PWA install, mobile menu, routing, and UI interactions
├── icons/                  # App icons in various sizes
├── screenshots/            # App screenshots for PWA
└── .well-known/           # Android TWA asset links
```

## Coding Style Guidelines

### JavaScript

- **Use vanilla JavaScript** - No frameworks or libraries except those already included via CDN
- **ES6+ syntax** - Use modern JavaScript features (const/let, arrow functions, template literals, destructuring)
- **Single quotes** for strings unless embedding HTML or avoiding escaping
- **Semicolons required** at end of statements
- **camelCase** for variables and functions
- **PascalCase** for class names (if needed)
- **UPPER_SNAKE_CASE** for constants
- **4-space indentation**

### HTML

- **Semantic HTML5** - Use appropriate semantic elements
- **Accessibility** - Include ARIA labels where appropriate
- **Mobile-first** - Design for mobile devices first
- **Progressive enhancement** - Core functionality works without JavaScript

### CSS

- **CSS Custom Properties** - Use CSS variables defined in `:root` for theming
- **Mobile-first responsive design** - Use media queries for larger screens
- **BEM-like naming** when adding new components (block__element--modifier)
- **Transitions and animations** - Use smooth, professional animations (0.4s cubic-bezier)
- **Dark theme by default** - Primary colors are dark backgrounds with cyan accents

### Existing Color Palette

```css
--primary: #00bcd4;        /* Cyan - main accent */
--primary-dark: #008ba3;   /* Dark cyan */
--primary-light: #80deea;  /* Light cyan */
--secondary: #ff4081;      /* Pink accent */
--accent: #ff9800;         /* Orange accent */
--dark: #0d1117;          /* Main dark background */
--darker: #010409;        /* Darker background */
--dark-gray: #161b22;     /* Card/section background */
--success: #4caf50;       /* Green for success */
--warning: #ff9800;       /* Orange for warnings */
--danger: #f44336;        /* Red for errors/danger */
```

## PWA Best Practices

### Service Worker (sw.js)

- **Cache versioning** - Update `CACHE_NAME` when making significant changes
- **Network-first strategy** for dynamic content
- **Cache-first strategy** for static assets
- **Offline fallback** - Always provide offline.html fallback
- **Clean up old caches** on activation

### Web Notifications

- **Permission handling** - Always check and request permission gracefully
- **User control** - Provide clear enable/disable toggles in settings
- **Notification content** - Clear, concise, and actionable messages
- **Vibration support** - Use vibration patterns on mobile devices
- **Prevent duplicates** - Track sent notifications to avoid spam

### Manifest Configuration

- **Start URL** - Use `/inkmanagerprov2/` as the base path
- **Scope** - Match the start URL scope
- **Icons** - Provide multiple sizes (128, 192, 256, 384, 512px)
- **Maskable icons** - Include maskable icon for better display on devices
- **Screenshots** - Keep screenshots up-to-date for app stores

## Data Management

### LocalStorage Patterns

- **Namespacing** - Prefix all storage keys with `inkmanager_` or similar
- **JSON serialization** - Store complex objects as JSON strings
- **Error handling** - Always wrap localStorage access in try-catch blocks
- **Data validation** - Validate data when reading from storage
- **Migration support** - Handle schema changes gracefully

### Data Structure

The app stores various data types:
- Clients (profiles, contact info, preferences)
- Sessions (appointments, scheduling)
- Inventory (items, stock levels, alerts)
- Settings (user preferences, notification config)
- Analytics (revenue, statistics)

Always maintain backwards compatibility when modifying data structures.

## Security and Privacy

### Critical Security Rules

- **No backend required** - All processing happens client-side
- **No external data transmission** - Data never leaves the user's device
- **No third-party analytics** - Complete privacy by design
- **No tracking or telemetry** - No user behavior monitoring
- **Secure cookie practices** - If cookies are used: httpOnly, secure, sameSite: strict
- **No hardcoded secrets** - No API keys or credentials in code
- **Input sanitization** - Sanitize all user inputs before display or storage
- **XSS prevention** - Use textContent over innerHTML when possible
- **Content Security Policy** - Follow CSP best practices

### Privacy Considerations

- All data stored locally using LocalStorage
- Notifications generated locally by the browser
- No server-side storage or processing
- Users have full control over their data
- Export/import functionality for data portability
- Clear privacy policy disclosure

## Mobile and Responsive Design

### Mobile-First Approach

- **Touch targets** - Minimum 44x44px touch targets
- **Hamburger menu** - Use for mobile navigation
- **Viewport meta tag** - Include `viewport-fit=cover` for notched devices
- **Safe areas** - Respect safe area insets on iOS
- **Orientation** - Support both portrait and landscape
- **Gestures** - Support common mobile gestures where appropriate

### Breakpoints

```css
/* Mobile-first: Default styles for mobile */

@media (min-width: 768px) {
  /* Tablets */
}

@media (min-width: 1024px) {
  /* Desktop */
}
```

## Development Workflow

### Making Changes

1. **Test locally** - Open index.html in a modern browser
2. **Check mobile** - Use browser DevTools device emulation
3. **Test offline** - Disable network in DevTools
4. **Test notifications** - Use test-notifications.html
5. **Clear cache** - Update cache version in sw.js for breaking changes
6. **Export data first** - Users should export data before major updates

### No Build Process

- **No compilation required** - Files are served as-is
- **No package manager** - Dependencies loaded via CDN
- **No transpilation** - Use ES6+ features supported by target browsers
- **Manual cache busting** - Update service worker cache version

### Browser Testing

Test in these browsers (as noted in README):
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Testing

### Current State

- **No automated test framework** - No Jest, Mocha, or similar
- **No linting** - No ESLint or similar tools configured
- **Manual testing only** - Test manually in target browsers

### Testing Approach

When making changes:
1. Open the app in browser and manually test affected features
2. Use browser DevTools Console to check for errors
3. Test on mobile devices or using DevTools device emulation
4. Test offline functionality by disabling network
5. Verify localStorage data is correctly stored/retrieved
6. Test notification functionality if changes affect it

### Do Not Add

- Do not add testing frameworks unless explicitly requested
- Do not add build tools or bundlers
- Do not add linting tools unless explicitly requested
- Keep the project simple and dependency-free

## Common Patterns

### DOM Manipulation

```javascript
// Get element
const element = document.getElementById('myId');
const elements = document.querySelectorAll('.myClass');

// Update content safely
element.textContent = userInput; // Preferred (safe from XSS)
element.innerHTML = sanitizedHTML; // Only when necessary

// Event listeners
element.addEventListener('click', (e) => {
  e.preventDefault();
  // Handle event
});
```

### LocalStorage Usage

```javascript
// Save data
try {
  const data = { key: 'value' };
  localStorage.setItem('inkmanager_myData', JSON.stringify(data));
} catch (error) {
  console.error('Failed to save data:', error);
}

// Load data
try {
  const stored = localStorage.getItem('inkmanager_myData');
  const data = stored ? JSON.parse(stored) : defaultValue;
} catch (error) {
  console.error('Failed to load data:', error);
  // Use default value
}
```

### Notification Pattern

```javascript
// Check permission
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Title', {
    body: 'Message',
    icon: '/inkmanagerprov2/icons/icon-192.png',
    badge: '/inkmanagerprov2/icons/icon-128.png',
    vibrate: [200, 100, 200]
  });
}
```

## Feature Development Guidelines

### Adding New Features

1. **Check existing patterns** - Follow patterns already in the codebase
2. **Maintain backward compatibility** - Don't break existing data
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Offline support** - Ensure features work offline
5. **Accessibility** - Include ARIA labels and keyboard navigation
6. **Privacy-first** - Keep all data local, no external calls
7. **Update documentation** - Update README.md if user-facing changes

### Modifying Existing Features

1. **Minimal changes** - Make smallest possible changes
2. **Test thoroughly** - Manually test affected features
3. **Data migration** - Handle existing user data gracefully
4. **Cache update** - Update service worker cache version if needed
5. **Preserve functionality** - Don't remove working features

## Documentation

### Code Comments

- Add comments for complex logic or non-obvious code
- Use JSDoc-style comments for functions that may be reused
- Explain "why" not "what" in comments
- Keep comments up-to-date when code changes

### README Updates

- Update README.md when adding user-facing features
- Include usage instructions for new features
- Update browser compatibility if requirements change
- Keep the feature list current

## Dependencies

### Allowed Dependencies (Already in Use)

- **Font Awesome 6.4.0** - Icons (loaded via CDN)
- **Google Fonts** - Permanent Marker, Roboto (loaded via CDN)

### Adding New Dependencies

- **Prefer vanilla JavaScript** - Avoid adding new dependencies
- **CDN only** - If a dependency is absolutely needed, use CDN
- **No npm packages** - Project has no package.json
- **Justify necessity** - New dependencies should solve real problems
- **Check bundle size** - Keep the app lightweight
- **Consider alternatives** - Can it be done with vanilla JS?

## Anti-Patterns to Avoid

### Do Not

- ❌ Add backend or server-side code
- ❌ Send data to external services
- ❌ Add analytics or tracking
- ❌ Use jQuery or other heavy frameworks
- ❌ Add build processes (webpack, rollup, etc.)
- ❌ Require Node.js or npm for development
- ❌ Break offline functionality
- ❌ Store sensitive data insecurely
- ❌ Remove existing working features without justification
- ❌ Change the core architecture from client-side only

### Do

- ✅ Use modern vanilla JavaScript
- ✅ Maintain privacy-first approach
- ✅ Test manually in multiple browsers
- ✅ Follow existing code patterns
- ✅ Update service worker cache version when needed
- ✅ Preserve backward compatibility for user data
- ✅ Document user-facing changes in README
- ✅ Keep the codebase simple and maintainable

## Issue and PR Guidelines

### Writing Issues

- Be specific about the problem or feature request
- Include browser and version if reporting a bug
- Provide steps to reproduce bugs
- Include screenshots for UI-related issues
- Mention if the issue affects mobile, desktop, or both

### Pull Requests

- Keep changes focused and minimal
- Test manually before submitting
- Update README.md if user-facing changes
- Update service worker cache version if needed
- Include description of what changed and why
- Mention any breaking changes or data migration needs

## Helpful Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Reference for web APIs
- [Can I Use](https://caniuse.com/) - Browser compatibility checking
- [PWA Documentation](https://web.dev/progressive-web-apps/) - PWA best practices
- [Web.dev](https://web.dev/) - Performance and best practices

## Summary

InkManager Pro V2 is a simple, privacy-focused, client-side PWA. When working on this project:

1. **Keep it simple** - No frameworks, no build tools, no backend
2. **Privacy first** - All data stays local
3. **Mobile-optimized** - Design for mobile devices
4. **Offline-capable** - PWA features are essential
5. **Manual testing** - No automated test framework
6. **Vanilla JavaScript** - Modern ES6+ features only
7. **Backward compatible** - Don't break existing user data
8. **Lightweight** - Minimize dependencies and file sizes

When in doubt, follow existing patterns in the codebase and maintain the project's core philosophy of simplicity and privacy.
