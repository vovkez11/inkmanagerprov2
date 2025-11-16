/**
 * InkManager Pro - UI Module
 * Handles DOM helpers, toasts, banners, modals, and common UI interactions
 */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }
}

/**
 * Show a modal dialog
 * @param {string} modalId - ID of the modal element
 */
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Hide a modal dialog
 * @param {string} modalId - ID of the modal element
 */
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Reset a form
 * @param {string} formId - ID of the form element
 */
export function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Set form values from an object
 * @param {Object} fieldMap - Map of field IDs to values
 */
export function setFormValues(fieldMap) {
    Object.entries(fieldMap).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value || '';
        }
    });
}

/**
 * Get form values as an object
 * @param {Array} fieldIds - Array of field IDs to extract
 * @returns {Object} Object with field IDs as keys and values
 */
export function getFormValues(fieldIds) {
    const values = {};
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            values[fieldId] = field.value.trim();
        }
    });
    return values;
}

/**
 * Create a debounced function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Format date and time for display
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time (default: true)
 * @returns {string} Formatted date string
 */
export function formatDateTime(dateString, includeTime = true) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleString('en-US', options);
}

/**
 * Format date for calendar display
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatCalendarDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
    return date < new Date();
}

/**
 * Generate a unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
export function getElement(id) {
    return document.getElementById(id);
}

/**
 * Safely query selector
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Element or null
 */
export function querySelector(selector) {
    return document.querySelector(selector);
}

/**
 * Safely query selector all
 * @param {string} selector - CSS selector
 * @returns {NodeList} NodeList of elements
 */
export function querySelectorAll(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Add event listener to element
 * @param {string} elementId - Element ID
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {boolean} Success status
 */
export function addEvent(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(event, handler);
        return true;
    }
    return false;
}

/**
 * Show/hide an element
 * @param {string} elementId - Element ID
 * @param {boolean} show - Whether to show or hide
 */
export function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * Add a CSS class to an element
 * @param {string} elementId - Element ID
 * @param {string} className - Class name to add
 */
export function addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove a CSS class from an element
 * @param {string} elementId - Element ID
 * @param {string} className - Class name to remove
 */
export function removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle a CSS class on an element
 * @param {string} elementId - Element ID
 * @param {string} className - Class name to toggle
 */
export function toggleClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Set inner HTML of an element safely
 * @param {string} elementId - Element ID
 * @param {string} html - HTML content
 */
export function setHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Set text content of an element
 * @param {string} elementId - Element ID
 * @param {string} text - Text content
 */
export function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
export function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @returns {boolean} User confirmation result
 */
export function confirm(message) {
    return window.confirm(message);
}

/**
 * Download data as JSON file
 * @param {Object} data - Data to download
 * @param {string} filename - Filename for download
 */
export function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Scroll element into view smoothly
 * @param {string} elementId - Element ID
 */
export function scrollIntoView(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Handles UI components like migration banners
 */

/**
 * Show a migration success banner
 * @param {number} fromVersion - The version migrated from
 * @param {number} toVersion - The version migrated to
 */
function showMigrationBanner(fromVersion, toVersion) {
    const bannerKey = `inkmanager_migration_banner_dismissed_v${toVersion}`;
    
    // Check if banner was already dismissed for this version
    if (localStorage.getItem(bannerKey) === 'true') {
        console.log(`Migration banner for v${toVersion} already dismissed`);
        return;
    }
    
    // Create banner element
    const banner = document.createElement('div');
    banner.id = 'migrationBanner';
    banner.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 90%;
        animation: slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        font-family: 'Roboto', sans-serif;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('migrationBannerStyles')) {
        const style = document.createElement('style');
        style.id = 'migrationBannerStyles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Banner content
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <i class="fas fa-check-circle" style="font-size: 24px;"></i>
            <div>
                <div style="font-weight: 500; font-size: 15px;">
                    Data Upgraded Successfully
                </div>
                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">
                    Your data has been upgraded to version ${toVersion}
                </div>
            </div>
        </div>
        <button id="dismissMigrationBanner" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.3s;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
           onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
            Dismiss
        </button>
    `;
    
    // Add to page
    document.body.appendChild(banner);
    
    // Handle dismiss
    const dismissBtn = document.getElementById('dismissMigrationBanner');
    dismissBtn.addEventListener('click', () => {
        // Save dismissal state
        localStorage.setItem(bannerKey, 'true');
        
        // Animate out
        banner.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 300);
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (banner.parentNode) {
            dismissBtn.click();
        }
    }, 10000);
}

// Export functions for use in the app
if (typeof window !== 'undefined') {
    window.InkManagerUI = {
        showMigrationBanner
    };
}
