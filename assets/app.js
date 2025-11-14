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
 * Displays the install button and optional prompt banner
 * 
 * @returns {void}
 * @side-effect Modifies DOM by showing install button and prompt banner
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
 * Triggers the browser's PWA installation prompt and handles user response
 * 
 * @returns {void}
 * @side-effect Shows browser install prompt
 * @side-effect Displays toast notification on success
 * @side-effect Hides install UI on success
 * @side-effect Clears deferredPrompt reference
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
 * Removes install button and prompt banner from the UI
 * 
 * @returns {void}
 * @side-effect Hides install button and prompt banner in DOM
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
 * Displays a temporary toast message that auto-dismisses after 4 seconds
 * 
 * @param {string} message - The message to display in the toast
 * @returns {void}
 * @side-effect Displays toast element in DOM for 4 seconds
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
 * Opens or closes the mobile navigation sidebar
 * 
 * @returns {void}
 * @side-effect Updates isMobileMenuOpen state
 * @side-effect Modifies sidebar display and body overflow
 * @side-effect Adds/removes CSS classes on body element
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
 * On desktop: toggles sidebar collapse state
 * On mobile: opens/closes mobile menu
 * 
 * @returns {void}
 * @side-effect Saves collapsed state to localStorage (desktop only)
 * @side-effect Calls toggleMobileMenu() on mobile
 * @side-effect Toggles sidebar-collapsed class on body (desktop)
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
 * Detects clicks outside the sidebar and closes the mobile menu
 * 
 * @param {Event} event - The click event
 * @returns {void}
 * @side-effect Closes mobile menu if click is outside sidebar
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
 * Sets up click event listeners on all navigation links
 * 
 * @returns {void}
 * @side-effect Attaches click event listeners to all nav links
 * @side-effect Delegates section changes to window.app.showSection
 * @side-effect Closes mobile menu after navigation on mobile
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
 * Sets up click handlers for inventory filter tabs
 * 
 * @returns {void}
 * @side-effect Attaches click event listeners to inventory tab buttons
 * @side-effect Delegates filter changes to window.app.setInventoryFilter
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
 * Sets up event listeners for closing modals on outside click or Escape key
 * 
 * @returns {void}
 * @side-effect Attaches click event listeners to all modal elements
 * @side-effect Attaches keydown listener to document for Escape key
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

/**
 * Handle adding material to current session
 * Delegates to the main app's addMaterialToSession method
 * 
 * @returns {void}
 * @side-effect Calls window.app.addMaterialToSession if available
 */
function handleMaterialAdd() {
    if (window.app && window.app.addMaterialToSession) {
        window.app.addMaterialToSession();
    }
}

/**
 * Handle removing material from current session
 * Delegates to the main app's removeMaterial method
 * 
 * @param {number} index - The index of the material to remove
 * @returns {void}
 * @side-effect Calls window.app.removeMaterial if available
 */
function handleMaterialRemove(index) {
    if (window.app && window.app.removeMaterial) {
        window.app.removeMaterial(index);
    }
}

/**
 * Initialize all app functionality
 * Main initialization function called on DOM ready
 * Sets up all event listeners and initializes UI components
 * 
 * @returns {void}
 * @side-effect Attaches multiple event listeners for PWA, sidebar, routing, etc.
 * @side-effect Restores sidebar collapsed state from localStorage
 * @side-effect Sets up window resize handler
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
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is installed, show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('📦 Service Worker updated:', event.data.version);
                showUpdateNotification();
            }
        });
    });
}

/**
 * Show update notification when a new version is available
 * Creates and displays a toast notification prompting user to reload
 * 
 * @returns {void}
 * @side-effect Creates and appends update toast element to DOM
 */
function showUpdateNotification() {
    const updateToast = document.createElement('div');
    updateToast.className = 'toast show update-toast';
    updateToast.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <div style="font-weight: 600;">
                🎉 New version available!
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.9rem;" onclick="dismissUpdateNotification()">
                    Later
                </button>
                <button class="btn btn-success" style="padding: 8px 16px; font-size: 0.9rem;" onclick="reloadApp()">
                    <i class="fas fa-sync-alt"></i> Update Now
                </button>
            </div>
        </div>
    `;
    updateToast.style.background = 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
    updateToast.style.padding = '20px 25px';
    updateToast.style.borderRadius = '16px';
    updateToast.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
    updateToast.style.maxWidth = '95%';
    updateToast.style.zIndex = '10000';
    
    document.body.appendChild(updateToast);
}

/**
 * Dismiss the update notification
 * Hides and removes the update notification toast
 * 
 * @returns {void}
 * @side-effect Removes update toast from DOM after transition
 */
function dismissUpdateNotification() {
    const updateToast = document.querySelector('.update-toast');
    if (updateToast) {
        updateToast.classList.remove('show');
        setTimeout(() => {
            updateToast.remove();
        }, 400);
    }
}

/**
 * Reload the app to activate the new service worker
 * Sends SKIP_WAITING message to service worker and reloads the page
 * 
 * @returns {void}
 * @side-effect Sends message to service worker
 * @side-effect Reloads the browser window
 */
function reloadApp() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
}

// Export functions for use by inline handlers and the main app
window.handleInstallClick = handleInstallClick;
window.toggleMobileMenu = toggleMobileMenu;
window.handleSidebarToggle = handleSidebarToggle;
window.handleMaterialAdd = handleMaterialAdd;
window.handleMaterialRemove = handleMaterialRemove;
window.dismissUpdateNotification = dismissUpdateNotification;
window.reloadApp = reloadApp;
