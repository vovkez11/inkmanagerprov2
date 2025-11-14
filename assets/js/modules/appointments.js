/**
 * InkManager Pro - Appointments/Sessions Module
 * Handles session CRUD operations and view rendering
 */

import { showToast, showModal, hideModal, resetForm, setFormValues } from './ui.js';
import { saveSessions } from './storage.js';
import { getClientName } from './clients.js';

/**
 * Open session modal for creating or editing
 * @param {Array} sessions - Current sessions array
 * @param {Array} clients - All clients
 * @param {Array} inventory - All inventory items
 * @param {string} sessionId - Session ID to edit (null for new)
 * @param {Function} translate - Translation function
 * @returns {Object} { sessionId: string, materials: Array }
 */
export function openSessionModal(sessions, clients, inventory, sessionId = null, translate) {
    resetForm('sessionForm');
    
    // Populate client dropdown
    const clientSelect = document.getElementById('sessionClient');
    if (clientSelect) {
        clientSelect.innerHTML = `<option value="">${translate('select_client')}</option>` +
            clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    
    // Populate material item dropdown
    const materialSelect = document.getElementById('materialItem');
    if (materialSelect) {
        materialSelect.innerHTML = `<option value="">${translate('select_item')}</option>` +
            inventory.map(item => `<option value="${item.id}">${item.name} (${item.quantity})</option>`).join('');
    }
    
    let currentMaterials = [];
    
    if (sessionId) {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setFormValues({
                sessionClient: session.clientId,
                sessionTitle: session.title,
                sessionDateTime: session.dateTime,
                sessionDuration: session.duration,
                sessionPrice: session.price,
                sessionNotes: session.notes
            });
            
            currentMaterials = session.materials || [];
            
            document.getElementById('sessionModalTitle').innerHTML = '<i class="fas fa-edit"></i> ' + translate('edit_session');
            document.getElementById('saveSessionBtn').innerHTML = '<i class="fas fa-save"></i> ' + translate('update_session');
        }
    } else {
        // Set default date/time to now
        const now = new Date();
        const dateTimeLocal = now.toISOString().slice(0, 16);
        document.getElementById('sessionDateTime').value = dateTimeLocal;
        document.getElementById('sessionDuration').value = '2';
        
        document.getElementById('sessionModalTitle').innerHTML = '<i class="fas fa-plus"></i> ' + translate('schedule_session');
        document.getElementById('saveSessionBtn').innerHTML = '<i class="fas fa-save"></i> ' + translate('save_session');
        sessionId = null;
    }
    
    showModal('sessionModal');
    return { sessionId, materials: currentMaterials };
}

/**
 * Close session modal
 */
export function closeSessionModal() {
    hideModal('sessionModal');
}

/**
 * Save session (create or update)
 * @param {Array} sessions - Current sessions array
 * @param {string} editingSessionId - ID of session being edited (null for new)
 * @param {Array} materials - Materials used in session
 * @param {Function} translate - Translation function
 * @returns {Object} { success: boolean, sessions: Array, message: string }
 */
export function saveSession(sessions, editingSessionId, materials, translate) {
    const clientId = document.getElementById('sessionClient').value;
    const title = document.getElementById('sessionTitle').value.trim();
    const dateTime = document.getElementById('sessionDateTime').value;
    const duration = document.getElementById('sessionDuration').value;
    const price = document.getElementById('sessionPrice').value;
    const notes = document.getElementById('sessionNotes').value.trim();
    
    if (!clientId) {
        showToast('⚠️ ' + (translate('client') || 'Client') + ' is required!');
        return { success: false, sessions, message: 'Client required' };
    }
    
    if (!title) {
        showToast('⚠️ ' + (translate('session_title') || 'Session title') + ' is required!');
        return { success: false, sessions, message: 'Title required' };
    }
    
    const updatedSessions = [...sessions];
    
    if (editingSessionId) {
        // Update existing session
        const index = updatedSessions.findIndex(s => s.id === editingSessionId);
        if (index !== -1) {
            updatedSessions[index] = {
                ...updatedSessions[index],
                clientId,
                title,
                dateTime,
                duration: parseFloat(duration) || 0,
                price: parseFloat(price) || 0,
                materials: materials || [],
                notes,
                updatedAt: new Date().toISOString()
            };
            
            return {
                success: true,
                sessions: updatedSessions,
                message: '✅ Session updated successfully!'
            };
        }
    } else {
        // Create new session
        const newSession = {
            id: 'session-' + Date.now(),
            clientId,
            title,
            dateTime,
            duration: parseFloat(duration) || 0,
            price: parseFloat(price) || 0,
            materials: materials || [],
            notes,
            status: 'upcoming',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        updatedSessions.push(newSession);
        
        return {
            success: true,
            sessions: updatedSessions,
            message: '✅ Session scheduled successfully!'
        };
    }
    
    return { success: false, sessions, message: 'Error saving session' };
}

/**
 * Delete a session
 * @param {Array} sessions - Current sessions array
 * @param {string} sessionId - ID of session to delete
 * @param {Function} translate - Translation function
 * @returns {Object} { success: boolean, sessions: Array, message: string }
 */
export function deleteSession(sessions, sessionId, translate) {
    if (confirm('Are you sure you want to delete this session?')) {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        
        return {
            success: true,
            sessions: updatedSessions,
            message: '✅ Session deleted'
        };
    }
    
    return { success: false, sessions, message: 'Delete cancelled' };
}

/**
 * Get sessions for a specific date
 * @param {Array} sessions - All sessions
 * @param {Date} date - Date to filter by
 * @returns {Array} Sessions on that date
 */
export function getSessionsForDate(sessions, date) {
    return sessions.filter(session => {
        const sessionDate = new Date(session.dateTime);
        return sessionDate.getDate() === date.getDate() &&
               sessionDate.getMonth() === date.getMonth() &&
               sessionDate.getFullYear() === date.getFullYear();
    });
}

/**
 * Get upcoming sessions
 * @param {Array} sessions - All sessions
 * @returns {Array} Upcoming sessions sorted by date
 */
export function getUpcomingSessions(sessions) {
    const now = new Date();
    return sessions
        .filter(s => new Date(s.dateTime) >= now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
}

/**
 * Render sessions list HTML
 * @param {Array} sessions - Sessions to render
 * @param {Array} clients - All clients (for names)
 * @param {Function} translate - Translation function
 * @param {Function} formatCurrency - Currency formatting function
 * @returns {string} HTML string
 */
export function renderSessionsList(sessions, clients, translate, formatCurrency) {
    if (sessions.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-calendar-plus"></i>
                <h3>${translate('no_sessions_scheduled')}</h3>
                <p>${translate('schedule_first_session')}</p>
                <button class="btn btn-primary" id="addFirstSession">
                    <i class="fas fa-plus"></i> ${translate('create_first_session')}
                </button>
            </div>
        `;
    }
    
    return sessions.map(session => {
        const client = clients.find(c => c.id === session.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        const sessionDate = new Date(session.dateTime);
        const now = new Date();
        const isToday = sessionDate.toDateString() === now.toDateString();
        const isPast = sessionDate < now && !isToday;
        
        let statusBadge = '';
        if (isPast) {
            statusBadge = `<span class="badge badge-success">${translate('session_completed')}</span>`;
        } else if (isToday) {
            statusBadge = `<span class="badge badge-warning">${translate('session_today')}</span>`;
        } else {
            statusBadge = `<span class="badge badge-primary">${translate('session_upcoming')}</span>`;
        }
        
        return `
            <div class="session-card">
                <div class="session-time">
                    <div class="session-date">${sessionDate.toLocaleDateString()}</div>
                    <div class="session-hour">${sessionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div class="session-details">
                    <h3>${session.title}</h3>
                    <p><i class="fas fa-user"></i> ${clientName}</p>
                    <p><i class="fas fa-clock"></i> ${session.duration} hours</p>
                    <p><i class="fas fa-dollar-sign"></i> ${formatCurrency(session.price)}</p>
                    ${statusBadge}
                </div>
                <div class="session-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.app.openSessionModal('${session.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteSession('${session.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Add material to session
 * @param {Array} currentMaterials - Current materials list
 * @param {string} itemId - Inventory item ID
 * @param {number} quantity - Quantity used
 * @param {Array} inventory - All inventory items
 * @returns {Array} Updated materials list
 */
export function addMaterialToSession(currentMaterials, itemId, quantity, inventory) {
    if (!itemId || !quantity || quantity <= 0) {
        return currentMaterials;
    }
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) {
        return currentMaterials;
    }
    
    const updatedMaterials = [...currentMaterials];
    updatedMaterials.push({
        itemId,
        itemName: item.name,
        quantity: parseInt(quantity),
        addedAt: new Date().toISOString()
    });
    
    return updatedMaterials;
}

/**
 * Remove material from session
 * @param {Array} currentMaterials - Current materials list
 * @param {number} index - Index of material to remove
 * @returns {Array} Updated materials list
 */
export function removeMaterialFromSession(currentMaterials, index) {
    const updatedMaterials = [...currentMaterials];
    updatedMaterials.splice(index, 1);
    return updatedMaterials;
}
