/**
 * InkManager Pro - Main Application Entry Point
 * Initializes the application and handles PWA setup, sidebar drawer, and routing
 */

import InkManagerPro from './inkmanager.js';

// PWA Install Prompt Handler
let deferredPrompt = null;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 PWA install prompt available');
    // Prevent the default browser install prompt
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e;
    // Show the install button
    showInstallButton();
});

/**
 * Show the PWA install button when install is available
 */
function showInstallButton() {
    const installBtn = document.getElementById('installButton');
    const installPrompt = document.querySelector('.install-prompt');
    
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.classList.add('pulse');
    }
    
    // Optionally show the install prompt banner
    if (installPrompt) {
        installPrompt.classList.add('show');
    }
}

/**
 * Handle PWA install button click
 */
window.handleInstallClick = function() {
    if (!deferredPrompt) {
        console.log('⚠️ Install prompt not available');
        return;
    }
    
    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            showInstallToast('🎉 App installed successfully!');
            hideInstallUI();
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        // Clear the deferred prompt
        deferredPrompt = null;
    });
};

/**
 * Hide install UI after installation
 */
function hideInstallUI() {
    const installBtn = document.getElementById('installButton');
    const installPrompt = document.querySelector('.install-prompt');
    
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    if (installPrompt) {
        installPrompt.classList.remove('show');
    }
}

/**
 * Show toast notification for install
 * @param {string} message - The message to display
 */
function showInstallToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Listen for successful app installation
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    showInstallToast('🎉 App installed! You can now use it offline.');
    hideInstallUI();
});

/**
 * Fix viewport height for mobile devices
 */
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Sidebar Drawer Controller
 * Handles mobile/tablet drawer behavior
 */
class SidebarDrawer {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.backdrop = document.getElementById('sidebarBackdrop');
        this.toggle = document.getElementById('sidebarToggle');
        this.isMobile = window.matchMedia('(max-width: 1024px)');
        
        this.init();
    }
    
    init() {
        if (!this.sidebar || !this.backdrop || !this.toggle) {
            console.warn('⚠️ Sidebar elements not found');
            return;
        }
        
        // Set initial ARIA attributes
        this.updateAriaAttributes(false);
        
        // Toggle button click
        this.toggle.addEventListener('click', () => this.toggleDrawer());
        
        // Backdrop click to close
        this.backdrop.addEventListener('click', () => this.close());
        
        // Handle window resize
        this.isMobile.addEventListener('change', (e) => {
            if (!e.matches) {
                // Desktop view - close drawer
                this.close();
            }
        });
        
        console.log('✅ Sidebar drawer initialized');
    }
    
    toggleDrawer() {
        const isOpen = this.sidebar.getAttribute('aria-hidden') === 'false';
        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        if (!this.isMobile.matches) return; // Only on mobile/tablet
        
        this.sidebar.setAttribute('aria-hidden', 'false');
        this.backdrop.classList.add('show');
        this.updateAriaAttributes(true);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.sidebar.setAttribute('aria-hidden', 'true');
        this.backdrop.classList.remove('show');
        this.updateAriaAttributes(false);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    updateAriaAttributes(isOpen) {
        this.toggle.setAttribute('aria-expanded', isOpen);
        this.toggle.setAttribute('aria-controls', 'sidebar');
    }
}

/**
 * Hash-based Router
 * Manages navigation between sections
 */
class HashRouter {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link[data-section]');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-item[data-section]');
        this.drawer = null; // Will be set by initializeApp
        
        this.init();
    }
    
    init() {
        // Handle nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
        
        // Handle mobile nav link clicks
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
        
        // Handle hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Load initial section from hash
        this.handleHashChange();
        
        console.log('✅ Hash router initialized');
    }
    
    setDrawer(drawer) {
        this.drawer = drawer;
    }
    
    handleNavClick(e, link) {
        e.preventDefault();
        
        const sectionId = link.getAttribute('data-section');
        if (!sectionId) return;
        
        // Update URL hash
        window.location.hash = sectionId;
        
        // Auto-close drawer on mobile after selection
        if (this.drawer && window.matchMedia('(max-width: 1024px)').matches) {
            setTimeout(() => {
                this.drawer.close();
            }, 150); // Small delay for better UX
        }
    }
    
    handleHashChange() {
        let hash = window.location.hash.slice(1); // Remove #
        
        // Default to dashboard if no hash
        if (!hash) {
            hash = 'dashboard';
            window.location.hash = hash;
        }
        
        // Show the target section
        this.showSection(hash);
        
        // Update active nav items
        this.updateActiveNav(hash);
        
        // Focus on the shown section for accessibility
        this.focusSection(hash);
    }
    
    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            
            // If there's an app method to refresh the section, call it
            if (window.app && typeof window.app.showSection === 'function') {
                window.app.showSection(sectionId);
            }
        }
    }
    
    updateActiveNav(sectionId) {
        // Update sidebar nav links
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
        
        // Update mobile nav links
        this.mobileNavLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
    
    focusSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Set tabindex to make it focusable
            targetSection.setAttribute('tabindex', '-1');
            // Focus the section
            targetSection.focus();
        }
    }
}

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 InkManager Pro - Initializing...');
    
    // Create and initialize the app
    window.app = new InkManagerPro();
    
    // Initialize sidebar drawer
    const drawer = new SidebarDrawer();
    
    // Initialize router
    const router = new HashRouter();
    router.setDrawer(drawer);
    
    // Set viewport height for mobile
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Refresh all views after a short delay
    setTimeout(() => {
        window.app.refreshAll();
    }, 100);
    
    console.log('✅ InkManager Pro - Ready!');
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}
