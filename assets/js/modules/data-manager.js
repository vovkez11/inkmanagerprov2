/**
 * InkManager Pro - Data Manager Module
 * Handles data export, import, validation, and backup functionality
 */

/**
 * Current data schema version
 */
export const DATA_VERSION = '2.0';

/**
 * Validate data structure
 * @param {Object} data - Data to validate
 * @returns {Object} {valid: boolean, errors: array}
 */
export function validateData(data) {
    const errors = [];
    
    if (!data || typeof data !== 'object') {
        errors.push('Invalid data format');
        return { valid: false, errors };
    }
    
    // Check required fields
    if (!Array.isArray(data.clients)) {
        errors.push('Clients data must be an array');
    }
    
    if (!Array.isArray(data.sessions)) {
        errors.push('Sessions data must be an array');
    }
    
    if (!Array.isArray(data.inventory)) {
        errors.push('Inventory data must be an array');
    }
    
    // Validate clients
    if (Array.isArray(data.clients)) {
        data.clients.forEach((client, index) => {
            if (!client.id) errors.push(`Client at index ${index} missing ID`);
            if (!client.name) errors.push(`Client at index ${index} missing name`);
        });
    }
    
    // Validate sessions
    if (Array.isArray(data.sessions)) {
        data.sessions.forEach((session, index) => {
            if (!session.id) errors.push(`Session at index ${index} missing ID`);
            if (!session.dateTime) errors.push(`Session at index ${index} missing dateTime`);
        });
    }
    
    // Validate inventory
    if (Array.isArray(data.inventory)) {
        data.inventory.forEach((item, index) => {
            if (!item.id) errors.push(`Inventory item at index ${index} missing ID`);
            if (!item.name) errors.push(`Inventory item at index ${index} missing name`);
        });
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Export data to JSON
 * @param {Object} appData - Application data {clients, sessions, inventory, settings}
 * @returns {Object} Export data with metadata
 */
export function exportData(appData) {
    const exportData = {
        version: DATA_VERSION,
        exportDate: new Date().toISOString(),
        appName: 'InkManager Pro V2',
        data: {
            clients: appData.clients || [],
            sessions: appData.sessions || [],
            inventory: appData.inventory || [],
            settings: appData.settings || {}
        },
        stats: {
            totalClients: (appData.clients || []).length,
            totalSessions: (appData.sessions || []).length,
            totalInventoryItems: (appData.inventory || []).length
        }
    };
    
    return exportData;
}

/**
 * Create downloadable JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename (without extension)
 */
export function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Parse imported JSON data
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} {success: boolean, data: object, error: string}
 */
export function parseImportData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return { success: true, data, error: null };
    } catch (error) {
        return { 
            success: false, 
            data: null, 
            error: `Invalid JSON format: ${error.message}` 
        };
    }
}

/**
 * Import and validate data
 * @param {string} jsonString - JSON string to import
 * @returns {Object} {success: boolean, data: object, errors: array, warnings: array}
 */
export function importData(jsonString) {
    const parseResult = parseImportData(jsonString);
    
    if (!parseResult.success) {
        return {
            success: false,
            data: null,
            errors: [parseResult.error],
            warnings: []
        };
    }
    
    const importedData = parseResult.data;
    const warnings = [];
    
    // Check version compatibility
    if (importedData.version && importedData.version !== DATA_VERSION) {
        warnings.push(`Data version mismatch: importing ${importedData.version}, current version is ${DATA_VERSION}`);
    }
    
    // Extract actual data
    const data = importedData.data || importedData;
    
    // Validate structure
    const validation = validateData(data);
    
    if (!validation.valid) {
        return {
            success: false,
            data: null,
            errors: validation.errors,
            warnings
        };
    }
    
    return {
        success: true,
        data: {
            clients: data.clients || [],
            sessions: data.sessions || [],
            inventory: data.inventory || [],
            settings: data.settings || {}
        },
        errors: [],
        warnings
    };
}

/**
 * Create automatic backup
 * @param {Object} appData - Application data
 * @returns {string} Backup JSON string
 */
export function createBackup(appData) {
    const backup = exportData(appData);
    return JSON.stringify(backup);
}

/**
 * Save backup to localStorage
 * @param {Object} appData - Application data
 * @param {string} key - Storage key for backup
 * @returns {boolean} Success status
 */
export function saveBackupToStorage(appData, key = 'inkmanager_backup') {
    try {
        const backup = createBackup(appData);
        localStorage.setItem(key, backup);
        localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
        return true;
    } catch (error) {
        console.error('Failed to save backup:', error);
        return false;
    }
}

/**
 * Load backup from localStorage
 * @param {string} key - Storage key for backup
 * @returns {Object|null} Backup data or null
 */
export function loadBackupFromStorage(key = 'inkmanager_backup') {
    try {
        const backupString = localStorage.getItem(key);
        if (!backupString) return null;
        
        const result = importData(backupString);
        return result.success ? result.data : null;
    } catch (error) {
        console.error('Failed to load backup:', error);
        return null;
    }
}

/**
 * Get backup metadata
 * @param {string} key - Storage key for backup
 * @returns {Object|null} Backup metadata or null
 */
export function getBackupMetadata(key = 'inkmanager_backup') {
    try {
        const timestamp = localStorage.getItem(`${key}_timestamp`);
        const backupString = localStorage.getItem(key);
        
        if (!backupString) return null;
        
        const backup = JSON.parse(backupString);
        
        return {
            timestamp,
            version: backup.version,
            exportDate: backup.exportDate,
            stats: backup.stats
        };
    } catch (error) {
        console.error('Failed to get backup metadata:', error);
        return null;
    }
}

/**
 * Calculate data integrity checksum (simple)
 * @param {Object} data - Data to checksum
 * @returns {string} Simple checksum
 */
export function calculateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Add checksums to export data
 * @param {Object} exportData - Export data object
 * @returns {Object} Export data with checksums
 */
export function addChecksums(exportData) {
    return {
        ...exportData,
        checksums: {
            clients: calculateChecksum(exportData.data.clients),
            sessions: calculateChecksum(exportData.data.sessions),
            inventory: calculateChecksum(exportData.data.inventory),
            all: calculateChecksum(exportData.data)
        }
    };
}

/**
 * Verify checksums in imported data
 * @param {Object} importData - Import data with checksums
 * @returns {Object} {valid: boolean, mismatches: array}
 */
export function verifyChecksums(importData) {
    if (!importData.checksums) {
        return { valid: true, mismatches: ['No checksums to verify'] };
    }
    
    const mismatches = [];
    const { checksums, data } = importData;
    
    if (checksums.clients && checksums.clients !== calculateChecksum(data.clients)) {
        mismatches.push('Clients data checksum mismatch');
    }
    
    if (checksums.sessions && checksums.sessions !== calculateChecksum(data.sessions)) {
        mismatches.push('Sessions data checksum mismatch');
    }
    
    if (checksums.inventory && checksums.inventory !== calculateChecksum(data.inventory)) {
        mismatches.push('Inventory data checksum mismatch');
    }
    
    if (checksums.all && checksums.all !== calculateChecksum(data)) {
        mismatches.push('Overall data checksum mismatch');
    }
    
    return {
        valid: mismatches.length === 0,
        mismatches
    };
}
