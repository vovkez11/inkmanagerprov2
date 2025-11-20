/**
 * Settings Module
 * Handles all application settings including persistence, validation, and UI updates
 */

import * as Storage from './storage.js';
import { showToast } from './ui.js';
import { updateDOMTranslations } from './i18n.js';

// Settings version for migration support
const SETTINGS_VERSION = '1.0.0';

// Default settings configuration
const DEFAULT_SETTINGS = {
    version: SETTINGS_VERSION,
    theme: 'dark',
    language: 'en',
    studioName: '',
    currency: 'USD',
    defaultDuration: 2,
    lowStockThreshold: 5,
    autoDeduct: false,
    notifications: true,
    reminderTime: 2,
    autoSave: true
};

// Settings validation rules
const VALIDATION_RULES = {
    theme: {
        type: 'string',
        enum: ['dark', 'light', 'auto'],
        required: true
    },
    language: {
        type: 'string',
        enum: ['en', 'es', 'ru', 'he'],
        required: true
    },
    studioName: {
        type: 'string',
        maxLength: 100
    },
    currency: {
        type: 'string',
        enum: ['USD', 'EUR', 'GBP', 'RUB', 'ILS', 'CAD', 'AUD'],
        required: true
    },
    defaultDuration: {
        type: 'number',
        min: 0.5,
        max: 12,
        required: true
    },
    lowStockThreshold: {
        type: 'number',
        min: 1,
        max: 1000,
        required: true
    },
    autoDeduct: {
        type: 'boolean',
        required: true
    },
    notifications: {
        type: 'boolean',
        required: true
    },
    reminderTime: {
        type: 'number',
        min: 1,
        max: 72,
        required: true
    },
    autoSave: {
        type: 'boolean',
        required: true
    }
};

/**
 * SettingsManager class
 * Manages all settings operations
 */
class SettingsManager {
    constructor() {
        this.settings = {};
        this.callbacks = {
            onChange: [],
            onThemeChange: [],
            onLanguageChange: [],
            onNotificationsChange: []
        };
        this.initialized = false;
    }

    /**
     * Initialize the settings manager
     */
    init() {
        if (this.initialized) {
            console.warn('⚠️ Settings already initialized');
            return;
        }

        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
        this.initialized = true;
        console.log('⚙️ Settings Manager initialized');
    }

    /**
     * Load settings from localStorage with validation and migration
     */
    loadSettings() {
        try {
            const settings = {};
            
            // Load each setting individually with fallback to default
            Object.keys(DEFAULT_SETTINGS).forEach(key => {
                if (key === 'version') {
                    settings[key] = SETTINGS_VERSION;
                    return;
                }

                const storageKey = `inkmanager_${key}`;
                let value = localStorage.getItem(storageKey);

                // Parse value based on type
                if (value !== null) {
                    const rule = VALIDATION_RULES[key];
                    if (rule.type === 'number') {
                        value = parseFloat(value);
                    } else if (rule.type === 'boolean') {
                        value = value === 'true';
                    }
                } else {
                    value = DEFAULT_SETTINGS[key];
                }

                // Validate and use default if invalid
                if (this.validateSetting(key, value)) {
                    settings[key] = value;
                } else {
                    console.warn(`⚠️ Invalid setting ${key}:`, value, '- using default');
                    settings[key] = DEFAULT_SETTINGS[key];
                }
            });

            this.settings = settings;
            console.log('✅ Settings loaded successfully');
            return settings;
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            this.settings = { ...DEFAULT_SETTINGS };
            return this.settings;
        }
    }

    /**
     * Validate a single setting value
     */
    validateSetting(key, value) {
        const rule = VALIDATION_RULES[key];
        if (!rule) return true;

        // Check type
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
            return false;
        }

        // Check enum values
        if (rule.enum && !rule.enum.includes(value)) {
            return false;
        }

        // Check number constraints
        if (rule.type === 'number') {
            if (rule.min !== undefined && value < rule.min) return false;
            if (rule.max !== undefined && value > rule.max) return false;
        }

        // Check string constraints
        if (rule.type === 'string') {
            if (rule.maxLength !== undefined && value.length > rule.maxLength) return false;
        }

        return true;
    }

    /**
     * Get a setting value
     */
    get(key) {
        return this.settings[key];
    }

    /**
     * Get all settings
     */
    getAll() {
        return { ...this.settings };
    }

    /**
     * Set a single setting value
     */
    set(key, value) {
        if (!this.validateSetting(key, value)) {
            console.error(`❌ Invalid value for setting ${key}:`, value);
            return false;
        }

        const oldValue = this.settings[key];
        this.settings[key] = value;

        // Persist to localStorage
        try {
            localStorage.setItem(`inkmanager_${key}`, value.toString());
        } catch (error) {
            console.error(`❌ Error saving setting ${key}:`, error);
            return false;
        }

        // Trigger callbacks
        this.triggerCallbacks('onChange', { key, value, oldValue });

        // Trigger specific callbacks
        if (key === 'theme') {
            this.applyTheme(value);
            this.triggerCallbacks('onThemeChange', value);
        } else if (key === 'language') {
            this.applyLanguage(value);
            this.triggerCallbacks('onLanguageChange', value);
        } else if (key === 'notifications') {
            this.triggerCallbacks('onNotificationsChange', { value, oldValue });
        }

        return true;
    }

    /**
     * Save all settings from UI form
     */
    saveAllFromUI() {
        try {
            const formData = this.getFormData();
            
            // Validate all values before saving
            const validationErrors = [];
            Object.keys(formData).forEach(key => {
                if (!this.validateSetting(key, formData[key])) {
                    validationErrors.push(key);
                }
            });

            if (validationErrors.length > 0) {
                showToast('❌ Invalid settings: ' + validationErrors.join(', '), 'error');
                return false;
            }

            // Save each setting
            Object.keys(formData).forEach(key => {
                const oldValue = this.settings[key];
                this.settings[key] = formData[key];
                
                // Persist to localStorage
                localStorage.setItem(`inkmanager_${key}`, formData[key].toString());

                // Apply theme or language if changed
                if (key === 'theme' && oldValue !== formData[key]) {
                    this.applyTheme(formData[key]);
                    this.triggerCallbacks('onThemeChange', formData[key]);
                } else if (key === 'language' && oldValue !== formData[key]) {
                    this.applyLanguage(formData[key]);
                    this.triggerCallbacks('onLanguageChange', formData[key]);
                } else if (key === 'notifications' && oldValue !== formData[key]) {
                    this.triggerCallbacks('onNotificationsChange', { value: formData[key], oldValue });
                }
            });

            // Trigger general onChange callback
            this.triggerCallbacks('onChange', { all: formData });

            showToast('✅ Settings saved successfully!', 'success');
            return true;
        } catch (error) {
            console.error('❌ Error saving settings:', error);
            showToast('❌ Failed to save settings', 'error');
            return false;
        }
    }

    /**
     * Get form data from UI
     */
    getFormData() {
        const formData = {};

        // Get values from form elements
        const themeEl = document.getElementById('settingsTheme');
        if (themeEl) formData.theme = themeEl.value;

        const languageEl = document.getElementById('settingsLanguage');
        if (languageEl) formData.language = languageEl.value;

        const studioNameEl = document.getElementById('settingsStudioName');
        if (studioNameEl) formData.studioName = studioNameEl.value.trim();

        const currencyEl = document.getElementById('settingsCurrency');
        if (currencyEl) formData.currency = currencyEl.value;

        const defaultDurationEl = document.getElementById('settingsDefaultDuration');
        if (defaultDurationEl) formData.defaultDuration = parseFloat(defaultDurationEl.value);

        const lowStockThresholdEl = document.getElementById('settingsLowStockThreshold');
        if (lowStockThresholdEl) formData.lowStockThreshold = parseInt(lowStockThresholdEl.value);

        const autoDeductEl = document.getElementById('settingsAutoDeduct');
        if (autoDeductEl) formData.autoDeduct = autoDeductEl.checked;

        const notificationsEl = document.getElementById('settingsNotifications');
        if (notificationsEl) formData.notifications = notificationsEl.checked;

        const reminderTimeEl = document.getElementById('settingsReminderTime');
        if (reminderTimeEl) formData.reminderTime = parseInt(reminderTimeEl.value);

        const autoSaveEl = document.getElementById('settingsAutoSave');
        if (autoSaveEl) formData.autoSave = autoSaveEl.checked;

        return formData;
    }

    /**
     * Update UI form with current settings
     */
    updateUI() {
        // Theme
        const themeEl = document.getElementById('settingsTheme');
        if (themeEl) themeEl.value = this.settings.theme;

        // Language
        const languageEl = document.getElementById('settingsLanguage');
        if (languageEl) languageEl.value = this.settings.language;

        // Studio Name
        const studioNameEl = document.getElementById('settingsStudioName');
        if (studioNameEl) studioNameEl.value = this.settings.studioName;

        // Currency
        const currencyEl = document.getElementById('settingsCurrency');
        if (currencyEl) currencyEl.value = this.settings.currency;

        // Default Duration
        const defaultDurationEl = document.getElementById('settingsDefaultDuration');
        if (defaultDurationEl) defaultDurationEl.value = this.settings.defaultDuration;

        // Low Stock Threshold
        const lowStockThresholdEl = document.getElementById('settingsLowStockThreshold');
        if (lowStockThresholdEl) lowStockThresholdEl.value = this.settings.lowStockThreshold;

        // Auto Deduct
        const autoDeductEl = document.getElementById('settingsAutoDeduct');
        if (autoDeductEl) autoDeductEl.checked = this.settings.autoDeduct;

        // Notifications
        const notificationsEl = document.getElementById('settingsNotifications');
        if (notificationsEl) notificationsEl.checked = this.settings.notifications;

        // Reminder Time
        const reminderTimeEl = document.getElementById('settingsReminderTime');
        if (reminderTimeEl) reminderTimeEl.value = this.settings.reminderTime;

        // Auto Save
        const autoSaveEl = document.getElementById('settingsAutoSave');
        if (autoSaveEl) autoSaveEl.checked = this.settings.autoSave;
    }

    /**
     * Reset all settings to defaults
     */
    reset() {
        try {
            // Clear all settings from localStorage
            Object.keys(DEFAULT_SETTINGS).forEach(key => {
                if (key !== 'version') {
                    localStorage.removeItem(`inkmanager_${key}`);
                }
            });

            // Reset to defaults
            this.settings = { ...DEFAULT_SETTINGS };
            
            // Update UI
            this.updateUI();
            
            // Apply settings
            this.applySettings();

            // Trigger callbacks
            this.triggerCallbacks('onChange', { reset: true });

            showToast('✅ Settings reset to defaults', 'success');
            return true;
        } catch (error) {
            console.error('❌ Error resetting settings:', error);
            showToast('❌ Failed to reset settings', 'error');
            return false;
        }
    }

    /**
     * Apply all settings (theme, language, etc.)
     */
    applySettings() {
        this.applyTheme(this.settings.theme);
        this.applyLanguage(this.settings.language);
        this.updateUI();
    }

    /**
     * Apply theme setting
     */
    applyTheme(theme) {
        const body = document.body;
        const root = document.documentElement;

        // Remove existing theme classes
        body.classList.remove('theme-dark', 'theme-light');

        let actualTheme = theme;
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            actualTheme = prefersDark ? 'dark' : 'light';
        }

        if (actualTheme === 'light') {
            body.classList.add('theme-light');
            // Light theme colors
            root.style.setProperty('--dark', '#f5f5f5');
            root.style.setProperty('--darker', '#ffffff');
            root.style.setProperty('--dark-gray', '#e0e0e0');
            root.style.setProperty('--light', '#0d1117');
        } else {
            body.classList.add('theme-dark');
            // Dark theme colors (defaults)
            root.style.setProperty('--dark', '#0d1117');
            root.style.setProperty('--darker', '#010409');
            root.style.setProperty('--dark-gray', '#161b22');
            root.style.setProperty('--light', '#f5f5f5');
        }

        console.log(`🎨 Theme applied: ${theme} (actual: ${actualTheme})`);
    }

    /**
     * Apply language setting
     */
    applyLanguage(language) {
        if (typeof updateDOMTranslations === 'function') {
            updateDOMTranslations(language);
            console.log(`🌐 Language applied: ${language}`);
        }
    }

    /**
     * Setup event listeners for settings UI
     */
    setupEventListeners() {
        // Save Settings button
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAllFromUI());
        }

        // Reset Settings button
        const resetBtn = document.getElementById('resetSettingsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset all settings to defaults?')) {
                    this.reset();
                }
            });
        }

        // Immediate theme change
        const themeSelect = document.getElementById('settingsTheme');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.set('theme', e.target.value);
            });
        }

        // Immediate language change
        const languageSelect = document.getElementById('settingsLanguage');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.set('language', e.target.value);
            });
        }

        console.log('👂 Settings event listeners setup complete');
    }

    /**
     * Register a callback for settings changes
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * Trigger callbacks
     */
    triggerCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ Error in ${event} callback:`, error);
                }
            });
        }
    }

    /**
     * Export settings as JSON
     */
    export() {
        return JSON.stringify(this.settings, null, 2);
    }

    /**
     * Import settings from JSON
     */
    import(jsonString) {
        try {
            const importedSettings = JSON.parse(jsonString);
            
            // Validate and import each setting
            Object.keys(importedSettings).forEach(key => {
                if (key === 'version') return;
                
                if (this.validateSetting(key, importedSettings[key])) {
                    this.set(key, importedSettings[key]);
                } else {
                    console.warn(`⚠️ Skipping invalid imported setting ${key}`);
                }
            });

            this.updateUI();
            this.applySettings();
            
            showToast('✅ Settings imported successfully', 'success');
            return true;
        } catch (error) {
            console.error('❌ Error importing settings:', error);
            showToast('❌ Failed to import settings', 'error');
            return false;
        }
    }
}

// Create and export singleton instance
const settingsManager = new SettingsManager();

export default settingsManager;
export { DEFAULT_SETTINGS, VALIDATION_RULES };
