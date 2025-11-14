/**
 * InkManager Pro - Event Initialization
 * Sets up all event listeners to comply with Content Security Policy
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for main.js to load and app to be initialized
    setTimeout(function() {
        if (!window.app) {
            console.error('App not initialized');
            return;
        }

        setupDashboardEvents();
        setupReportsEvents();
        setupSettingsEvents();
        setupInstallPromptEvents();

        console.log('✅ Event listeners initialized');
    }, 100);
});

/**
 * Setup Dashboard section events
 */
function setupDashboardEvents() {
    // Dashboard stat cards
    const statCardClients = document.getElementById('statCardClients');
    const statCardSessions = document.getElementById('statCardSessions');
    const statCardRevenue = document.getElementById('statCardRevenue');
    const statCardInventory = document.getElementById('statCardInventory');

    if (statCardClients) {
        statCardClients.addEventListener('click', () => window.app.showSection('clients'));
    }
    if (statCardSessions) {
        statCardSessions.addEventListener('click', () => window.app.showSection('sessions'));
    }
    if (statCardRevenue) {
        statCardRevenue.addEventListener('click', () => window.app.showSection('reports'));
    }
    if (statCardInventory) {
        statCardInventory.addEventListener('click', () => window.app.showSection('inventory'));
    }

    // Dashboard export button
    const dashboardExportBtn = document.getElementById('dashboardExportBtn');
    if (dashboardExportBtn) {
        dashboardExportBtn.addEventListener('click', () => window.app.exportData('all'));
    }

    // Today's Sessions card title
    const todaysSessionsTitle = document.getElementById('todaysSessionsTitle');
    if (todaysSessionsTitle) {
        todaysSessionsTitle.addEventListener('click', () => window.app.showSection('sessions'));
    }

    // Quick Insights card title
    const quickInsightsTitle = document.getElementById('quickInsightsTitle');
    if (quickInsightsTitle) {
        quickInsightsTitle.addEventListener('click', () => window.app.showSection('reports'));
    }

    // Schedule session button in empty state
    const scheduleSessionBtn = document.getElementById('scheduleSessionBtn');
    if (scheduleSessionBtn) {
        scheduleSessionBtn.addEventListener('click', () => window.app.showSection('sessions'));
    }
}

/**
 * Setup Reports section events
 */
function setupReportsEvents() {
    // Export buttons
    const exportAllBtn1 = document.getElementById('exportAllBtn1');
    const exportClientsBtn = document.getElementById('exportClientsBtn');
    const exportSessionsBtn = document.getElementById('exportSessionsBtn');
    const exportInventoryBtn = document.getElementById('exportInventoryBtn');

    if (exportAllBtn1) {
        exportAllBtn1.addEventListener('click', () => window.app.exportData('all'));
    }
    if (exportClientsBtn) {
        exportClientsBtn.addEventListener('click', () => window.app.exportData('clients'));
    }
    if (exportSessionsBtn) {
        exportSessionsBtn.addEventListener('click', () => window.app.exportData('sessions'));
    }
    if (exportInventoryBtn) {
        exportInventoryBtn.addEventListener('click', () => window.app.exportData('inventory'));
    }
}

/**
 * Setup Settings section events
 */
function setupSettingsEvents() {
    // Test notification button
    const testNotificationBtn = document.getElementById('testNotificationBtn');
    if (testNotificationBtn) {
        testNotificationBtn.addEventListener('click', () => window.app.testNotification());
    }

    // Data management buttons
    const exportAllBtn2 = document.getElementById('exportAllBtn2');
    const importDataBtn = document.getElementById('importDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    if (exportAllBtn2) {
        exportAllBtn2.addEventListener('click', () => window.app.exportData('all'));
    }
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => window.app.importData());
    }
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => window.app.confirmClearData());
    }
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => window.app.resetSettings());
    }
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => window.app.saveSettings());
    }
}

/**
 * Setup install prompt events
 */
function setupInstallPromptEvents() {
    const installDismissBtn = document.getElementById('installDismissBtn');
    const installConfirmBtn = document.getElementById('installConfirmBtn');

    if (installDismissBtn) {
        installDismissBtn.addEventListener('click', function() {
            const prompt = document.getElementById('installPrompt');
            if (prompt) {
                prompt.style.display = 'none';
            }
        });
    }

    if (installConfirmBtn) {
        installConfirmBtn.addEventListener('click', () => {
            if (typeof handleInstallClick === 'function') {
                handleInstallClick();
            }
        });
    }
}
