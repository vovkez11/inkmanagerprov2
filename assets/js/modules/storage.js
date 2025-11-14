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
 * InkManager Pro - Versioned Storage Module
 * Manages localStorage with version control and data migrations
 */

const VERSION_KEY = 'inkmanager_storage_version';
const CURRENT_VERSION = 3;

/**
 * Get the current storage version
 * @returns {number} The current storage version
 */
function getVersion() {
    try {
        const version = localStorage.getItem(VERSION_KEY);
        return version ? parseInt(version, 10) : 0;
    } catch (error) {
        console.error('Error getting storage version:', error);
        return 0;
    }
}

/**
 * Set the storage version
 * @param {number} version - The version number to set
 */
function setVersion(version) {
    try {
        localStorage.setItem(VERSION_KEY, version.toString());
        console.log(`✅ Storage version set to ${version}`);
    } catch (error) {
        console.error('Error setting storage version:', error);
    }
}

/**
 * Get data from localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} The parsed data or default value
 */
function getData(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        // Try to parse as JSON, if it fails, return the string value
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    } catch (error) {
        console.error(`Error getting data for key "${key}":`, error);
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
 * Set data in localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store (will be JSON stringified if not a string)
 * @returns {boolean} True if successful, false otherwise
 */
function setData(key, value) {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        return true;
    } catch (error) {
        console.error(`Error setting data for key "${key}":`, error);
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
 * Remove data from localStorage
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} True if successful, false otherwise
 */
function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing data for key "${key}":`, error);
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

/**
 * Migration registry
 * Each migration should have:
 * - version: target version number
 * - description: what the migration does
 * - up: function that performs the migration
 */
const migrations = [
    {
        version: 1,
        description: 'Initialize storage with default settings',
        up: function() {
            console.log('📦 Running migration v0 → v1: Initialize storage');
            
            // Add default settings if they don't exist (idempotent)
            const defaultSettings = {
                theme: 'dark',
                language: 'en',
                currency: 'USD',
                defaultDuration: 2,
                lowStockThreshold: 5,
                autoDeduct: false,
                notifications: true,
                reminderTime: 2,
                autoSave: true
            };
            
            for (const [key, value] of Object.entries(defaultSettings)) {
                const storageKey = `inkmanager_${key}`;
                if (localStorage.getItem(storageKey) === null) {
                    setData(storageKey, value);
                    console.log(`  ✓ Set default ${key}: ${value}`);
                }
            }
            
            // Initialize empty arrays for core data if they don't exist (idempotent)
            if (!getData('inkmanager_clients')) {
                setData('inkmanager_clients', []);
                console.log('  ✓ Initialized clients array');
            }
            if (!getData('inkmanager_sessions')) {
                setData('inkmanager_sessions', []);
                console.log('  ✓ Initialized sessions array');
            }
            if (!getData('inkmanager_inventory')) {
                setData('inkmanager_inventory', []);
                console.log('  ✓ Initialized inventory array');
            }
            
            console.log('✅ Migration v0 → v1 complete');
        }
    },
    {
        version: 2,
        description: 'Add notification tracking and inventory sort defaults',
        up: function() {
            console.log('📦 Running migration v1 → v2: Add notification and inventory defaults');
            
            // Add notifiedSessions tracking if it doesn't exist (idempotent)
            if (!getData('inkmanager_notifiedSessions')) {
                setData('inkmanager_notifiedSessions', []);
                console.log('  ✓ Initialized notifiedSessions tracking');
            }
            
            // Add inventory filter and sort defaults if they don't exist (idempotent)
            if (!getData('inkmanager_inventoryFilter')) {
                setData('inkmanager_inventoryFilter', 'all');
                console.log('  ✓ Set default inventory filter');
            }
            
            if (!getData('inkmanager_inventorySort')) {
                setData('inkmanager_inventorySort', { key: 'name', dir: 'asc' });
                console.log('  ✓ Set default inventory sort');
            }
            
            console.log('✅ Migration v1 → v2 complete');
        }
    },
    {
        version: 3,
        description: 'Add sidebar state and ensure data integrity',
        up: function() {
            console.log('📦 Running migration v2 → v3: Add sidebar state and data integrity checks');
            
            // Add sidebar collapsed state if it doesn't exist (idempotent)
            if (localStorage.getItem('inkmanager_sidebarCollapsed') === null) {
                setData('inkmanager_sidebarCollapsed', 'false');
                console.log('  ✓ Set default sidebar state');
            }
            
            // Data integrity check: ensure all data arrays are valid (idempotent)
            const dataKeys = ['inkmanager_clients', 'inkmanager_sessions', 'inkmanager_inventory'];
            for (const key of dataKeys) {
                const data = getData(key, null);
                if (data === null || !Array.isArray(data)) {
                    setData(key, []);
                    console.log(`  ✓ Fixed invalid data for ${key}`);
                }
            }
            
            // Ensure notifiedSessions is an array (idempotent)
            const notifiedSessions = getData('inkmanager_notifiedSessions', null);
            if (notifiedSessions === null || !Array.isArray(notifiedSessions)) {
                setData('inkmanager_notifiedSessions', []);
                console.log('  ✓ Fixed invalid notifiedSessions data');
            }
            
            console.log('✅ Migration v2 → v3 complete');
        }
    }
];

/**
 * Migrate storage if needed
 * @param {Object} options - Migration options
 * @param {number} options.currentVersion - Current storage version (optional, will be detected)
 * @param {number} options.targetVersion - Target version to migrate to
 * @param {Array} options.migrations - Array of migration objects (optional, uses default migrations)
 * @returns {Object} Migration result { migrated: boolean, fromVersion: number, toVersion: number }
 */
function migrateIfNeeded(options = {}) {
    const currentVersion = options.currentVersion !== undefined ? options.currentVersion : getVersion();
    const targetVersion = options.targetVersion || CURRENT_VERSION;
    const migrationsToUse = options.migrations || migrations;
    
    console.log(`🔍 Storage version check: current=${currentVersion}, target=${targetVersion}`);
    
    if (currentVersion >= targetVersion) {
        console.log('✅ Storage is up to date');
        return { migrated: false, fromVersion: currentVersion, toVersion: currentVersion };
    }
    
    console.log(`🚀 Starting migration from v${currentVersion} to v${targetVersion}`);
    
    try {
        // Sort migrations by version
        const sortedMigrations = migrationsToUse.sort((a, b) => a.version - b.version);
        
        // Run migrations that are needed
        for (const migration of sortedMigrations) {
            if (migration.version > currentVersion && migration.version <= targetVersion) {
                console.log(`📦 Applying migration to v${migration.version}: ${migration.description}`);
                migration.up();
            }
        }
        
        // Update version
        setVersion(targetVersion);
        
        console.log(`✅ Migration complete: v${currentVersion} → v${targetVersion}`);
        
        return { migrated: true, fromVersion: currentVersion, toVersion: targetVersion };
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return { migrated: false, fromVersion: currentVersion, toVersion: currentVersion, error: error };
    }
}

// Export functions for use in the app
if (typeof window !== 'undefined') {
    window.InkManagerStorage = {
        VERSION_KEY,
        CURRENT_VERSION,
        getVersion,
        setVersion,
        getData,
        setData,
        removeData,
        migrateIfNeeded,
        migrations
    };
}
