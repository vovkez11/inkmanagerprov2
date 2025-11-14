/**
 * InkManager Pro - Storage Module
 * Handles LocalStorage operations for clients, sessions, and inventory
 */

const STORAGE_KEYS = {
    CLIENTS: 'inkmanager_clients',
    SESSIONS: 'inkmanager_sessions',
    INVENTORY: 'inkmanager_inventory',
    INVENTORY_FILTER: 'inkmanager_inventoryFilter',
    INVENTORY_SORT: 'inkmanager_inventorySort',
    SIDEBAR_COLLAPSED: 'inkmanager_sidebarCollapsed',
    LANGUAGE: 'inkmanager_language',
    NOTIFICATIONS: 'inkmanager_notifications',
    NOTIFICATION_REMINDER: 'inkmanager_notificationReminder'
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed data or default value
 */
export function loadData(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to save
 * @returns {boolean} Success status
 */
export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
        return false;
    }
}

/**
 * Get a single item from localStorage (string value)
 * @param {string} key - Storage key
 * @param {string} defaultValue - Default value if key doesn't exist
 * @returns {string} Stored value or default
 */
export function getItem(key, defaultValue = null) {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Set a single item in localStorage (string value)
 * @param {string} key - Storage key
 * @param {string} value - Value to save
 * @returns {boolean} Success status
 */
export function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
        return false;
    }
}

/**
 * Remove an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key}:`, error);
        return false;
    }
}

/**
 * Clear all app data from localStorage
 * @returns {boolean} Success status
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

/**
 * Load all clients from storage
 * @returns {Array} Array of client objects
 */
export function loadClients() {
    return loadData(STORAGE_KEYS.CLIENTS, []);
}

/**
 * Save clients to storage
 * @param {Array} clients - Array of client objects
 * @returns {boolean} Success status
 */
export function saveClients(clients) {
    return saveData(STORAGE_KEYS.CLIENTS, clients);
}

/**
 * Load all sessions from storage
 * @returns {Array} Array of session objects
 */
export function loadSessions() {
    return loadData(STORAGE_KEYS.SESSIONS, []);
}

/**
 * Save sessions to storage
 * @param {Array} sessions - Array of session objects
 * @returns {boolean} Success status
 */
export function saveSessions(sessions) {
    return saveData(STORAGE_KEYS.SESSIONS, sessions);
}

/**
 * Load all inventory items from storage
 * @returns {Array} Array of inventory objects
 */
export function loadInventory() {
    return loadData(STORAGE_KEYS.INVENTORY, []);
}

/**
 * Save inventory to storage
 * @param {Array} inventory - Array of inventory objects
 * @returns {boolean} Success status
 */
export function saveInventory(inventory) {
    return saveData(STORAGE_KEYS.INVENTORY, inventory);
}

/**
 * Save all data (clients, sessions, inventory) at once
 * @param {Object} data - Object containing clients, sessions, and inventory arrays
 * @returns {boolean} Success status
 */
export function saveAllData({ clients, sessions, inventory }) {
    let success = true;
    
    if (clients !== undefined) {
        success = saveClients(clients) && success;
    }
    if (sessions !== undefined) {
        success = saveSessions(sessions) && success;
    }
    if (inventory !== undefined) {
        success = saveInventory(inventory) && success;
    }
    
    return success;
}

/**
 * Export all data as JSON
 * @returns {Object} Object containing all app data
 */
export function exportAllData() {
    return {
        clients: loadClients(),
        sessions: loadSessions(),
        inventory: loadInventory(),
        exportDate: new Date().toISOString(),
        version: '2.1'
    };
}

/**
 * Import data from JSON object
 * @param {Object} data - Data object to import
 * @returns {boolean} Success status
 */
export function importAllData(data) {
    try {
        if (data.clients) saveClients(data.clients);
        if (data.sessions) saveSessions(data.sessions);
        if (data.inventory) saveInventory(data.inventory);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Export storage keys for use in other modules
export { STORAGE_KEYS };
