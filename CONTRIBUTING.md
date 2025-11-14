# Contributing to InkManager Pro V2

Thank you for your interest in contributing to InkManager Pro V2! This document provides guidelines and information to help you contribute effectively.

## Table of Contents

- [Project Overview](#project-overview)
- [Local Setup](#local-setup)
- [Coding Style](#coding-style)
- [Testing](#testing)
- [Proposing Changes](#proposing-changes)
- [Release Update Process](#release-update-process)
- [Getting Help](#getting-help)

## Project Overview

InkManager Pro V2 is a professional tattoo studio management Progressive Web App (PWA) built with **vanilla JavaScript**. Key architectural decisions:

- **Client-side only**: No backend, runs entirely in the browser
- **LocalStorage**: All data persists locally on the user's device
- **No frameworks**: Pure vanilla JavaScript (ES6+), HTML5, and CSS3
- **No build tools**: Files are served as-is, no compilation required
- **Privacy-first**: No data sent to external servers or third parties
- **PWA features**: Service worker, web notifications, offline support

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **PWA**: Service Worker, Web Manifest, Web Notifications API
- **Storage**: LocalStorage for all data persistence
- **Dependencies**: 
  - Font Awesome 6.4.0 (CDN)
  - Google Fonts: Permanent Marker, Roboto (CDN)

### File Structure

```
/
├── index.html              # Main app (5700+ lines with inline CSS/JS)
├── assets/app.js          # PWA install, mobile menu, routing
├── sw.js                  # Service worker for offline/notifications
├── manifest.json          # PWA manifest configuration
├── landing.html           # Landing page
├── privacy-policy.html    # Privacy policy
├── offline.html           # Offline fallback page
├── icons/                 # App icons (various sizes)
├── screenshots/           # PWA screenshots
└── .well-known/          # Android TWA asset links
```

### Architecture Notes

- Main application logic is in the `InkManagerPro` class inside `index.html`
- All CSS is inline in `index.html` within `<style>` tags
- Service worker (`sw.js`) handles offline caching and notifications
- `assets/app.js` handles PWA installation and mobile UI interactions

## Local Setup

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- A local web server (optional but recommended for testing PWA features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vovkez11/inkmanagerprov2.git
   cd inkmanagerprov2
   ```

2. **Serve the files locally** (choose one):

   Using Python 3:
   ```bash
   python3 -m http.server 8000
   ```

   Using Node.js with `http-server`:
   ```bash
   npx http-server -p 8000
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000` in your browser.

### Testing PWA Features

To test PWA features like service worker and notifications:

1. Serve the app over HTTPS or localhost (service workers require secure context)
2. Open browser DevTools → Application tab
3. Check "Service Workers" section to verify service worker registration
4. Use "Manifest" section to verify PWA manifest is loaded
5. Use `test-notifications.html` to verify notification functionality

## Coding Style

### JavaScript Style

- **Use vanilla JavaScript** - No frameworks or libraries
- **ES6+ syntax** - Modern JavaScript features (const/let, arrow functions, template literals)
- **Quotes**: Single quotes `'` for strings unless embedding HTML or avoiding escaping
- **Semicolons**: Required at end of statements
- **Indentation**: 4 spaces (not tabs)
- **Naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for class names
  - `UPPER_SNAKE_CASE` for constants

#### Example:

```javascript
// Good
const userName = 'John Doe';
const MAX_RETRIES = 3;

function calculateTotal(items) {
    let total = 0;
    items.forEach(item => {
        total += item.price;
    });
    return total;
}

// Bad
var user_name = "John Doe"  // No semicolon, double quotes, snake_case
function CalculateTotal(items) { // PascalCase for function
    var Total = 0  // var instead of const/let
    return Total
}
```

### HTML Style

- **Semantic HTML5** - Use appropriate semantic elements (`<section>`, `<nav>`, `<article>`, etc.)
- **Accessibility** - Include ARIA labels where appropriate
- **Mobile-first** - Design for mobile devices first
- **Indentation**: 4 spaces

### CSS Style

- **CSS Custom Properties** - Use CSS variables defined in `:root` for theming
- **Mobile-first responsive design** - Default styles for mobile, use media queries for larger screens
- **BEM-like naming** when adding new components (`block__element--modifier`)
- **Transitions**: Use smooth animations (0.4s cubic-bezier)
- **Indentation**: 4 spaces

#### Color Palette

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

### JSDoc Comments

Add JSDoc comments to all public/exported functions:

```javascript
/**
 * Save a new client or update an existing one
 * Validates required fields and stores to localStorage
 * 
 * @returns {void}
 * @side-effect Updates this.clients array and localStorage
 * @side-effect Shows notification to user
 * @side-effect Refreshes client list and dashboard
 */
saveClient() {
    // Implementation
}

/**
 * Format a number as currency based on current language
 * 
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$100.00", "€100,00")
 */
formatCurrency(amount) {
    // Implementation
}
```

## Testing

### No Automated Tests

This project does **not** have automated testing infrastructure (no Jest, Mocha, or similar frameworks). All testing is done manually in the browser.

### Manual Testing Checklist

When making changes, manually test:

1. **Browser Compatibility**:
   - Chrome/Edge 90+
   - Firefox 88+
   - Safari 14+
   - Mobile browsers (iOS Safari, Chrome Android)

2. **Core Functionality**:
   - [ ] Client CRUD operations (Create, Read, Update, Delete)
   - [ ] Session scheduling and management
   - [ ] Inventory tracking and updates
   - [ ] Multi-language switching (EN, ES, RU, HE)
   - [ ] Multi-currency display (USD, EUR, RUB, ILS, GBP, MXN)
   - [ ] Data export/import functionality

3. **PWA Features**:
   - [ ] Service worker registration
   - [ ] Offline functionality (disable network in DevTools)
   - [ ] Install prompt appears
   - [ ] App can be installed
   - [ ] Notifications work (use test-notifications.html)

4. **Mobile Testing**:
   - [ ] Hamburger menu works
   - [ ] Touch interactions are smooth
   - [ ] UI adapts to screen size
   - [ ] Safe area insets respected (notched devices)

5. **LocalStorage**:
   - [ ] Data persists after page reload
   - [ ] Export creates valid JSON
   - [ ] Import restores data correctly

### Testing Tools

- **Browser DevTools**: Console, Application, Network tabs
- **Device Emulation**: Chrome DevTools device toolbar (Cmd/Ctrl + Shift + M)
- **Lighthouse**: Run PWA audit (DevTools → Lighthouse tab)
- **test-notifications.html**: Test notification functionality

### Testing Procedure

1. Open the app in target browser
2. Open DevTools Console to check for errors
3. Test affected features manually
4. Verify data in Application → LocalStorage
5. Test on mobile devices or using device emulation
6. Test offline by disabling network in DevTools Network tab

## Proposing Changes

### Before You Start

1. **Check existing issues**: Search for related issues or feature requests
2. **Open an issue first**: For significant changes, open an issue to discuss before implementing
3. **Keep changes minimal**: Make the smallest changes necessary to accomplish your goal

### Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Follow the coding style guide
   - Add JSDoc comments to new functions
   - Test manually in multiple browsers

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

   Commit message format:
   - Use imperative mood: "Add feature" not "Added feature"
   - Keep first line under 72 characters
   - Add detailed description if needed

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Use the PR template (if available)
   - Describe what changed and why
   - Include screenshots for UI changes
   - Mention any breaking changes
   - Link to related issues

### Pull Request Guidelines

- **Keep PRs focused**: One feature or fix per PR
- **Test thoroughly**: Manually test in multiple browsers
- **Update documentation**: Update README.md or comments if needed
- **Preserve functionality**: Don't remove working features
- **No new dependencies**: Avoid adding npm packages or frameworks
- **Security**: Don't introduce XSS vulnerabilities or hardcoded secrets

### What to Avoid

- ❌ Adding backend or server-side code
- ❌ Sending data to external services
- ❌ Adding analytics or tracking
- ❌ Using jQuery or other heavy frameworks
- ❌ Adding build processes (webpack, rollup, etc.)
- ❌ Breaking offline functionality
- ❌ Removing existing working features without justification

## Release Update Process

### Version Updates

This project doesn't use semantic versioning in package.json (no package.json exists). Version updates are managed through:

1. **Service Worker Cache Version** (`sw.js`):
   ```javascript
   const CACHE_NAME = 'inkmanager-v1.2.3';
   ```
   Update this when making breaking changes or significant updates to ensure users get fresh content.

2. **PWA Manifest Version** (`manifest.json`):
   ```json
   {
     "name": "InkManager Pro V2",
     "short_name": "InkManager",
     "version": "2.0.0"
   }
   ```

### When to Update Cache Version

Update `CACHE_NAME` in `sw.js` when:
- Changing HTML structure significantly
- Updating core JavaScript logic
- Changing CSS that affects layout
- Adding/removing cached resources
- Fixing critical bugs

**Don't update** for:
- Minor copy changes
- Documentation updates
- Adding comments

### Deployment

This is a static site. Deployment process:

1. **Merge PR to main branch**
2. **Update cache version** if needed (in `sw.js`)
3. **Deploy to hosting** (GitHub Pages, Netlify, Vercel, etc.)
4. **Verify deployment**:
   - Check service worker updates
   - Test PWA features
   - Verify all assets load correctly

### User Data Migration

When making changes that affect data structure in LocalStorage:

1. **Provide migration logic** in the `InkManagerPro` constructor
2. **Handle missing fields gracefully** with default values
3. **Test with old data formats** before releasing
4. **Document migration** in commit message or PR

Example migration:
```javascript
// Migrate old data format to new format
if (this.clients.length > 0 && !this.clients[0].hasOwnProperty('newField')) {
    this.clients = this.clients.map(client => ({
        ...client,
        newField: 'defaultValue'
    }));
    this.safeSaveData();
}
```

## Getting Help

### Resources

- **README.md**: Feature overview and basic usage
- **PRIVACY.md**: Privacy policy and data handling
- **Issues**: Search existing issues for similar problems
- **MDN Web Docs**: https://developer.mozilla.org/ - Web API reference
- **Can I Use**: https://caniuse.com/ - Browser compatibility

### Questions and Support

- **Questions**: Open a GitHub issue with the `question` label
- **Bug Reports**: Use the bug report template (`.github/ISSUE_TEMPLATE/bug_report.md`)
- **Feature Requests**: Use the feature request template (`.github/ISSUE_TEMPLATE/feature_request.md`)

### Reporting Security Issues

If you discover a security vulnerability:
1. **Do not open a public issue**
2. Contact the maintainer directly via email (check GitHub profile)
3. Provide detailed information about the vulnerability

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project and users
- Welcome newcomers and help them contribute

## License

By contributing to InkManager Pro V2, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎨✨
