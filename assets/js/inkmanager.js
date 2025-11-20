/**
 * InkManager Pro - Main Application Class
 * Complete tattoo studio management system
 */

import { translations, currencyConfig, formatCurrency as formatCurrencyUtil, translate as translateUtil, updateDOMTranslations } from './modules/i18n.js';
import * as Storage from './modules/storage.js';
import { showToast, debounce } from './modules/ui.js';
import * as Inventory from './modules/inventory.js';
import * as Analytics from './modules/analytics.js';
import * as Notifications from './modules/notifications.js';
import * as DataManager from './modules/data-manager.js';
import settingsManager from './modules/settings.js';

// INKMANAGER PRO - COMPLETE REWRITTEN VERSION WITH PERFECT MULTI-LANGUAGE & CURRENCY SUPPORT
        class InkManagerPro {
            constructor() {
                // Load data using storage module
                this.clients = Storage.loadClients();
                this.sessions = Storage.loadSessions();
                this.inventory = Storage.loadInventory();
                this.inventoryFilter = Storage.getItem('inkmanager_inventoryFilter', 'all');
                this.inventorySort = Storage.loadData('inkmanager_inventorySort', {key: 'name', dir: 'asc'});
                this.inventorySearchQuery = '';
                this.selectedInventory = new Set();
                
                // On mobile, always start with sidebar closed (true)
                // On desktop, use saved preference
                const isMobile = window.innerWidth <= 1024;
                const savedState = Storage.getItem('inkmanager_sidebarCollapsed', 'false') === 'true';
                this.sidebarCollapsed = isMobile ? true : savedState;
                
                this.lastDeletedInventory = null;
                this.undoDeleteTimer = null;
                this.currentMonth = new Date().getMonth();
                this.currentYear = new Date().getFullYear();
                this.editingClientId = null;
                this.editingItemId = null;
                this.editingSessionId = null;
                this.currentSessionMaterials = [];
                this.currentLanguage = Storage.getItem('inkmanager_language', 'en');
                
                // Cache DOM elements to avoid repeated queries
                this.domCache = {};
                
                // Debounced save to reduce localStorage writes
                this.saveTimeout = null;
                
                // Cache for sorted inventory to avoid re-sorting unchanged data
                this.sortedInventoryCache = null;
                this.sortedInventoryCacheKey = null;
                
                // Use imported currency and translation configurations
                this.currencyConfig = currencyConfig;
                this.translations = translations;

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.setupPWA();
                this.setupMobileEnhancements();
                this.setupHistory();
                settingsManager.init();
                this.setLanguage(settingsManager.get('language') || 'en');
                this.applySidebarState();
                this.updateInventoryTabsUI();
                this.syncInventorySortUI();
                this.updateBulkActionsUI();
                this.setupNotifications();
                
                // Register notification change callback
                settingsManager.on('onNotificationsChange', (data) => {
                    if (data.value) {
                        this.setupNotifications();
                    } else {
                        this.stopNotificationScheduler();
                    }
                });
                
                console.log('🎨 InkManager Pro - Complete Rewritten Version Initialized');
            }

            setupMobileEnhancements() {
                // Detect if running as PWA
                const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                              window.navigator.standalone === true;

                if (isPWA) {
                    console.log('📱 Running as PWA - Mobile optimizations enabled');
                }

                // Add viewport height fix for mobile browsers
                const setViewportHeight = () => {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                };
                setViewportHeight();
                window.addEventListener('resize', setViewportHeight);
                window.addEventListener('orientationchange', setViewportHeight);

                // Pull to refresh for mobile
                let touchStartY = 0;
                let touchEndY = 0;
                let isPulling = false;
                const appContainer = document.querySelector('.app-container');
                const pullIndicator = document.getElementById('pullToRefresh');
                
                if (appContainer) {
                    appContainer.addEventListener('touchstart', (e) => {
                        touchStartY = e.touches[0].clientY;
                        isPulling = false;
                    }, { passive: true });

                    appContainer.addEventListener('touchmove', (e) => {
                        touchEndY = e.touches[0].clientY;
                        const pullDistance = touchEndY - touchStartY;
                        
                        // Show indicator if pulling down from top
                        if (appContainer.scrollTop === 0 && pullDistance > 50) {
                            isPulling = true;
                            if (pullIndicator) {
                                pullIndicator.classList.add('active');
                            }
                        }
                    }, { passive: true });

                    appContainer.addEventListener('touchend', () => {
                        if (pullIndicator) {
                            pullIndicator.classList.remove('active');
                        }
                        
                        if (appContainer.scrollTop === 0 && touchEndY > touchStartY + 80 && isPulling) {
                            this.showNotification('🔄 Refreshing data...');
                            this.refreshAll();
                        }
                        isPulling = false;
                    }, { passive: true });
                }

                // Swipe gestures for navigation (mobile only)
                if (window.innerWidth <= 1024) {
                    let touchStartX = 0;
                    let touchStartTime = 0;
                    const swipeLeftIndicator = document.getElementById('swipeLeft');
                    const swipeRightIndicator = document.getElementById('swipeRight');
                    const sections = ['dashboard', 'clients', 'sessions', 'inventory', 'calendar', 'reports', 'settings'];
                    
                    document.addEventListener('touchstart', (e) => {
                        // Don't interfere with form inputs or buttons
                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                            e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' ||
                            e.target.closest('button') || e.target.closest('.modal')) {
                            return;
                        }
                        
                        touchStartX = e.touches[0].clientX;
                        touchStartTime = Date.now();
                    }, { passive: true });

                    document.addEventListener('touchmove', (e) => {
                        if (touchStartX === 0) return;
                        
                        const touchX = e.touches[0].clientX;
                        const diff = touchX - touchStartX;
                        
                        // Show swipe indicators
                        if (Math.abs(diff) > 50) {
                            if (diff > 0 && swipeLeftIndicator) {
                                swipeLeftIndicator.classList.add('active');
                            } else if (diff < 0 && swipeRightIndicator) {
                                swipeRightIndicator.classList.add('active');
                            }
                        }
                    }, { passive: true });

                    document.addEventListener('touchend', (e) => {
                        if (touchStartX === 0) return;
                        
                        const touchEndX = e.changedTouches[0].clientX;
                        const diff = touchEndX - touchStartX;
                        const timeDiff = Date.now() - touchStartTime;
                        
                        // Hide indicators
                        if (swipeLeftIndicator) swipeLeftIndicator.classList.remove('active');
                        if (swipeRightIndicator) swipeRightIndicator.classList.remove('active');
                        
                        // Swipe gesture detected (at least 100px and fast enough)
                        if (Math.abs(diff) > 100 && timeDiff < 300) {
                            const currentIndex = sections.indexOf(this.currentSection);
                            if (currentIndex !== -1) {
                                if (diff > 0 && currentIndex > 0) {
                                    // Swipe right - go to previous section
                                    this.showSection(sections[currentIndex - 1]);
                                } else if (diff < 0 && currentIndex < sections.length - 1) {
                                    // Swipe left - go to next section
                                    this.showSection(sections[currentIndex + 1]);
                                }
                            }
                        }
                        
                        touchStartX = 0;
                        touchStartTime = 0;
                    }, { passive: true });
                }

                // Prevent overscroll bounce on iOS when at top/bottom
                document.body.addEventListener('touchmove', (e) => {
                    if (e.target === document.body) {
                        e.preventDefault();
                    }
                }, { passive: false });

                // Add mobile-specific keyboard handling
                // Note: Only apply on non-iOS devices as iOS Safari handles this natively
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                if (!isIOS) {
                    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(input => {
                        // Auto-scroll to input when focused on mobile
                        input.addEventListener('focus', () => {
                            if (window.innerWidth <= 1024) {
                                setTimeout(() => {
                                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 300);
                            }
                        });
                    });
                }

                // Better touch feedback
                if ('ontouchstart' in window) {
                    document.body.classList.add('touch-device');
                }

                // Optimize performance for mobile
                if (window.innerWidth <= 1024) {
                    // Reduce animation complexity on mobile
                    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
                }
            }

            debounce(fn, delay) {
                let timerId;
                return (...args) => {
                    clearTimeout(timerId);
                    timerId = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            applySidebarState() {
                // Check if on mobile (screen width < 768px)
                const isMobile = window.innerWidth <= 1024;
                
                if (isMobile) {
                    // On mobile, use mobile-open class to slide sidebar in/out
                    // When sidebarCollapsed is false, we want the menu OPEN
                    // When sidebarCollapsed is true, we want the menu CLOSED
                    document.body.classList.toggle('mobile-open', !this.sidebarCollapsed);
                    // Remove desktop sidebar-collapsed class on mobile
                    document.body.classList.remove('sidebar-collapsed');
                } else {
                    // On desktop, toggle sidebar-collapsed class to expand/collapse sidebar
                    document.body.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
                    // Remove mobile-open class on desktop
                    document.body.classList.remove('mobile-open');
                }
                
                const toggleBtn = document.getElementById('sidebarToggle');
                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        // On mobile, show bars icon when closed, times icon when open
                        if (isMobile) {
                            // sidebarCollapsed = true → closed → show bars
                            // sidebarCollapsed = false → open → show times (X)
                            icon.className = this.sidebarCollapsed ? 'fas fa-bars' : 'fas fa-times';
                        } else {
                            icon.className = this.sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
                        }
                    }
                    const label = isMobile
                        ? (this.sidebarCollapsed ? 'Open Menu' : 'Close Menu')
                        : (this.sidebarCollapsed
                            ? (this.translate('expand_sidebar') || 'Expand Sidebar')
                            : (this.translate('collapse_sidebar') || 'Collapse Sidebar'));
                    toggleBtn.title = label;
                    toggleBtn.setAttribute('aria-label', label);
                    toggleBtn.setAttribute('aria-pressed', this.sidebarCollapsed ? 'false' : 'true');
                }
            }

            toggleSidebar() {
                this.sidebarCollapsed = !this.sidebarCollapsed;
                // Only save state on desktop, not on mobile
                const isMobile = window.innerWidth <= 1024;
                if (!isMobile) {
                    localStorage.setItem('inkmanager_sidebarCollapsed', this.sidebarCollapsed);
                }
                this.applySidebarState();
            }

            // Debounce utility for search inputs - prevents excessive re-renders
            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

            formatCurrency(amount) {
                const config = this.currencyConfig[this.currentLanguage] || this.currencyConfig['en'];
                if (!amount) amount = 0;
                
                try {
                    return new Intl.NumberFormat(config.locale, {
                        style: 'currency',
                        currency: config.code,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }).format(amount);
                } catch (error) {
                    // Fallback formatting
                    return `${config.symbol}${amount.toLocaleString(config.locale, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}`;
                }
            }

            setLanguage(lang) {
                this.currentLanguage = lang;
                localStorage.setItem('inkmanager_language', lang);
                
                // Update both language dropdowns if they exist
                const languageSelect = document.getElementById('languageSelect');
                if (languageSelect) {
                    languageSelect.value = lang;
                }
                
                const settingsLanguage = document.getElementById('settingsLanguage');
                if (settingsLanguage) {
                    settingsLanguage.value = lang;
                }
                
                // Apply translations to all elements
                this.applyTranslations();
                
                this.applySidebarState();
                this.refreshAll();
            }

            applyTranslations() {
                // Apply translations to all elements with data-i18n attributes
                // This method can be called after dynamic content is added to the DOM
                const i18nElements = document.querySelectorAll('[data-i18n]');
                const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
                
                // Update text content translations
                i18nElements.forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                        element.textContent = this.translations[this.currentLanguage][key];
                    }
                });
                
                // Update placeholder translations
                i18nPlaceholders.forEach(element => {
                    const key = element.getAttribute('data-i18n-placeholder');
                    if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                        element.placeholder = this.translations[this.currentLanguage][key];
                    }
                });
            }

            setupPWA() {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('./sw.js')
                        .then(registration => {
                            console.log('✅ Service Worker registered:', registration);
                            
                            // Check for service worker updates
                            registration.addEventListener('updatefound', () => {
                                const newWorker = registration.installing;
                                console.log('🔄 Service Worker update found');
                                
                                newWorker.addEventListener('statechange', () => {
                                    // Only show update notification when newWorker is installed
                                    // and there's an existing controller (not first install)
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New service worker available, prompt user to update
                                        console.log('✨ New version available');
                                        this.showUpdatePrompt();
                                    }
                                });
                            });
                            
                            // AGGRESSIVE UPDATE DETECTION
                            // Check for updates immediately on page load
                            registration.update().catch(err => {
                                console.log('⚠️ Initial update check failed:', err);
                            });
                            
                            // Check for updates when user returns to the page
                            document.addEventListener('visibilitychange', () => {
                                if (!document.hidden && registration) {
                                    console.log('👁️ Page visible, checking for updates...');
                                    registration.update().catch(err => {
                                        console.log('⚠️ Update check on visibility change failed:', err);
                                    });
                                }
                            });
                            
                            // Check for updates periodically (every 5 minutes for more aggressive updates)
                            setInterval(() => {
                                if (registration) {
                                    registration.update().catch(err => {
                                        console.log('⚠️ Periodic update check failed:', err);
                                    });
                                }
                            }, 300000); // Check every 5 minutes (300000ms) instead of every hour
                        })
                        .catch(error => {
                            console.log('❌ Service Worker registration failed:', error);
                        });
                    
                    // Listen for messages from service worker
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        // Defensive check to ensure event.data exists
                        if (event.data && event.data.type === 'SW_UPDATED') {
                            console.log('📢 Service Worker updated:', event.data.version);
                            this.showUpdatePrompt();
                        }
                    });
                }

                let deferredPrompt;
                const installButton = document.getElementById('installButton');
                const installPrompt = document.getElementById('installPrompt');

                window.addEventListener('beforeinstallprompt', (e) => {
                    console.log('🎯 PWA Install Prompt triggered');
                    e.preventDefault();
                    deferredPrompt = e;
                    
                    if (installButton) {
                        installButton.style.display = 'inline-flex';
                        installButton.classList.add('pulse');
                    }
                    
                    setTimeout(() => {
                        if (deferredPrompt && installPrompt) {
                            installPrompt.classList.add('show');
                        }
                    }, 5000);
                });

                if (installButton) {
                    installButton.addEventListener('click', async () => {
                        if (deferredPrompt) {
                            deferredPrompt.prompt();
                            const { outcome } = await deferredPrompt.userChoice;
                            
                            if (outcome === 'accepted') {
                                console.log('✅ User accepted install');
                                installButton.style.display = 'none';
                                if (installPrompt) installPrompt.classList.remove('show');
                                this.showNotification('🎉 App installed successfully!');
                            }
                            deferredPrompt = null;
                        }
                    });
                }

                const installConfirmBtn = document.getElementById('installConfirmBtn');
                const installDismissBtn = document.getElementById('installDismissBtn');

                if (installConfirmBtn) {
                    installConfirmBtn.addEventListener('click', async () => {
                        if (deferredPrompt) {
                            deferredPrompt.prompt();
                            const { outcome } = await deferredPrompt.userChoice;
                            if (outcome === 'accepted') {
                                installPrompt.classList.remove('show');
                                this.showNotification('🎉 App installed successfully!');
                            }
                            deferredPrompt = null;
                        }
                    });
                }

                if (installDismissBtn) {
                    installDismissBtn.addEventListener('click', () => {
                        installPrompt.classList.remove('show');
                    });
                }

                window.addEventListener('appinstalled', (evt) => {
                    console.log('🏠 PWA was installed');
                    if (installButton) installButton.style.display = 'none';
                    if (installPrompt) installPrompt.classList.remove('show');
                });

                if (window.matchMedia('(display-mode: standalone)').matches) {
                    console.log('📱 Running in standalone mode');
                    if (installButton) installButton.style.display = 'none';
                }
            }

            setupEventListeners() {
                document.querySelectorAll('.nav-link[data-section]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showSection(e.currentTarget.dataset.section);
                    });
                });

                // Sidebar toggle is now handled by SidebarDrawerController in app.js
                // Sidebar closing on outside click is also handled by SidebarDrawerController backdrop
                // No longer setting up duplicate event listeners here to avoid conflicts

                const quickAddClient = document.getElementById('quickAddClient');
                if (quickAddClient) quickAddClient.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openClientModal();
                });
                const quickAddSession = document.getElementById('quickAddSession');
                if (quickAddSession) quickAddSession.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openSessionModal();
                });
                const quickAddInventory = document.getElementById('quickAddInventory');
                if (quickAddInventory) quickAddInventory.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openInventoryModal();
                });

                // Sidebar collapse button
                const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
                if (sidebarCollapseBtn) {
                    sidebarCollapseBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggleSidebar();
                    });
                }

                const languageSelect = document.getElementById('languageSelect');
                if (languageSelect) {
                    languageSelect.addEventListener('change', (e) => {
                        this.setLanguage(e.target.value);
                    });
                }

                // Settings page language dropdown
                // Note: Language on settings page should only be saved when "Save Settings" is clicked
                // The header language selector (languageSelect) still has immediate save for better UX

                const addClientBtn = document.getElementById('addClientBtn');
                if (addClientBtn) addClientBtn.addEventListener('click', () => this.openClientModal());
                const addFirstClient = document.getElementById('addFirstClient');
                if (addFirstClient) addFirstClient.addEventListener('click', () => this.openClientModal());
                const closeClientModalBtn = document.getElementById('closeClientModalBtn');
                if (closeClientModalBtn) closeClientModalBtn.addEventListener('click', () => this.closeClientModal());
                const cancelClientBtn = document.getElementById('cancelClientBtn');
                if (cancelClientBtn) cancelClientBtn.addEventListener('click', () => this.closeClientModal());
                const clientForm = document.getElementById('clientForm');
                if (clientForm) {
                    clientForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveClient();
                    });
                }

                const addSessionBtn = document.getElementById('addSessionBtn');
                if (addSessionBtn) addSessionBtn.addEventListener('click', () => this.openSessionModal());
                const addFirstSession = document.getElementById('addFirstSession');
                if (addFirstSession) addFirstSession.addEventListener('click', () => this.openSessionModal());
                const addCalendarSessionBtn = document.getElementById('addCalendarSessionBtn');
                if (addCalendarSessionBtn) addCalendarSessionBtn.addEventListener('click', () => this.openSessionModal());
                const closeSessionModalBtn = document.getElementById('closeSessionModalBtn');
                if (closeSessionModalBtn) closeSessionModalBtn.addEventListener('click', () => this.closeSessionModal());
                const sessionForm = document.getElementById('sessionForm');
                if (sessionForm) {
                    sessionForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveSession();
                    });
                }

                const addMaterialBtn = document.getElementById('addMaterialBtn');
                if (addMaterialBtn) addMaterialBtn.addEventListener('click', () => this.addMaterialToSession());
                const materialItem = document.getElementById('materialItem');
                if (materialItem) {
                    materialItem.addEventListener('change', (e) => {
                        this.updateMaterialMaxQuantity(e.target.value);
                    });
                }

                const addInventoryBtn = document.getElementById('addInventoryBtn');
                if (addInventoryBtn) addInventoryBtn.addEventListener('click', () => this.openInventoryModal());
                const addFirstItem = document.getElementById('addFirstItem');
                if (addFirstItem) addFirstItem.addEventListener('click', () => this.openInventoryModal());
                const closeInventoryModalBtn = document.getElementById('closeInventoryModalBtn');
                if (closeInventoryModalBtn) closeInventoryModalBtn.addEventListener('click', () => this.closeInventoryModal());
                const cancelInventoryBtn = document.getElementById('cancelInventoryBtn');
                if (cancelInventoryBtn) cancelInventoryBtn.addEventListener('click', () => this.closeInventoryModal());
                const inventoryForm = document.getElementById('inventoryForm');
                if (inventoryForm) {
                    inventoryForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveInventoryItem();
                    });
                }

                const prevMonthBtn = document.getElementById('prevMonthBtn');
                if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
                const nextMonthBtn = document.getElementById('nextMonthBtn');
                if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => this.changeMonth(1));

                const clientSearch = document.getElementById('clientSearch');
                if (clientSearch) clientSearch.addEventListener('input', this.debounce((e) => this.searchClients(e.target.value), 250));
                const inventorySearch = document.getElementById('inventorySearch');
                if (inventorySearch) inventorySearch.addEventListener('input', this.debounce((e) => this.searchInventory(e.target.value), 250));

                // Inventory filter tabs (desktop)
                const inventoryTabButtons = document.querySelectorAll('#inventoryTabs [data-filter]');
                inventoryTabButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const filter = e.currentTarget.getAttribute('data-filter');
                        this.setInventoryFilter(filter);
                    });
                });

                // Inventory filter dropdown (mobile)
                const inventoryFilterSelect = document.getElementById('inventoryFilterSelect');
                if (inventoryFilterSelect) {
                    inventoryFilterSelect.addEventListener('change', (e) => {
                        this.setInventoryFilter(e.target.value);
                    });
                }

                const sortKeyEl = document.getElementById('inventorySortKey');
                const sortDirBtn = document.getElementById('inventorySortDirBtn');
                if (sortKeyEl && sortDirBtn) {
                    sortKeyEl.addEventListener('change', (e) => {
                        this.setInventorySort(e.target.value, this.inventorySort.dir);
                    });
                    sortDirBtn.addEventListener('click', () => {
                        const newDir = this.inventorySort.dir === 'asc' ? 'desc' : 'asc';
                        this.setInventorySort(this.inventorySort.key, newDir);
                    });
                }

                const selectAllBtn = document.getElementById('inventorySelectAllBtn');
                const clearSelectionBtn = document.getElementById('inventoryClearSelectionBtn');
                if (selectAllBtn) selectAllBtn.addEventListener('click', () => this.selectAllInventory());
                if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => this.clearInventorySelection());

                const bulkTypeSelect = document.getElementById('inventoryBulkTypeSelect');
                const bulkTypeApplyBtn = document.getElementById('inventoryBulkTypeApplyBtn');
                const bulkDeleteBtn = document.getElementById('inventoryBulkDeleteBtn');
                const bulkExportBtn = document.getElementById('inventoryBulkExportBtn');
                if (bulkTypeSelect && bulkTypeApplyBtn) {
                    bulkTypeApplyBtn.addEventListener('click', () => {
                        if (!bulkTypeSelect.value) {
                            this.showNotification('ℹ️ Please choose a type');
                            return;
                        }
                        this.bulkChangeInventoryType(bulkTypeSelect.value);
                    });
                    bulkTypeSelect.addEventListener('change', () => {
                        if (bulkTypeApplyBtn) {
                            bulkTypeApplyBtn.disabled = this.selectedInventory.size === 0 || !bulkTypeSelect.value;
                        }
                    });
                }
                if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', () => this.bulkDeleteInventory());
                if (bulkExportBtn) bulkExportBtn.addEventListener('click', () => this.bulkExportInventory());

                const sessionDateTime = document.getElementById('sessionDateTime');
                if (sessionDateTime) {
                    const nextHour = new Date();
                    nextHour.setHours(nextHour.getHours() + 1);
                    nextHour.setMinutes(0);
                    sessionDateTime.value = this.formatDateTime(nextHour);
                }

                // Settings page event listeners
                const testNotificationsBtn = document.getElementById('testNotificationsBtn');
                if (testNotificationsBtn) testNotificationsBtn.addEventListener('click', () => this.testNotification());
                
                const backupAllDataBtn = document.getElementById('backupAllDataBtn');
                if (backupAllDataBtn) backupAllDataBtn.addEventListener('click', () => this.exportData('all'));
                
                const importDataBtn = document.getElementById('importDataBtn');
                if (importDataBtn) importDataBtn.addEventListener('click', () => this.importData());
                
                const clearAllDataBtn = document.getElementById('clearAllDataBtn');
                if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', () => this.confirmClearData());
                
                // Note: Settings buttons are now handled by settingsManager module

                // Setup mobile bottom navigation
                this.setupMobileBottomNav();
            }

            setupMobileBottomNav() {
                // Add event listeners to mobile bottom nav items
                document.querySelectorAll('.mobile-nav-item[data-section]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const section = e.currentTarget.dataset.section;
                        this.showSection(section);
                        
                        // Update active state in mobile nav
                        document.querySelectorAll('.mobile-nav-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        e.currentTarget.classList.add('active');
                    });
                });
            }

            setupHistory() {
                if (typeof history === 'undefined' || typeof history.replaceState !== 'function') {
                    return;
                }

                const sectionEls = Array.from(document.querySelectorAll('.section'));
                const sectionIds = sectionEls.map(s => s.id).filter(Boolean);
                if (sectionIds.length === 0) return;

                let initialSection = (window.location.hash || '').replace('#', '');
                if (!sectionIds.includes(initialSection)) {
                    initialSection = sectionIds.includes(this.currentSection) ? this.currentSection :
                        (sectionIds.includes('dashboard') ? 'dashboard' : sectionIds[0]);
                }

                this.showSection(initialSection, { updateHistory: false, force: true });
                history.replaceState({ section: initialSection }, '', `#${initialSection}`);

                // Prevent back button from closing app - navigate to dashboard instead
                window.addEventListener('popstate', (event) => {
                    // Check if any modal is open and close it
                    const modals = ['clientModal', 'sessionModal', 'inventoryModal'];
                    for (const modalId of modals) {
                        const modal = document.getElementById(modalId);
                        if (modal && modal.style.display === 'block') {
                            // Close the modal
                            if (modalId === 'clientModal') this.closeClientModal();
                            else if (modalId === 'sessionModal') this.closeSessionModal();
                            else if (modalId === 'inventoryModal') this.closeInventoryModal();
                            // Add history entry back to prevent going back in history
                            history.pushState(event.state, '', window.location.href);
                            return;
                        }
                    }
                    
                    // Check if mobile sidebar is open and close it
                    if (document.body.classList.contains('mobile-open')) {
                        if (window.sidebarDrawer && typeof window.sidebarDrawer.close === 'function') {
                            window.sidebarDrawer.close();
                        }
                        // Add history entry back to prevent going back in history
                        history.pushState(event.state, '', window.location.href);
                        return;
                    }
                    
                    const stateSection = event.state?.section;
                    const hashSection = (window.location.hash || '').replace('#', '');
                    
                    // If user is on dashboard and presses back, stay on dashboard
                    if (this.currentSection === 'dashboard' && !stateSection && !hashSection) {
                        history.pushState({ section: 'dashboard' }, '', '#dashboard');
                        return;
                    }
                    
                    // Navigate to the target section, default to dashboard if invalid
                    const target = sectionIds.includes(stateSection) ? stateSection :
                        (sectionIds.includes(hashSection) ? hashSection : 'dashboard');
                    this.showSection(target, { updateHistory: false, force: true });
                });

                // Add extra history entry to prevent immediate app close
                history.pushState({ section: initialSection }, '', `#${initialSection}`);
            }

            setInventoryFilter(filter) {
                this.inventoryFilter = filter || 'all';
                localStorage.setItem('inkmanager_inventoryFilter', this.inventoryFilter);
                this.updateInventoryTabsUI();
                this.refreshInventory();
            }

            updateInventoryTabsUI() {
                // Update tab buttons (desktop)
                const tabs = document.querySelectorAll('#inventoryTabs [data-filter]');
                tabs.forEach(tab => {
                    const filterValue = tab.getAttribute('data-filter');
                    // For low-stock filter, highlight the "All" tab
                    const isActive = (this.inventoryFilter === 'low-stock' && filterValue === 'all') || filterValue === this.inventoryFilter;
                    tab.classList.toggle('btn-primary', isActive);
                    tab.classList.toggle('btn-outline', !isActive);
                });
                
                // Update dropdown (mobile)
                const dropdown = document.getElementById('inventoryFilterSelect');
                if (dropdown) {
                    // For low-stock filter, set dropdown to "all" since there's no low-stock option
                    dropdown.value = this.inventoryFilter === 'low-stock' ? 'all' : this.inventoryFilter;
                }
            }

            updateBulkActionsUI() {
                const bulkBar = document.getElementById('inventoryBulkActions');
                const selectedCountEl = document.getElementById('inventorySelectedCount');
                const bulkTypeSelect = document.getElementById('inventoryBulkTypeSelect');
                const bulkTypeApplyBtn = document.getElementById('inventoryBulkTypeApplyBtn');
                const count = this.selectedInventory.size;
                if (selectedCountEl) selectedCountEl.textContent = count;
                if (bulkBar) {
                    bulkBar.style.display = count > 0 ? 'flex' : 'none';
                }
                if (count === 0 && bulkTypeSelect) {
                    bulkTypeSelect.value = '';
                }
                if (bulkTypeApplyBtn) {
                    bulkTypeApplyBtn.disabled = count === 0 || !(bulkTypeSelect && bulkTypeSelect.value);
                }
            }

            syncInventorySortUI() {
                const sortKeyEl = document.getElementById('inventorySortKey');
                const sortDirBtn = document.getElementById('inventorySortDirBtn');
                if (sortKeyEl) sortKeyEl.value = this.inventorySort.key || 'name';
                if (sortDirBtn) sortDirBtn.textContent = this.inventorySort.dir === 'desc' ? this.translate('desc') : this.translate('asc');
            }

            setInventorySort(key, dir) {
                this.inventorySort = { key: key || 'name', dir: dir || 'asc' };
                localStorage.setItem('inkmanager_inventorySort', JSON.stringify(this.inventorySort));
                this.syncInventorySortUI();
                this.refreshInventory();
            }

            sortInventory(items) {
                // Use inventory module for sorting
                return Inventory.sortInventory(items, this.inventorySort || { key: 'name', dir: 'asc' });
            }
            
            // Invalidate inventory sort cache when data changes
            invalidateInventoryCache() {
                this.sortedInventoryCache = null;
                this.sortedInventoryCacheKey = null;
            }

            adjustInventoryQty(itemId, delta) {
                const item = Inventory.adjustQuantity(this.inventory, itemId, delta);
                if (!item) return;
                
                this.invalidateInventoryCache();
                this.safeSaveData();
                this.refreshInventory();
                this.refreshDashboard();
                this.showNotification(`${delta > 0 ? '➕' : '➖'} ${item.name}: ${item.qty}`);
            }

            updateInventoryItemField(itemId, field, value) {
                const item = Inventory.updateItemField(this.inventory, itemId, field, value);
                if (!item) return;

                this.invalidateInventoryCache();
                this.safeSaveData();
                this.refreshInventory();
                this.refreshDashboard();
                this.showNotification(`💾 ${item.name} updated`);
            }

            getFilteredInventory() {
                // Use inventory module for filtering
                return Inventory.filterInventory(this.inventory, this.inventoryFilter, this.inventorySearchQuery);
            }

            selectAllInventory() {
                const items = this.getFilteredInventory();
                items.forEach(item => this.selectedInventory.add(item.id));
                this.refreshInventory();
            }

            clearInventorySelection() {
                this.selectedInventory.clear();
                this.refreshInventory();
            }

            toggleInventorySelection(itemId, isSelected) {
                if (isSelected) {
                    this.selectedInventory.add(itemId);
                } else {
                    this.selectedInventory.delete(itemId);
                }
                this.updateBulkActionsUI();
            }

            bulkDeleteInventory() {
                const ids = Array.from(this.selectedInventory);
                if (ids.length === 0) {
                    this.showNotification('ℹ️ ' + this.translate('no_items_selected'));
                    return;
                }
                const confirmMsg = this.translate('confirm_delete_selected').replace('{count}', ids.length);
                if (!confirm(confirmMsg)) return;

                const deletedItems = this.inventory.filter(item => ids.includes(item.id));
                this.inventory = this.inventory.filter(item => !ids.includes(item.id));
                this.selectedInventory.clear();
                this.invalidateInventoryCache();
                this.safeSaveData();
                this.refreshInventory();
                this.refreshDashboard();
                this.scheduleInventoryUndo(deletedItems);
                this.showNotification(`🗑️ Deleted ${deletedItems.length} item(s)`);
            }

            bulkExportInventory() {
                const ids = Array.from(this.selectedInventory);
                if (ids.length === 0) {
                    this.showNotification('ℹ️ ' + this.translate('no_items_selected'));
                    return;
                }
                const items = this.inventory.filter(item => ids.includes(item.id));
                const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `inventory-selected-${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                this.showNotification(`📦 Exported ${items.length} item(s)`);
            }

            bulkChangeInventoryType(newType) {
                const ids = Array.from(this.selectedInventory);
                if (ids.length === 0) {
                    this.showNotification('ℹ️ ' + this.translate('no_items_selected'));
                    return;
                }
                if (!newType) {
                    this.showNotification('ℹ️ Please choose a type');
                    return;
                }

                let updated = 0;
                this.inventory.forEach(item => {
                    if (ids.includes(item.id)) {
                        item.type = newType;
                        item.updatedAt = Date.now();
                        updated += 1;
                    }
                });

                this.invalidateInventoryCache();
                this.safeSaveData();
                this.refreshInventory();
                this.refreshDashboard();

                const notification = updated === 1
                    ? `🔄 1 item updated`
                    : `🔄 ${updated} items updated`;
                this.showNotification(notification);
                const bulkTypeSelect = document.getElementById('inventoryBulkTypeSelect');
                if (bulkTypeSelect) bulkTypeSelect.value = '';
                this.updateBulkActionsUI();
            }

            scheduleInventoryUndo(deletedItems) {
                this.lastDeletedInventory = { items: deletedItems.map(item => ({ ...item })), timestamp: Date.now() };
                const alertsContainer = document.getElementById('inventoryAlerts');
                if (!alertsContainer) return;

                const count = deletedItems.length;
                const undoId = `undo-${Date.now()}`;
                alertsContainer.innerHTML = `
                    <div id="${undoId}" class="alert" style="display:flex;justify-content:space-between;align-items:center;gap:12px;background:rgba(255,255,255,0.06);padding:10px 12px;border-radius:8px;margin-top:10px;flex-wrap:wrap;">
                        <div>🗑️ ${count === 1 ? (deletedItems[0].name || 'Item') : count + ' items'} deleted</div>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            <button class="btn btn-outline" id="undoDeleteBtn">Undo</button>
                            <button class="btn btn-danger" id="dismissUndoBtn">Dismiss</button>
                        </div>
                    </div>
                `;

                const clearUndo = () => {
                    const el = document.getElementById(undoId);
                    if (el) el.remove();
                    if (this.undoDeleteTimer) clearTimeout(this.undoDeleteTimer);
                    this.undoDeleteTimer = null;
                    this.lastDeletedInventory = null;
                };

                const undo = () => {
                    if (this.lastDeletedInventory?.items?.length) {
                        this.lastDeletedInventory.items.forEach(item => {
                            this.inventory.push(item);
                        });
                        this.safeSaveData();
                        this.refreshInventory();
                        this.refreshDashboard();
                        this.showNotification('✅ Restore successful');
                    }
                    clearUndo();
                };

                const undoBtn = document.getElementById('undoDeleteBtn');
                const dismissBtn = document.getElementById('dismissUndoBtn');
                if (undoBtn) {
                    undoBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        undo();
                    });
                }
                if (dismissBtn) {
                    dismissBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        clearUndo();
                    });
                }

                this.undoDeleteTimer = setTimeout(() => {
                    clearUndo();
                }, 10000);
            }

            showSection(sectionId, options = {}) {
                const { updateHistory = true, replace = false, force = false } = options;
                if (!sectionId) return;

                const sectionEl = document.getElementById(sectionId);
                if (!sectionEl) return;

                if (this.currentSection === sectionId && !force) {
                    // If already on this section, scroll to top for better UX
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                this.currentSection = sectionId;

                // Cache section and nav-link elements on first access
                if (!this.domCache.sections) {
                    this.domCache.sections = document.querySelectorAll('.section');
                    this.domCache.navLinks = document.querySelectorAll('.nav-link');
                }

                this.domCache.sections.forEach(s => s.classList.remove('active'));
                sectionEl.classList.add('active');

                this.domCache.navLinks.forEach(b => b.classList.remove('active'));
                const navLink = document.querySelector(`[data-section="${sectionId}"]`);
                if (navLink) {
                    navLink.classList.add('active');
                    navLink.setAttribute('aria-current', 'page');
                }
                // Only update aria-current attributes where needed
                this.domCache.navLinks.forEach(link => {
                    if (link !== navLink && link.getAttribute('aria-current') === 'page') {
                        link.removeAttribute('aria-current');
                    }
                });

                // Update mobile bottom nav active state
                document.querySelectorAll('.mobile-nav-item').forEach(item => {
                    if (item.dataset.section === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                if (updateHistory && typeof history !== 'undefined' && history.pushState) {
                    const url = `#${sectionId}`;
                    if (replace) {
                        history.replaceState({ section: sectionId }, '', url);
                    } else if (history.state?.section !== sectionId) {
                        history.pushState({ section: sectionId }, '', url);
                    }
                }

                this.refreshSection(sectionId);

                const appContainer = document.querySelector('.app-container');
                if (appContainer) {
                    if (typeof appContainer.scrollTo === 'function') {
                        appContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        appContainer.scrollTop = 0;
                    }
                }
            }

            // Navigate to dashboard and close mobile sidebar if open
            goToDashboard() {
                // Close mobile sidebar if open
                if (window.sidebarDrawer && window.innerWidth <= 1024) {
                    window.sidebarDrawer.close();
                }
                // Navigate to dashboard
                this.showSection('dashboard');
            }

            refreshSection(sectionId) {
                switch(sectionId) {
                    case 'dashboard': this.refreshDashboard(); break;
                    case 'clients': this.refreshClients(); break;
                    case 'sessions': this.refreshSessions(); break;
                    case 'inventory': this.refreshInventory(); break;
                    case 'calendar': this.refreshCalendar(); break;
                    case 'reports': this.refreshReports(); break;
                    case 'settings': this.refreshSettings(); break;
                }
            }

            refreshAll() {
                this.refreshDashboard();
                this.refreshClients();
                this.refreshSessions();
                this.refreshInventory();
                this.refreshCalendar();
                this.refreshReports();
                this.refreshSettings();
            }

            updateMaterialMaxQuantity(itemId) {
                const materialQty = document.getElementById('materialQty');
                if (!itemId) {
                    materialQty.max = '';
                    return;
                }

                const item = this.inventory.find(i => i.id === itemId);
                if (item) {
                    materialQty.max = item.qty;
                    materialQty.placeholder = this.translate('max_available', { count: item.qty }) || `Max: ${item.qty}`;
                }
            }

            addMaterialToSession() {
                const itemId = document.getElementById('materialItem').value;
                const quantity = parseInt(document.getElementById('materialQty').value) || 1;

                if (!itemId) {
                    this.showNotification('Please select an item');
                    return;
                }

                const item = this.inventory.find(i => i.id === itemId);
                if (!item) {
                    this.showNotification('Item not found');
                    return;
                }

                if (quantity > item.qty) {
                    this.showNotification(`Only ${item.qty} available in stock`);
                    return;
                }

                const existingIndex = this.currentSessionMaterials.findIndex(m => m.itemId === itemId);
                if (existingIndex > -1) {
                    this.currentSessionMaterials[existingIndex].quantity += quantity;
                } else {
                    this.currentSessionMaterials.push({
                        itemId: itemId,
                        itemName: item.name,
                        quantity: quantity,
                        type: item.type
                    });
                }

                this.refreshMaterialsList();
                
                document.getElementById('materialItem').value = '';
                document.getElementById('materialQty').value = '1';
                document.getElementById('materialQty').max = '';
                document.getElementById('materialQty').placeholder = this.translate('quantity') || 'Qty';

                this.showNotification(`✅ ${item.name} added to materials`);
            }

            removeMaterial(index) {
                this.currentSessionMaterials.splice(index, 1);
                this.refreshMaterialsList();
            }

            refreshMaterialsList() {
                const container = document.getElementById('materialsList');
                
                if (this.currentSessionMaterials.length === 0) {
                    container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">No materials added yet</div>';
                    return;
                }

                container.innerHTML = this.currentSessionMaterials.map((material, index) => `
                    <div class="material-item">
                        <div>${material.itemName}</div>
                        <div>${this.translate('quantity') || 'Qty'}: ${material.quantity}</div>
                        <button type="button" class="remove-material" onclick="app.removeMaterial(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }

            deductMaterialsFromInventory() {
                this.currentSessionMaterials.forEach(material => {
                    const itemIndex = this.inventory.findIndex(i => i.id === material.itemId);
                    if (itemIndex > -1) {
                        this.inventory[itemIndex].qty -= material.quantity;
                        if (this.inventory[itemIndex].qty < 0) {
                            this.inventory[itemIndex].qty = 0;
                        }
                    }
                });
                this.invalidateInventoryCache();
                this.saveData();
            }

            openClientModal(clientId = null) {
                document.getElementById('clientForm').reset();
                
                if (clientId) {
                    const client = this.clients.find(c => c.id === clientId);
                    if (client) {
                        document.getElementById('clientName').value = client.name;
                        document.getElementById('clientPhone').value = client.phone || '';
                        document.getElementById('clientEmail').value = client.email || '';
                        document.getElementById('clientBirthDate').value = client.birthDate || '';
                        document.getElementById('clientSkinType').value = client.skinType || '';
                        document.getElementById('clientEmergencyContact').value = client.emergencyContact || '';
                        document.getElementById('clientNotes').value = client.notes || '';
                        
                        document.getElementById('clientModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> ' + (this.translate('edit_client') || 'Edit Client');
                        document.getElementById('saveClientBtn').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('update_client') || 'Update Client');
                        this.editingClientId = clientId;
                    }
                } else {
                    document.getElementById('clientModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> ' + (this.translate('create_new_client') || 'Create New Client');
                    document.getElementById('saveClientBtn').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('save_client') || 'Save Client');
                    this.editingClientId = null;
                }
                
                document.getElementById('clientModal').style.display = 'block';
                setTimeout(() => document.getElementById('clientName').focus(), 300);
            }

            closeClientModal() {
                document.getElementById('clientModal').style.display = 'none';
                this.editingClientId = null;
            }

            saveClient() {
                const name = document.getElementById('clientName').value.trim();
                const phone = document.getElementById('clientPhone').value.trim();
                const email = document.getElementById('clientEmail').value.trim();
                const birthDate = document.getElementById('clientBirthDate').value;
                const skinType = document.getElementById('clientSkinType').value;
                const emergencyContact = document.getElementById('clientEmergencyContact').value.trim();
                const notes = document.getElementById('clientNotes').value.trim();

                if (!name) {
                    this.showNotification('Please enter client name');
                    document.getElementById('clientName').focus();
                    return;
                }

                if (this.editingClientId) {
                    const clientIndex = this.clients.findIndex(c => c.id === this.editingClientId);
                    if (clientIndex !== -1) {
                        this.clients[clientIndex] = {
                            ...this.clients[clientIndex],
                            name: name,
                            phone: phone,
                            email: email,
                            birthDate: birthDate,
                            skinType: skinType,
                            emergencyContact: emergencyContact,
                            notes: notes,
                            updatedAt: new Date().toISOString()
                        };
                        
                        this.safeSaveData();
                        this.closeClientModal();
                        this.refreshClients();
                        this.refreshDashboard();
                        this.showNotification('✅ Client updated successfully!');
                    }
                } else {
                    const client = {
                        id: 'client-' + Date.now(),
                        name: name,
                        phone: phone,
                        email: email,
                        birthDate: birthDate,
                        skinType: skinType,
                        emergencyContact: emergencyContact,
                        notes: notes,
                        createdAt: new Date().toISOString(),
                        lastVisit: null,
                        totalSessions: 0,
                        totalSpent: 0
                    };
                    
                    this.clients.push(client);
                    this.safeSaveData();
                    this.closeClientModal();
                    this.refreshClients();
                    this.refreshDashboard();
                    this.showNotification('✅ Client profile created successfully!');
                }
            }

            refreshClients() {
                const container = document.getElementById('clientsList');
                
                if (this.clients.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3 data-i18n="no_clients_yet">No Clients Yet</h3>
                            <p data-i18n="build_client_database">Start building your professional client database</p>
                            <button class="btn btn-primary" id="addFirstClient">
                                <i class="fas fa-plus"></i> <span data-i18n="add_first_client">Add Your First Client</span>
                            </button>
                        </div>
                    `;
                    document.getElementById('addFirstClient').addEventListener('click', () => this.openClientModal());
                    
                    // Apply translations to dynamically created elements
                    this.applyTranslations();
                    return;
                }

                // Pre-compute session statistics for all clients - O(n) instead of O(n*m)
                const clientStats = {};
                this.sessions.forEach(session => {
                    if (!clientStats[session.clientId]) {
                        clientStats[session.clientId] = {
                            count: 0,
                            totalSpent: 0,
                            lastSessionDate: 0
                        };
                    }
                    clientStats[session.clientId].count++;
                    clientStats[session.clientId].totalSpent += (session.price || 0);
                    const sessionDate = new Date(session.dateTime).getTime();
                    if (sessionDate > clientStats[session.clientId].lastSessionDate) {
                        clientStats[session.clientId].lastSessionDate = sessionDate;
                    }
                });

                container.innerHTML = this.clients.map(client => {
                    const stats = clientStats[client.id] || { count: 0, totalSpent: 0, lastSessionDate: 0 };
                    const lastSession = stats.lastSessionDate > 0 ? new Date(stats.lastSessionDate) : null;
                    
                    return `
                        <div class="client-item">
                            <div class="item-content" onclick="app.showSection('clients')">
                                <div class="item-title">
                                    <i class="fas fa-user"></i> ${client.name}
                                    ${stats.count > 0 ? '<span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7em; margin-left: 10px;">' + this.translate('regular_client') + '</span>' : ''}
                                </div>
                                <div class="item-meta">
                                    ${client.phone ? `<div><i class="fas fa-phone"></i> ${client.phone}</div>` : ''}
                                    ${client.email ? `<div><i class="fas fa-envelope"></i> ${client.email}</div>` : ''}
                                    ${client.birthDate ? `<div><i class="fas fa-birthday-cake"></i> ${new Date(client.birthDate).toLocaleDateString()}</div>` : ''}
                                    ${client.skinType ? `<div><i class="fas fa-hand-sparkles"></i> ${client.skinType} skin</div>` : ''}
                                    ${client.emergencyContact ? `<div><i class="fas fa-exclamation-triangle"></i> ${client.emergencyContact}</div>` : ''}
                                    <div><i class="fas fa-calendar"></i> ${stats.count} ${this.translate('total_sessions')} | ${this.formatCurrency(stats.totalSpent)}</div>
                                    ${lastSession ? `<div><i class="fas fa-clock"></i> ${this.translate('last_visit')}: ${lastSession.toLocaleDateString()}</div>` : ''}
                                    ${client.notes ? `<div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 6px;"><i class="fas fa-sticky-note"></i> ${client.notes}</div>` : ''}
                                    ${client.updatedAt ? `<div style="margin-top: 4px; font-size: 0.8em; opacity: 0.7;">${this.translate('last_updated')}: ${new Date(client.updatedAt).toLocaleDateString()}</div>` : ''}
                                </div>
                            </div>
                            <div class="item-actions">
                                <button class="action-btn btn-primary" onclick="event.stopPropagation(); app.openClientModal('${client.id}')" title="Edit Client">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn btn-danger" onclick="event.stopPropagation(); app.deleteClient('${client.id}')" title="Delete Client">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                // Apply translations to dynamically created elements
                this.applyTranslations();
            }

            searchClients(query) {
                const container = document.getElementById('clientsList');
                const filteredClients = this.clients.filter(client => 
                    client.name.toLowerCase().includes(query.toLowerCase()) ||
                    (client.phone && client.phone.includes(query)) ||
                    (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
                );

                if (filteredClients.length === 0) {
                    container.innerHTML = '<div class="empty-state">No clients found matching your search</div>';
                    return;
                }

                container.innerHTML = filteredClients.map(client => `
                    <div class="client-item" onclick="app.openClientModal('${client.id}')">
                        <div class="item-content">
                            <div class="item-title">${client.name}</div>
                            <div class="item-meta">
                                ${client.phone ? `<i class="fas fa-phone"></i> ${client.phone}<br>` : ''}
                                ${client.email ? `<i class="fas fa-envelope"></i> ${client.email}` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            deleteClient(clientId) {
                if (confirm('Are you sure you want to delete this client and all their sessions?')) {
                    this.clients = this.clients.filter(c => c.id !== clientId);
                    this.sessions = this.sessions.filter(s => s.clientId !== clientId);
                    this.safeSaveData();
                    this.refreshAll();
                    this.showNotification('🗑️ Client and associated sessions deleted');
                }
            }

            openSessionModal(sessionId = null, selectedDate = null) {
                if (this.clients.length === 0) {
                    this.showNotification('Please add clients first!');
                    this.showSection('clients');
                    return;
                }

                this.currentSessionMaterials = [];
                
                const clientSelect = document.getElementById('sessionClient');
                const clientOptions = ['<option value="">' + (this.translate('select_client') || 'Select a client...') + '</option>'];
                this.clients.forEach(client => {
                    clientOptions.push(`<option value="${client.id}">${client.name}</option>`);
                });
                clientSelect.innerHTML = clientOptions.join('');

                const materialSelect = document.getElementById('materialItem');
                const materialOptions = ['<option value="">' + (this.translate('select_item') || 'Select item...') + '</option>'];
                this.inventory.forEach(item => {
                    if (item.qty > 0) {
                        materialOptions.push(`<option value="${item.id}">${item.name} (${item.qty} in stock)</option>`);
                    }
                });
                materialSelect.innerHTML = materialOptions.join('');

                if (sessionId) {
                    const session = this.sessions.find(s => s.id === sessionId);
                    if (session) {
                        document.getElementById('sessionClient').value = session.clientId;
                        document.getElementById('sessionTitle').value = session.title;
                        document.getElementById('sessionDateTime').value = this.formatDateTime(new Date(session.dateTime));
                        document.getElementById('sessionDuration').value = session.duration || 2;
                        document.getElementById('sessionPrice').value = session.price || '';
                        document.getElementById('sessionNotes').value = session.notes || '';
                        
                        if (session.materialsUsed && session.materialsUsed.length > 0) {
                            this.currentSessionMaterials = [...session.materialsUsed];
                            this.refreshMaterialsList();
                        }
                        
                        document.querySelector('#sessionModal .card-title').innerHTML = '<i class="fas fa-edit"></i> ' + (this.translate('edit_session') || 'Edit Session');
                        document.querySelector('#sessionModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('update_session') || 'Update Session');
                        this.editingSessionId = sessionId;
                    }
                } else {
                    document.getElementById('sessionForm').reset();
                    
                    if (selectedDate) {
                        document.getElementById('sessionDateTime').value = this.formatDateTime(selectedDate);
                    } else {
                        const nextHour = new Date();
                        nextHour.setHours(nextHour.getHours() + 1);
                        nextHour.setMinutes(0);
                        document.getElementById('sessionDateTime').value = this.formatDateTime(nextHour);
                    }
                    
                    document.querySelector('#sessionModal .card-title').innerHTML = '<i class="fas fa-calendar-plus"></i> ' + (this.translate('schedule_session') || 'Schedule Session');
                    document.querySelector('#sessionModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('save_session') || 'Save Session');
                    this.editingSessionId = null;
                }

                document.getElementById('sessionModal').style.display = 'block';
            }

            closeSessionModal() {
                document.getElementById('sessionModal').style.display = 'none';
                this.editingSessionId = null;
                this.currentSessionMaterials = [];
                this.refreshMaterialsList();
            }

            saveSession() {
                const clientId = document.getElementById('sessionClient').value;
                const title = document.getElementById('sessionTitle').value.trim();
                const dateTime = document.getElementById('sessionDateTime').value;
                const duration = parseFloat(document.getElementById('sessionDuration').value) || 2;
                const price = parseFloat(document.getElementById('sessionPrice').value) || 0;
                const notes = document.getElementById('sessionNotes').value.trim();

                if (!clientId || !title || !dateTime) {
                    this.showNotification('Please fill in all required fields');
                    return;
                }

                if (this.editingSessionId) {
                    const sessionIndex = this.sessions.findIndex(s => s.id === this.editingSessionId);
                    if (sessionIndex !== -1) {
                        const oldMaterials = [...this.sessions[sessionIndex].materialsUsed];
                        
                        oldMaterials.forEach(material => {
                            const itemIndex = this.inventory.findIndex(i => i.id === material.itemId);
                            if (itemIndex > -1) {
                                this.inventory[itemIndex].qty += material.quantity;
                            }
                        });
                        
                        this.sessions[sessionIndex] = {
                            ...this.sessions[sessionIndex],
                            clientId: clientId,
                            title: title,
                            dateTime: dateTime,
                            duration: duration,
                            price: price,
                            notes: notes,
                            materialsUsed: [...this.currentSessionMaterials],
                            updatedAt: new Date().toISOString()
                        };
                        
                        this.deductMaterialsFromInventory();
                        
                        this.safeSaveData();
                        this.closeSessionModal();
                        this.refreshAll();
                        this.showNotification('✅ Session updated successfully!');
                    }
                } else {
                    const session = {
                        id: 'session-' + Date.now(),
                        clientId: clientId,
                        title: title,
                        dateTime: dateTime,
                        duration: duration,
                        price: price,
                        notes: notes,
                        materialsUsed: [...this.currentSessionMaterials],
                        createdAt: new Date().toISOString(),
                        status: 'scheduled'
                    };

                    this.sessions.push(session);
                    this.deductMaterialsFromInventory();
                    this.safeSaveData();
                    this.closeSessionModal();
                    this.refreshAll();
                    this.showNotification('✅ Session scheduled successfully!');
                }
            }

            refreshSessions() {
                const container = document.getElementById('sessionsList');
                const allSessions = this.sessions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

                if (allSessions.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-calendar-plus"></i>
                            <h3 data-i18n="no_sessions_scheduled">No Sessions Scheduled</h3>
                            <p data-i18n="schedule_first_session">Schedule your first professional tattoo session</p>
                            <button class="btn btn-primary" id="addFirstSession">
                                <i class="fas fa-plus"></i> <span data-i18n="create_first_session">Create First Session</span>
                            </button>
                        </div>
                    `;
                    document.getElementById('addFirstSession').addEventListener('click', () => this.openSessionModal());
                    
                    // Apply translations to dynamically created elements
                    this.applyTranslations();
                    return;
                }

                container.innerHTML = allSessions.map(session => {
                    const sessionDate = new Date(session.dateTime);
                    const isPast = sessionDate < new Date();
                    const isToday = sessionDate.toDateString() === new Date().toDateString();
                    const statusClass = isPast ? 'completed' : (isToday ? 'urgent' : 'upcoming');
                    const statusText = isPast ? this.translate('session_completed') : (isToday ? this.translate('session_today') : this.translate('session_upcoming'));
                    const statusColor = isPast ? 'var(--success)' : (isToday ? 'var(--warning)' : 'var(--primary)');
                    
                    const materialsText = session.materialsUsed && session.materialsUsed.length > 0 
                        ? `<br><strong>${this.translate('materials')}:</strong> ${session.materialsUsed.map(m => `${m.itemName} (${m.quantity})`).join(', ')}`
                        : '';
                    
                    return `
                        <div class="session-item">
                            <div class="item-content" onclick="app.showSection('sessions')">
                                <div class="item-title">${session.title}</div>
                                <div class="item-meta">
                                    <strong>${this.translate('client')}:</strong> ${this.getClientName(session.clientId)}<br>
                                    <strong>${this.translate('date_time')}:</strong> ${sessionDate.toLocaleString()}<br>
                                    <strong>${this.translate('duration_hours')}:</strong> ${session.duration} hours<br>
                                    <strong>${this.translate('status')}:</strong> <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span><br>
                                    ${session.price ? `<strong>${this.translate('price')}:</strong> ${this.formatCurrency(session.price)}` : ''}
                                    ${materialsText}
                                    ${session.notes ? `<br><strong>${this.translate('session_notes')}:</strong> ${session.notes}` : ''}
                                    ${session.updatedAt ? `<br><small style='opacity: 0.7;'>${this.translate('last_updated')}: ${new Date(session.updatedAt).toLocaleDateString()}</small>` : ''}
                                </div>
                            </div>
                            <div class="item-actions">
                                <button class="action-btn btn-primary" onclick="event.stopPropagation(); app.openSessionModal('${session.id}')" title="Edit Session">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn btn-danger" onclick="event.stopPropagation(); app.deleteSession('${session.id}')" title="Delete Session">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                // Apply translations to dynamically created elements
                this.applyTranslations();
            }

            deleteSession(sessionId) {
                if (confirm('Are you sure you want to delete this session?')) {
                    const session = this.sessions.find(s => s.id === sessionId);
                    if (session && session.materialsUsed) {
                        session.materialsUsed.forEach(material => {
                            const itemIndex = this.inventory.findIndex(i => i.id === material.itemId);
                            if (itemIndex > -1) {
                                this.inventory[itemIndex].qty += material.quantity;
                            }
                        });
                    }
                    
                    this.sessions = this.sessions.filter(s => s.id !== sessionId);
                    this.safeSaveData();
                    this.refreshAll();
                    this.showNotification('🗑️ Session deleted (materials restored to inventory)');
                }
            }

            openInventoryModal(itemId = null) {
                document.getElementById('inventoryForm').reset();
                
                if (itemId) {
                    const item = this.inventory.find(i => i.id === itemId);
                    if (item) {
                        document.getElementById('itemName').value = item.name;
                        document.getElementById('itemType').value = item.type;
                        document.getElementById('itemQty').value = item.qty;
                        document.getElementById('itemAlert').value = item.alert || 5;
                        document.getElementById('itemPrice').value = item.price || '';
                        document.getElementById('itemNotes').value = item.notes || '';
                        
                        document.getElementById('inventoryModalTitle').innerHTML = '<i class="fas fa-edit"></i> ' + (this.translate('edit_inventory_item') || 'Edit Inventory Item');
                        document.getElementById('saveInventoryBtn').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('update_item') || 'Update Item');
                        this.editingItemId = itemId;
                    }
                } else {
                    document.getElementById('inventoryModalTitle').innerHTML = '<i class="fas fa-box"></i> ' + (this.translate('new_inventory_item') || 'New Inventory Item');
                    document.getElementById('saveInventoryBtn').innerHTML = '<i class="fas fa-save"></i> ' + (this.translate('save_item') || 'Save Item');
                    this.editingItemId = null;
                }
                
                document.getElementById('inventoryModal').style.display = 'block';
                setTimeout(() => document.getElementById('itemName').focus(), 300);
            }

            closeInventoryModal() {
                document.getElementById('inventoryModal').style.display = 'none';
                this.editingItemId = null;
            }

            saveInventoryItem() {
                const name = document.getElementById('itemName').value.trim();
                const type = document.getElementById('itemType').value;
                const qty = parseInt(document.getElementById('itemQty').value) || 0;
                const alert = parseInt(document.getElementById('itemAlert').value) || 5;
                const price = parseFloat(document.getElementById('itemPrice').value) || 0;
                const notes = document.getElementById('itemNotes').value.trim();

                const itemData = { name, type, qty, alert, price, notes };
                
                // Validate item data
                const validation = Inventory.validateItemData(itemData);
                if (!validation.valid) {
                    this.showNotification('❌ ' + validation.errors.join(', '));
                    return;
                }

                if (this.editingItemId) {
                    const item = Inventory.updateItem(this.inventory, this.editingItemId, itemData);
                    if (item) {
                        this.invalidateInventoryCache();
                        this.safeSaveData();
                        this.closeInventoryModal();
                        this.refreshInventory();
                        this.refreshDashboard();
                        this.showNotification('✅ Item updated successfully!');
                    }
                } else {
                    const item = Inventory.createItem(itemData);
                    this.inventory.push(item);
                    this.invalidateInventoryCache();
                    this.safeSaveData();
                    this.closeInventoryModal();
                    this.refreshInventory();
                    this.refreshDashboard();
                    this.showNotification('✅ Inventory item added!');
                }
            }

            refreshInventory() {
                const container = document.getElementById('inventoryList');
                const alertsContainer = document.getElementById('inventoryAlerts');
                this.updateBulkActionsUI();
                
                if (this.inventory.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3 data-i18n="no_inventory_items">No Inventory Items</h3>
                            <p data-i18n="track_supplies">Track your needles, ink, and professional supplies</p>
                            <button class="btn btn-primary" id="addFirstItem">
                                <i class="fas fa-plus"></i> <span data-i18n="add_first_item">Add First Item</span>
                            </button>
                        </div>
                    `;
                    document.getElementById('addFirstItem').addEventListener('click', () => this.openInventoryModal());
                    
                    // Apply translations to dynamically created elements
                    this.applyTranslations();
                    return;
                }

                const filtered = this.getFilteredInventory();
                const itemsToRender = this.sortInventory(filtered);

                if (itemsToRender.length === 0) {
                    container.innerHTML = `<div class="empty-state">${this.translate('no_items_match_filters')}</div>`;
                    alertsContainer.innerHTML = '';
                    this.updateBulkActionsUI();
                    return;
                }

                container.innerHTML = itemsToRender.map(item => {
                    const isLowStock = Inventory.isLowStock(item);
                    const stockStyle = isLowStock ? 'style="color: var(--warning); font-weight: 600;"' : '';
                    const icon = Inventory.getTypeIcon(item.type);
                    
                    return `
                        <div class="inventory-item">
                            <div class="item-select" style="padding-right: 12px; display:flex; align-items:flex-start;">
                                <input type="checkbox" ${this.selectedInventory.has(item.id) ? 'checked' : ''} onclick="event.stopPropagation(); app.toggleInventorySelection('${item.id}', this.checked)">
                            </div>
                            <div class="item-content" onclick="app.showSection('inventory')">
                                <div class="item-title">
                                    ${icon} ${item.name}
                                    ${isLowStock ? '<span style="background: var(--warning); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7em; margin-left: 10px;">' + (this.translate('low_stock') || 'Low Stock') + '</span>' : ''}
                                </div>
                                <div class="item-meta">
                                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                        <span ${stockStyle}>📦 ${item.qty} in stock | ⚠️ ${this.translate('low_stock_alert') || 'Alert at'}: ${item.alert}</span>
                                        <span style="display:inline-flex;gap:6px;">
                                            <button class="btn btn-outline" onclick="event.stopPropagation(); app.adjustInventoryQty('${item.id}', -1)" title="Decrease">−</button>
                                            <button class="btn btn-outline" onclick="event.stopPropagation(); app.adjustInventoryQty('${item.id}', 1)" title="Increase">+</button>
                                        </span>
                                    </div>
                                    <div>🏷️ ${item.type}</div>
                                    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;">
                                        <label style="display:flex; align-items:center; gap:6px;">
                                            <span>⚠️</span>
                                            <input type="number" min="0" step="1" value="${item.alert ?? 0}" style="width:90px;" onclick="event.stopPropagation();" onblur="event.stopPropagation(); app.updateInventoryItemField('${item.id}', 'alert', this.value)">
                                        </label>
                                        <label style="display:flex; align-items:center; gap:6px;">
                                            <span>💲</span>
                                            <input type="number" min="0" step="0.01" value="${item.price ?? ''}" style="width:110px;" onclick="event.stopPropagation();" onblur="event.stopPropagation(); app.updateInventoryItemField('${item.id}', 'price', this.value)">
                                        </label>
                                        ${item.price ? `<span style="opacity:0.8;">${this.formatCurrency(item.price)} ${this.translate('per_unit')}</span>` : ''}
                                    </div>
                                    ${item.notes ? `<div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 6px;">📝 ${item.notes}</div>` : ''}
                                    ${item.updatedAt ? `<div style="margin-top: 4px; font-size: 0.8em; opacity: 0.7;">${this.translate('last_updated')}: ${new Date(item.updatedAt).toLocaleDateString()}</div>` : ''}
                                </div>
                            </div>
                            <div class="item-actions">
                                <button class="action-btn btn-primary" onclick="event.stopPropagation(); app.openInventoryModal('${item.id}')" title="Edit Item">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn btn-danger" onclick="event.stopPropagation(); app.deleteInventoryItem('${item.id}')" title="Delete Item">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                const lowStock = Inventory.getLowStockItems(this.inventory);
                const isMobile = window.innerWidth <= 768;
                
                if (lowStock.length > 0) {
                    alertsContainer.innerHTML = `
                        <div class="card" style="border-left: 5px solid var(--warning); background: linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(255,64,129,0.1) 100%);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                                <div>
                                    <h4 style="color: var(--warning); margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
                                        <i class="fas fa-exclamation-triangle"></i> ${this.translate('low_stock_alerts') || 'Low Stock Alerts'}
                                    </h4>
                                    <p style="margin: 0; color: rgba(255,255,255,0.8);">
                                        ${lowStock.map(item => item.name).join(', ')}
                                    </p>
                                </div>
                                <button class="btn btn-warning" onclick="app.showLowStockItems()" style="white-space: nowrap;">
                                    <i class="fas fa-boxes"></i> <span data-i18n="view_low_stock">${this.translate('view_low_stock') || 'View Low Stock Items'}</span>
                                </button>
                            </div>
                        </div>
                        ${isMobile ? `
                        <button class="btn btn-primary" onclick="app.scrollToInventoryControls()" style="width: 100%; margin-top: 16px;">
                            <i class="fas fa-sliders-h"></i> <span data-i18n="manage_inventory">${this.translate('manage_inventory') || 'Manage Inventory'}</span>
                        </button>
                        ` : ''}
                    `;
                } else if (isMobile && this.inventory.length > 0) {
                    // Show manage button even when no low stock alerts, on mobile only
                    alertsContainer.innerHTML = `
                        <button class="btn btn-primary" onclick="app.scrollToInventoryControls()" style="width: 100%; margin-top: 16px;">
                            <i class="fas fa-sliders-h"></i> <span data-i18n="manage_inventory">${this.translate('manage_inventory') || 'Manage Inventory'}</span>
                        </button>
                    `;
                } else {
                    alertsContainer.innerHTML = '';
                }
                
                // Apply translations to dynamically created elements
                this.applyTranslations();
            }

            searchInventory(query) {
                this.inventorySearchQuery = query || '';
                this.refreshInventory();
            }

            showLowStockItems() {
                // First, navigate to inventory section
                this.showSection('inventory');
                
                // Set filter to show low stock items
                this.inventoryFilter = 'low-stock';
                
                // Clear any search query
                this.inventorySearchQuery = '';
                const inventorySearch = document.getElementById('inventorySearch');
                if (inventorySearch) inventorySearch.value = '';
                
                // Update filter tabs/dropdown UI
                this.updateInventoryTabsUI();
                
                // Refresh to show only low stock items
                this.refreshInventory();
                
                // Show a notification
                this.showNotification('📦 Showing low stock items');
            }

            scrollToInventoryControls() {
                // Scroll to the sort/filter controls at the top of the inventory section
                const inventorySortBar = document.getElementById('inventorySortBar');
                if (inventorySortBar) {
                    inventorySortBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            deleteInventoryItem(itemId) {
                if (!confirm('Are you sure you want to delete this inventory item?')) return;

                const deleted = this.inventory.find(i => i.id === itemId);
                this.selectedInventory.delete(itemId);
                this.inventory = this.inventory.filter(i => i.id !== itemId);
                this.invalidateInventoryCache();
                this.safeSaveData();
                this.refreshInventory();
                this.refreshDashboard();

                this.scheduleInventoryUndo([deleted]);
                this.showNotification('🗑️ Item deleted');
            }

            refreshDashboard() {
                // Use Analytics module for dashboard statistics
                const stats = Analytics.getDashboardStats({
                    clients: this.clients,
                    sessions: this.sessions,
                    inventory: this.inventory
                });
                
                document.getElementById('totalClients').textContent = stats.totalClients;
                document.getElementById('upcomingSessions').textContent = stats.upcomingSessions;
                document.getElementById('monthlyRevenue').textContent = this.formatCurrency(stats.monthlyRevenue);
                document.getElementById('lowStockItems').textContent = stats.lowStockItems;

                const todaysSessions = stats.todaysSessions;
                const todayContainer = document.getElementById('todaysSessions');
                
                if (todaysSessions.length === 0) {
                    todayContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-calendar-times"></i>
                            <h3 data-i18n="no_sessions_today">No Sessions Today</h3>
                            <p data-i18n="schedule_clear">Your schedule is clear for today</p>
                            <button class="btn btn-primary" onclick="app.showSection('sessions')">
                                <i class="fas fa-plus"></i> <span data-i18n="schedule_session">Schedule a Session</span>
                            </button>
                        </div>
                    `;
                } else {
                    todayContainer.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <h4 style="color: var(--primary); margin-bottom: 12px;">
                                <i class="fas fa-list"></i> ${todaysSessions.length} ${this.translate('session') || 'Session'}${todaysSessions.length > 1 ? 's' : ''} ${this.translate('today') || 'Today'}
                            </h4>
                        </div>
                        ${todaysSessions.map(session => {
                            const sessionTime = new Date(session.dateTime);
                            const now = new Date();
                            const timeDiff = sessionTime - now;
                            const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
                            const isUrgent = hoursUntil <= 2 && hoursUntil >= 0;
                            const isCompleted = sessionTime < now;
                            
                            let statusClass = '';
                            let statusIcon = '🕒';
                            let statusText = `${this.translate('in')} ${hoursUntil}${this.translate('hours_short')}`;
                            
                            if (isUrgent) {
                                statusClass = 'urgent';
                                statusIcon = '⚠️';
                                statusText = this.translate('starting_soon');
                            } else if (isCompleted) {
                                statusClass = 'completed';
                                statusIcon = '✅';
                                statusText = this.translate('session_completed');
                            } else if (hoursUntil < 0) {
                                statusClass = 'completed';
                                statusIcon = '✅';
                                statusText = this.translate('session_completed') || 'Completed';
                            }
                            
                            return `
                                <div class="todays-session-item ${statusClass}" onclick="app.showSection('sessions')">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; font-size: 1.1em; color: var(--light); margin-bottom: 6px;">
                                                ${session.title}
                                            </div>
                                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em; line-height: 1.4;">
                                                <div>👤 ${this.getClientName(session.clientId)}</div>
                                                <div>🕐 ${sessionTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                <div>${session.price ? `💰 ${this.formatCurrency(session.price)}` : ''}</div>
                                                <div style="color: ${isUrgent ? 'var(--warning)' : 'var(--success)'}; font-weight: 600; margin-top: 4px;">
                                                    ${statusIcon} ${statusText}
                                                </div>
                                            </div>
                                        </div>
                                        <div style="margin-left: 10px;">
                                            <button class="action-btn btn-danger" onclick="event.stopPropagation(); app.deleteSession('${session.id}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    `;
                }

                const insightsContainer = document.getElementById('dashboardInsights');
                if (this.sessions.length > 0) {
                    const totalRevenue = this.sessions.reduce((sum, s) => sum + (s.price || 0), 0);
                    const avgSessionPrice = totalRevenue / this.sessions.length;
                    const returningClients = this.clients.filter(client => 
                        this.sessions.filter(s => s.clientId === client.id).length > 1
                    ).length;
                    
                    insightsContainer.innerHTML = `
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                            <div style="background: rgba(0,188,212,0.1); padding: 18px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 1.6em; color: var(--primary); font-weight: bold;">${this.sessions.length}</div>
                                <div style="color: rgba(255,255,255,0.8);">${this.translate('total_sessions') || 'Total Sessions'}</div>
                            </div>
                            <div style="background: rgba(76,175,80,0.1); padding: 18px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 1.6em; color: var(--success); font-weight: bold;">${this.formatCurrency(avgSessionPrice)}</div>
                                <div style="color: rgba(255,255,255,0.8);">${this.translate('avg_session_price') || 'Avg Session Price'}</div>
                            </div>
                            <div style="background: rgba(255,64,129,0.1); padding: 18px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 1.6em; color: var(--secondary); font-weight: bold;">${returningClients}</div>
                                <div style="color: rgba(255,255,255,0.8);">${this.translate('returning_clients') || 'Returning Clients'}</div>
                            </div>
                        </div>
                    `;
                }
                
                // Apply translations to dynamically created elements
                this.applyTranslations();
            }

            refreshCalendar() {
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                
                document.getElementById('calendarMonth').textContent = 
                    `${monthNames[this.currentMonth]} ${this.currentYear}`;

                const firstDay = new Date(this.currentYear, this.currentMonth, 1);
                const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDay = firstDay.getDay();

                const calendarGrid = document.getElementById('calendarGrid');
                calendarGrid.innerHTML = '';

                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                dayNames.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day header';
                    dayElement.textContent = day;
                    calendarGrid.appendChild(dayElement);
                });

                for (let i = 0; i < startingDay; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'calendar-day';
                    calendarGrid.appendChild(emptyDay);
                }

                const today = new Date();
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    
                    const currentDate = new Date(this.currentYear, this.currentMonth, day);
                    const isToday = currentDate.toDateString() === today.toDateString();
                    
                    if (isToday) {
                        dayElement.classList.add('today');
                    }

                    const daySessions = this.getSessionsForDate(currentDate);
                    if (daySessions.length > 0) {
                        dayElement.classList.add('has-event');
                    }

                    dayElement.innerHTML = `
                        <div class="day-number">${day}</div>
                        ${daySessions.slice(0, 2).map(session => `
                            <div class="event" title="${session.title} - ${this.getClientName(session.clientId)}" onclick="event.stopPropagation(); app.showSection('sessions')">
                                ${session.title}
                            </div>
                        `).join('')}
                        ${daySessions.length > 2 ? `<div class="event">+${daySessions.length - 2} more</div>` : ''}
                    `;

                    dayElement.addEventListener('click', () => {
                        this.openSessionModal(null, currentDate);
                    });

                    calendarGrid.appendChild(dayElement);
                }
            }

            getSessionsForDate(date) {
                return this.sessions.filter(session => {
                    const sessionDate = new Date(session.dateTime);
                    return sessionDate.getDate() === date.getDate() &&
                           sessionDate.getMonth() === date.getMonth() &&
                           sessionDate.getFullYear() === date.getFullYear();
                });
            }

            changeMonth(direction) {
                this.currentMonth += direction;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                } else if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.refreshCalendar();
            }

            refreshReports() {
                // Use Analytics module for report statistics
                const totalRevenue = Analytics.getTotalRevenue(this.sessions);
                const avgSessionPrice = Analytics.getAverageSessionPrice(this.sessions);
                const clientRetention = Analytics.getClientRetentionRate(this.clients, this.sessions);
                
                document.getElementById('totalSessions').textContent = this.sessions.length;
                document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue);
                document.getElementById('avgSessionPrice').textContent = this.formatCurrency(avgSessionPrice);
                document.getElementById('clientRetention').textContent = `${Math.round(clientRetention)}%`;
            }

            exportData(type) {
                let data, filename;
                
                if (type === 'all') {
                    // Use DataManager module for enhanced export with validation
                    const exportData = DataManager.exportData({
                        clients: this.clients,
                        sessions: this.sessions,
                        inventory: this.inventory,
                        settings: {
                            language: this.currentLanguage,
                            currency: settingsManager.get('currency') || 'USD'
                        }
                    });
                    
                    // Add checksums for data integrity
                    const exportWithChecksums = DataManager.addChecksums(exportData);
                    
                    DataManager.downloadJSON(exportWithChecksums, 'inkmanager-pro-complete-backup');
                    this.showNotification('💾 Data exported successfully with integrity checks!');
                    return;
                }
                
                // Legacy export for individual data types
                switch(type) {
                    case 'clients':
                        data = this.clients;
                        filename = 'inkmanager-pro-clients.json';
                        break;
                    case 'sessions':
                        data = this.sessions;
                        filename = 'inkmanager-pro-sessions.json';
                        break;
                    case 'inventory':
                        data = this.inventory;
                        filename = 'inkmanager-pro-inventory.json';
                        break;
                }
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                
                this.showNotification('💾 Data exported successfully!');
            }

            // Settings-related methods removed - now handled by settingsManager module
            // See assets/js/modules/settings.js

            importData() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const jsonString = event.target.result;
                            
                            // Use DataManager module for validation and import
                            const result = DataManager.importData(jsonString);
                            
                            if (!result.success) {
                                const errorMsg = result.errors.join('\n');
                                this.showNotification('❌ Import failed: ' + errorMsg);
                                console.error('Import errors:', result.errors);
                                return;
                            }
                            
                            // Show warnings if any
                            if (result.warnings.length > 0) {
                                console.warn('Import warnings:', result.warnings);
                            }
                            
                            // Verify checksums if present
                            const data = JSON.parse(jsonString);
                            if (data.checksums) {
                                const checksumResult = DataManager.verifyChecksums(data);
                                if (!checksumResult.valid) {
                                    const warning = 'Data integrity check failed: ' + checksumResult.mismatches.join(', ');
                                    if (!confirm(warning + '\n\nContinue with import anyway?')) {
                                        return;
                                    }
                                }
                            }
                            
                            // Confirm before overwriting
                            const confirmMsg = `Import data?\n\n` +
                                `Clients: ${result.data.clients.length}\n` +
                                `Sessions: ${result.data.sessions.length}\n` +
                                `Inventory: ${result.data.inventory.length}\n\n` +
                                `This will overwrite existing data.`;
                                
                            if (confirm(confirmMsg)) {
                                this.clients = result.data.clients;
                                this.sessions = result.data.sessions;
                                this.inventory = result.data.inventory;
                                
                                // Apply settings if included
                                if (result.data.settings) {
                                    if (result.data.settings.language) {
                                        this.setLanguage(result.data.settings.language);
                                    }
                                }
                                
                                this.invalidateInventoryCache();
                                this.safeSaveData(true);
                                this.refreshAll();
                                this.showNotification('✅ Data imported successfully!');
                            }
                        } catch (error) {
                            console.error('Import error:', error);
                            this.showNotification('❌ Failed to import data: ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                };
                
                input.click();
            }

            confirmClearData() {
                if (confirm(this.translate('confirm_clear_data') || 'Are you sure you want to clear all data? This cannot be undone!')) {
                    if (confirm('This will permanently delete all clients, sessions, and inventory. Are you ABSOLUTELY sure?')) {
                        this.clients = [];
                        this.sessions = [];
                        this.inventory = [];
                        this.safeSaveData(true);
                        this.refreshAll();
                        this.showNotification(this.translate('data_cleared') || '🗑️ All data has been cleared');
                    }
                }
            }

            formatDateTime(date) {
                return date.toISOString().slice(0, 16);
            }

            getClientName(clientId) {
                const client = this.clients.find(c => c.id === clientId);
                return client ? client.name : 'Unknown Client';
            }

            translate(key, params = {}) {
                let translation = this.translations[this.currentLanguage]?.[key] || this.translations['en'][key] || key;
                
                if (params.count !== undefined) {
                    translation = translation.replace('{count}', params.count);
                }
                
                return translation;
            }

            showNotification(message) {
                showToast(message);
            }

            showUpdatePrompt() {
                // Create update notification banner
                const updateBanner = document.createElement('div');
                updateBanner.className = 'update-banner';
                updateBanner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                        <i class="fas fa-sync-alt" style="font-size: 1.5em; color: var(--primary);"></i>
                        <div>
                            <strong>🆕 Update Available</strong>
                            <p style="margin: 5px 0 0; font-size: 0.9em; opacity: 0.9;">A new version is ready. Refresh to update.</p>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="updateAppBtn">
                        <i class="fas fa-redo"></i> Update Now
                    </button>
                `;
                
                // Add to DOM if not already present
                if (!document.querySelector('.update-banner')) {
                    document.body.appendChild(updateBanner);
                    
                    // Animate in
                    setTimeout(() => {
                        updateBanner.classList.add('show');
                    }, 100);
                    
                    // Handle update button click
                    const updateBtn = document.getElementById('updateAppBtn');
                    if (updateBtn) {
                        updateBtn.addEventListener('click', () => {
                            // Tell the service worker to skip waiting
                            if (navigator.serviceWorker.controller) {
                                navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                            }
                            // Reload the page
                            window.location.reload();
                        });
                    }
                }
            }

            safeSaveData(immediate = false) {
                if (immediate) {
                    // Immediate save (for critical operations)
                    try {
                        this.saveData();
                    } catch (error) {
                        console.error('Save error:', error);
                        this.showNotification('⚠️ Save failed - storage might be full');
                    }
                } else {
                    // Debounced save (for frequent updates)
                    if (this.saveTimeout) {
                        clearTimeout(this.saveTimeout);
                    }
                    this.saveTimeout = setTimeout(() => {
                        try {
                            this.saveData();
                        } catch (error) {
                            console.error('Save error:', error);
                            this.showNotification('⚠️ Save failed - storage might be full');
                        }
                    }, 300); // Wait 300ms before saving
                }
            }

            saveData() {
                Storage.saveAllData({
                    clients: this.clients,
                    sessions: this.sessions,
                    inventory: this.inventory
                });
            }

            /**
             * Setup notifications for upcoming sessions
             */
            setupNotifications() {
                // Request notification permission if enabled in settings
                const notificationsEnabled = settingsManager.get('notifications');
                
                if (notificationsEnabled && 'Notification' in window) {
                    // Request permission if not already granted
                    if (Notification.permission === 'default') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                console.log('✅ Notification permission granted');
                                this.showNotification('🔔 Notifications enabled! You will be notified about upcoming sessions.');
                            }
                        });
                    }
                    
                    // Start checking for upcoming sessions
                    this.startNotificationScheduler();
                }
            }

            /**
             * Request notification permission
             */
            async requestNotificationPermission() {
                if (!('Notification' in window)) {
                    this.showNotification('⚠️ Notifications are not supported in this browser');
                    return false;
                }

                if (Notification.permission === 'granted') {
                    return true;
                }

                if (Notification.permission === 'denied') {
                    this.showNotification('⚠️ Notification permission was denied. Please enable it in browser settings.');
                    return false;
                }

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.showNotification('✅ Notifications enabled successfully!');
                    return true;
                } else {
                    this.showNotification('⚠️ Notification permission denied');
                    return false;
                }
            }

            /**
             * Start the notification scheduler
             */
            startNotificationScheduler() {
                // Check immediately
                this.checkUpcomingSessions();
                
                // Check every 5 minutes
                this.notificationInterval = setInterval(() => {
                    this.checkUpcomingSessions();
                }, 5 * 60 * 1000); // 5 minutes
                
                console.log('🔔 Notification scheduler started');
            }

            /**
             * Stop the notification scheduler
             */
            stopNotificationScheduler() {
                if (this.notificationInterval) {
                    clearInterval(this.notificationInterval);
                    this.notificationInterval = null;
                    console.log('🔕 Notification scheduler stopped');
                }
            }

            /**
             * Check for upcoming sessions and send notifications
             */
            checkUpcomingSessions() {
                const notificationsEnabled = settingsManager.get('notifications');
                
                if (!notificationsEnabled || Notification.permission !== 'granted') {
                    return;
                }

                const reminderTime = settingsManager.get('reminderTime') || 2; // Default 2 hours
                const now = new Date();
                const notifiedSessions = JSON.parse(localStorage.getItem('inkmanager_notifiedSessions')) || [];
                
                this.sessions.forEach(session => {
                    const sessionDate = new Date(session.dateTime);
                    const timeDiff = sessionDate - now;
                    const hoursUntil = timeDiff / (1000 * 60 * 60);
                    
                    // Check if session is within reminder window and hasn't been notified yet
                    if (hoursUntil > 0 && hoursUntil <= reminderTime && !notifiedSessions.includes(session.id)) {
                        this.sendSessionNotification(session, hoursUntil);
                        notifiedSessions.push(session.id);
                        localStorage.setItem('inkmanager_notifiedSessions', JSON.stringify(notifiedSessions));
                    }
                });

                // Clean up old notified sessions (older than 24 hours)
                const cleanedNotifiedSessions = notifiedSessions.filter(sessionId => {
                    const session = this.sessions.find(s => s.id === sessionId);
                    if (!session) return false;
                    const sessionDate = new Date(session.dateTime);
                    const hoursSince = (now - sessionDate) / (1000 * 60 * 60);
                    return hoursSince < 24;
                });
                localStorage.setItem('inkmanager_notifiedSessions', JSON.stringify(cleanedNotifiedSessions));
            }

            /**
             * Send a notification for an upcoming session
             */
            sendSessionNotification(session, hoursUntil) {
                // Check if notifications are supported
                if (!('Notification' in window)) {
                    console.warn('⚠️ Notifications are not supported in this browser');
                    return;
                }

                // Check if permission is granted before sending
                if (Notification.permission !== 'granted') {
                    console.warn('⚠️ Notification permission not granted');
                    this.showNotification('⚠️ Please enable notifications in settings');
                    return;
                }

                const clientName = this.getClientName(session.clientId);
                const sessionTime = new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const hours = Math.floor(hoursUntil);
                const minutes = Math.round((hoursUntil - hours) * 60);
                let timeText = '';
                
                if (hours >= 1) {
                    timeText = `in ${hours} hour${hours > 1 ? 's' : ''}`;
                    if (minutes > 0) {
                        timeText += ` and ${minutes} minute${minutes > 1 ? 's' : ''}`;
                    }
                } else {
                    timeText = `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
                }
                
                const title = `📅 Upcoming Session: ${session.title}`;
                const body = `Client: ${clientName}\nTime: ${sessionTime}\nStarting ${timeText}`;
                
                // Try to use service worker notification if available (preferred method)
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(title, {
                            body: body,
                            icon: './icon.png',
                            badge: './icon-monochrome.png',
                            tag: `session-${session.id}`,
                            requireInteraction: false,
                            vibrate: [200, 100, 200],
                            data: {
                                sessionId: session.id,
                                url: './index.html#sessions'
                            }
                        }).catch(error => {
                            console.error('❌ Service worker notification failed:', error);
                            // Fallback to basic notification
                            this.sendBasicNotification(title, body, `session-${session.id}`);
                        });
                    }).catch(error => {
                        console.error('❌ Service worker not ready:', error);
                        // Fallback to basic notification
                        this.sendBasicNotification(title, body, `session-${session.id}`);
                    });
                } else {
                    // Fallback to regular notification
                    this.sendBasicNotification(title, body, `session-${session.id}`);
                }
                
                console.log(`🔔 Notification sent for session: ${session.title}`);
            }

            /**
             * Send a basic notification (fallback method)
             * Wrapped in try/catch to handle browsers that throw on Notification constructor
             */
            sendBasicNotification(title, body, tag) {
                try {
                    new Notification(title, {
                        body: body,
                        icon: './icon.png',
                        tag: tag,
                        requireInteraction: false
                    });
                } catch (error) {
                    console.error('❌ Failed to create notification:', error);
                    this.showNotification('⚠️ Notification failed to send');
                }
            }

            /**
             * Test notification functionality
             */
            testNotification() {
                if (Notification.permission !== 'granted') {
                    this.requestNotificationPermission().then(granted => {
                        if (granted) {
                            this.sendTestNotification();
                        }
                    });
                } else {
                    this.sendTestNotification();
                }
            }

            /**
             * Send a test notification
             */
            sendTestNotification() {
                // Check if notifications are supported
                if (!('Notification' in window)) {
                    console.warn('⚠️ Notifications are not supported in this browser');
                    this.showNotification('⚠️ Notifications not supported in this browser');
                    return;
                }

                // Check if permission is granted before sending
                if (Notification.permission !== 'granted') {
                    console.warn('⚠️ Notification permission not granted');
                    this.showNotification('⚠️ Please enable notifications in settings');
                    return;
                }

                const title = '🔔 InkManager Pro';
                const body = 'Test notification - Your notifications are working correctly!';
                
                // Try to use service worker notification if available (preferred method)
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(title, {
                            body: body,
                            icon: './icon.png',
                            badge: './icon-monochrome.png',
                            tag: 'test-notification',
                            requireInteraction: false,
                            vibrate: [200, 100, 200]
                        }).catch(error => {
                            console.error('❌ Service worker notification failed:', error);
                            // Fallback to basic notification
                            this.sendBasicNotification(title, body, 'test-notification');
                        });
                    }).catch(error => {
                        console.error('❌ Service worker not ready:', error);
                        // Fallback to basic notification
                        this.sendBasicNotification(title, body, 'test-notification');
                    });
                } else {
                    // Fallback to regular notification
                    this.sendBasicNotification(title, body, 'test-notification');
                }
                
                this.showNotification('✅ Test notification sent!');
            }
        }

export default InkManagerPro;
