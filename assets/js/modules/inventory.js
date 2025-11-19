/**
 * InkManager Pro - Inventory Module
 * Handles inventory management, filtering, sorting, and operations
 */

/**
 * Filter inventory items based on current filter
 * @param {Array} inventory - Full inventory array
 * @param {string} filter - Current filter ('all', 'low-stock', or item type)
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered inventory items
 */
export function filterInventory(inventory, filter, searchQuery = '') {
    let filtered = inventory;

    // Apply type/status filter
    if (filter === 'low-stock') {
        filtered = filtered.filter(item => item.qty <= item.alert);
    } else if (filter !== 'all') {
        filtered = filtered.filter(item => item.type === filter);
    }

    // Apply search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query) ||
            (item.notes && item.notes.toLowerCase().includes(query)) ||
            item.type.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Sort inventory items based on sort configuration
 * @param {Array} items - Items to sort
 * @param {Object} sortConfig - Sort configuration {key, dir}
 * @returns {Array} Sorted items
 */
export function sortInventory(items, sortConfig) {
    const { key, dir } = sortConfig;
    
    return [...items].sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        
        // Handle numeric comparisons
        if (key === 'qty' || key === 'alert' || key === 'price') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        
        // Handle string comparisons (case-insensitive)
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Check if item is low stock
 * @param {Object} item - Inventory item
 * @returns {boolean} True if item is low stock
 */
export function isLowStock(item) {
    return item.qty <= item.alert;
}

/**
 * Get low stock items
 * @param {Array} inventory - Full inventory array
 * @returns {Array} Low stock items
 */
export function getLowStockItems(inventory) {
    return inventory.filter(isLowStock);
}

/**
 * Adjust inventory quantity
 * @param {Array} inventory - Full inventory array
 * @param {string} itemId - Item ID
 * @param {number} adjustment - Quantity adjustment (can be negative)
 * @returns {Object} Updated item or null
 */
export function adjustQuantity(inventory, itemId, adjustment) {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return null;
    
    const newQty = Math.max(0, (item.qty || 0) + adjustment);
    item.qty = newQty;
    item.updatedAt = new Date().toISOString();
    
    return item;
}

/**
 * Update inventory item field
 * @param {Array} inventory - Full inventory array
 * @param {string} itemId - Item ID
 * @param {string} field - Field name
 * @param {*} value - New value
 * @returns {Object} Updated item or null
 */
export function updateItemField(inventory, itemId, field, value) {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return null;
    
    // Parse numeric fields
    if (field === 'qty' || field === 'alert') {
        value = parseInt(value) || 0;
    } else if (field === 'price') {
        value = parseFloat(value) || 0;
    }
    
    item[field] = value;
    item.updatedAt = new Date().toISOString();
    
    return item;
}

/**
 * Create new inventory item
 * @param {Object} itemData - Item data
 * @returns {Object} New item with ID and timestamp
 */
export function createItem(itemData) {
    return {
        id: 'item-' + Date.now(),
        name: itemData.name,
        type: itemData.type,
        qty: itemData.qty,
        alert: itemData.alert,
        price: itemData.price || 0,
        notes: itemData.notes || '',
        createdAt: new Date().toISOString()
    };
}

/**
 * Update existing inventory item
 * @param {Array} inventory - Full inventory array
 * @param {string} itemId - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Object} Updated item or null
 */
export function updateItem(inventory, itemId, itemData) {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return null;
    
    Object.assign(item, {
        name: itemData.name,
        type: itemData.type,
        qty: itemData.qty,
        alert: itemData.alert,
        price: itemData.price || 0,
        notes: itemData.notes || '',
        updatedAt: new Date().toISOString()
    });
    
    return item;
}

/**
 * Delete inventory items
 * @param {Array} inventory - Full inventory array
 * @param {Array} itemIds - Array of item IDs to delete
 * @returns {Object} {inventory: updated array, deleted: deleted items}
 */
export function deleteItems(inventory, itemIds) {
    const idsSet = new Set(itemIds);
    const deleted = inventory.filter(i => idsSet.has(i.id));
    const updated = inventory.filter(i => !idsSet.has(i.id));
    
    return { inventory: updated, deleted };
}

/**
 * Get inventory item type icons
 * @param {string} type - Item type
 * @returns {string} Icon emoji
 */
export function getTypeIcon(type) {
    const typeIcons = {
        'needle': '🪡',
        'ink': '🎨',
        'machine': '⚡',
        'supply': '📦',
        'aftercare': '🧴',
        'safety': '🧤'
    };
    return typeIcons[type] || '📋';
}

/**
 * Get available inventory types
 * @returns {Array} Array of type objects {value, label, icon}
 */
export function getInventoryTypes() {
    return [
        { value: 'needle', label: 'Needles', icon: '🪡' },
        { value: 'ink', label: 'Ink', icon: '🎨' },
        { value: 'machine', label: 'Machines', icon: '⚡' },
        { value: 'supply', label: 'Supplies', icon: '📦' },
        { value: 'aftercare', label: 'Aftercare', icon: '🧴' },
        { value: 'safety', label: 'Safety', icon: '🧤' }
    ];
}

/**
 * Validate inventory item data
 * @param {Object} itemData - Item data to validate
 * @returns {Object} {valid: boolean, errors: array of error messages}
 */
export function validateItemData(itemData) {
    const errors = [];
    
    if (!itemData.name || itemData.name.trim().length === 0) {
        errors.push('Item name is required');
    }
    
    if (!itemData.type) {
        errors.push('Item type is required');
    }
    
    if (itemData.qty === undefined || itemData.qty === null || itemData.qty < 0) {
        errors.push('Quantity must be a non-negative number');
    }
    
    if (itemData.alert === undefined || itemData.alert === null || itemData.alert < 0) {
        errors.push('Alert threshold must be a non-negative number');
    }
    
    if (itemData.price !== undefined && itemData.price !== null && itemData.price < 0) {
        errors.push('Price must be a non-negative number');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
