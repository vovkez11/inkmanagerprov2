/**
 * InkManager Pro - Main Application Entry Point
 * Initializes the application and handles PWA setup
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
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 InkManager Pro - Initializing...');
    
    // Create and initialize the app
    window.app = new InkManagerPro();
    
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
