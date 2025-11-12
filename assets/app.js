/**
 * InkManager Pro - Main Application JavaScript
 * Handles mobile menu, PWA install prompt, routing, and UI interactions
 */

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
function handleInstallClick() {
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
            showToast('🎉 App installed successfully!');
            hideInstallUI();
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        // Clear the deferred prompt
        deferredPrompt = null;
    });
}

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
 * Show toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
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
    showToast('🎉 App installed! You can now use it offline.');
    hideInstallUI();
});

// Mobile Menu Toggle
let isMobileMenuOpen = false;

/**
 * Toggle mobile sidebar menu
 */
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    if (!sidebar) return;
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        // Open menu
        body.classList.add('mobile-open');
        sidebar.style.display = 'flex';
        
        // Force reflow to trigger animation
        sidebar.offsetHeight;
        
        // Prevent body scroll when menu is open
        body.style.overflow = 'hidden';
    } else {
        // Close menu
        body.classList.remove('mobile-open');
        body.style.overflow = '';
        
        // Hide sidebar after transition completes
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                if (!isMobileMenuOpen) {
                    sidebar.style.display = '';
                }
            }, 300);
        }
    }
}

/**
 * Handle sidebar toggle button click
 */
function handleSidebarToggle() {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    
    // On desktop, toggle collapse state
    if (window.innerWidth > 768) {
        const isCollapsed = body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
        
        // Force a reflow to ensure transition happens
        if (sidebar) {
            sidebar.offsetHeight;
        }
        
        // Update app container
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.offsetHeight;
        }
    } else {
        // On mobile, toggle mobile menu
        toggleMobileMenu();
    }
}

/**
 * Close mobile menu when clicking outside
 */
function handleOutsideClick(event) {
    if (isMobileMenuOpen && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggleBtn && !toggleBtn.contains(event.target)) {
            toggleMobileMenu();
        }
    }
}

/**
 * Basic Client-Side Routing
 * Handles navigation between sections using hash-based routing
 */
function initRouting() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            if (sectionId && window.app) {
                window.app.showSection(sectionId);
            }
            
            // Close mobile menu after navigation
            if (isMobileMenuOpen && window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });
}

/**
 * Handle inventory tab filtering
 */
function initInventoryTabs() {
    const tabButtons = document.querySelectorAll('#inventoryTabs [data-filter]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            if (window.app && window.app.setInventoryFilter) {
                window.app.setInventoryFilter(filter);
            }
        });
    });
}

/**
 * Handle modal open/close
 */
function initModals() {
    // Close modal when clicking outside modal content
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Handle escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

/**
 * Material add/remove handlers
 * These are placeholder stubs that hook into the main app
 */
function handleMaterialAdd() {
    if (window.app && window.app.addMaterialToSession) {
        window.app.addMaterialToSession();
    }
}

function handleMaterialRemove(index) {
    if (window.app && window.app.removeMaterial) {
        window.app.removeMaterial(index);
    }
}

/**
 * Initialize all app functionality
 */
function initApp() {
    console.log('🚀 Initializing InkManager Pro UI...');
    
    // Setup PWA install button
    const installBtn = document.getElementById('installButton');
    if (installBtn) {
        installBtn.addEventListener('click', handleInstallClick);
    }
    
    // Setup install prompt dismiss button (if exists)
    const installPromptDismiss = document.querySelector('.install-prompt .btn-outline');
    if (installPromptDismiss) {
        installPromptDismiss.addEventListener('click', () => {
            const installPrompt = document.querySelector('.install-prompt');
            if (installPrompt) {
                installPrompt.classList.remove('show');
            }
        });
    }
    
    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', handleSidebarToggle);
    }
    
    // Setup mobile menu overlay click
    document.addEventListener('click', handleOutsideClick);
    
    // Restore sidebar collapsed state on desktop
    if (window.innerWidth > 768) {
        const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        if (isCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        }
    }
    
    // Initialize routing
    initRouting();
    
    // Initialize inventory tabs
    initInventoryTabs();
    
    // Initialize modals
    initModals();
    
    // Handle window resize to reset mobile menu state
    let resizeTimer;
    let lastWidth = window.innerWidth;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentWidth = window.innerWidth;
            
            // Only reset if crossing the mobile/desktop breakpoint
            if ((lastWidth <= 768 && currentWidth > 768) || (lastWidth > 768 && currentWidth <= 768)) {
                if (currentWidth > 768) {
                    // Reset mobile menu state on desktop
                    isMobileMenuOpen = false;
                    document.body.classList.remove('mobile-open');
                    document.body.style.overflow = '';
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.style.display = '';
                    }
                } else {
                    // Reset desktop sidebar state on mobile
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.style.display = '';
                    }
                }
            }
            
            lastWidth = currentWidth;
        }, 250);
    });
    
    console.log('✅ InkManager Pro UI initialized');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded
    initApp();
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Export functions for use by inline handlers and the main app
window.handleInstallClick = handleInstallClick;
window.toggleMobileMenu = toggleMobileMenu;
window.handleSidebarToggle = handleSidebarToggle;
window.handleMaterialAdd = handleMaterialAdd;
window.handleMaterialRemove = handleMaterialRemove;
