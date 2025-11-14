/**
 * InkManager Pro - Clients Module
 * Handles client CRUD operations and view rendering
 */

import { showToast, showModal, hideModal, resetForm, setFormValues } from './ui.js';
import { saveClients } from './storage.js';

/**
 * Open client modal for creating or editing
 * @param {Array} clients - Current clients array
 * @param {string} clientId - Client ID to edit (null for new client)
 * @param {Function} translate - Translation function
 * @returns {string} clientId being edited or null
 */
export function openClientModal(clients, clientId = null, translate) {
    resetForm('clientForm');
    
    if (clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setFormValues({
                clientName: client.name,
                clientPhone: client.phone,
                clientEmail: client.email,
                clientBirthDate: client.birthDate,
                clientSkinType: client.skinType,
                clientEmergencyContact: client.emergencyContact,
                clientNotes: client.notes
            });
            
            document.getElementById('clientModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> ' + translate('edit_client');
            document.getElementById('saveClientBtn').innerHTML = '<i class="fas fa-save"></i> ' + translate('update_client');
        }
    } else {
        document.getElementById('clientModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> ' + translate('create_new_client');
        document.getElementById('saveClientBtn').innerHTML = '<i class="fas fa-save"></i> ' + translate('save_client');
        clientId = null;
    }
    
    showModal('clientModal');
    return clientId;
}

/**
 * Close client modal
 */
export function closeClientModal() {
    hideModal('clientModal');
}

/**
 * Save client (create or update)
 * @param {Array} clients - Current clients array
 * @param {string} editingClientId - ID of client being edited (null for new)
 * @param {Function} translate - Translation function
 * @returns {Object} { success: boolean, clients: Array, message: string }
 */
export function saveClient(clients, editingClientId, translate) {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const birthDate = document.getElementById('clientBirthDate').value;
    const skinType = document.getElementById('clientSkinType').value;
    const emergencyContact = document.getElementById('clientEmergencyContact').value.trim();
    const notes = document.getElementById('clientNotes').value.trim();
    
    if (!name) {
        showToast('⚠️ ' + (translate('full_name') || 'Full name') + ' is required!');
        return { success: false, clients, message: 'Name required' };
    }
    
    const updatedClients = [...clients];
    
    if (editingClientId) {
        // Update existing client
        const index = updatedClients.findIndex(c => c.id === editingClientId);
        if (index !== -1) {
            updatedClients[index] = {
                ...updatedClients[index],
                name,
                phone,
                email,
                birthDate,
                skinType,
                emergencyContact,
                notes,
                updatedAt: new Date().toISOString()
            };
            
            return {
                success: true,
                clients: updatedClients,
                message: '✅ Client updated successfully!'
            };
        }
    } else {
        // Create new client
        const newClient = {
            id: 'client-' + Date.now(),
            name,
            phone,
            email,
            birthDate,
            skinType,
            emergencyContact,
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        updatedClients.push(newClient);
        
        return {
            success: true,
            clients: updatedClients,
            message: '✅ Client profile created successfully!'
        };
    }
    
    return { success: false, clients, message: 'Error saving client' };
}

/**
 * Delete a client
 * @param {Array} clients - Current clients array
 * @param {string} clientId - ID of client to delete
 * @param {Function} translate - Translation function
 * @returns {Object} { success: boolean, clients: Array, message: string }
 */
export function deleteClient(clients, clientId, translate) {
    const clientName = getClientName(clients, clientId);
    if (confirm(`Are you sure you want to delete ${clientName}?`)) {
        const updatedClients = clients.filter(c => c.id !== clientId);
        
        return {
            success: true,
            clients: updatedClients,
            message: `✅ ${clientName} removed`
        };
    }
    
    return { success: false, clients, message: 'Delete cancelled' };
}

/**
 * Get client name by ID
 * @param {Array} clients - Clients array
 * @param {string} clientId - Client ID
 * @returns {string} Client name or 'Unknown'
 */
export function getClientName(clients, clientId) {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
}

/**
 * Search/filter clients
 * @param {Array} clients - All clients
 * @param {string} query - Search query
 * @returns {Array} Filtered clients
 */
export function searchClients(clients, query) {
    if (!query || !query.trim()) {
        return clients;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        (client.phone && client.phone.includes(searchTerm)) ||
        (client.email && client.email.toLowerCase().includes(searchTerm))
    );
}

/**
 * Render clients list HTML
 * @param {Array} clients - Clients to render
 * @param {Array} sessions - All sessions (for stats)
 * @param {Function} translate - Translation function
 * @param {Function} formatCurrency - Currency formatting function
 * @returns {string} HTML string
 */
export function renderClientsList(clients, sessions, translate, formatCurrency) {
    if (clients.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>${translate('no_clients_yet')}</h3>
                <p>${translate('build_client_database')}</p>
                <button class="btn btn-primary" id="addFirstClient">
                    <i class="fas fa-user-plus"></i> ${translate('add_first_client')}
                </button>
            </div>
        `;
    }
    
    return clients.map(client => {
        // Calculate client stats
        const clientSessions = sessions.filter(s => s.clientId === client.id);
        const totalSessions = clientSessions.length;
        const totalRevenue = clientSessions.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const lastSession = clientSessions.length > 0 
            ? clientSessions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0]
            : null;
        
        return `
            <div class="client-card">
                <div class="client-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="client-info">
                    <h3>${client.name}</h3>
                    <div class="client-contact">
                        ${client.phone ? `<span><i class="fas fa-phone"></i> ${client.phone}</span>` : ''}
                        ${client.email ? `<span><i class="fas fa-envelope"></i> ${client.email}</span>` : ''}
                    </div>
                    <div class="client-stats">
                        <span><i class="fas fa-calendar-check"></i> ${totalSessions} ${translate('total_sessions')}</span>
                        ${lastSession ? `<span><i class="fas fa-clock"></i> ${translate('last_visit')}: ${new Date(lastSession.dateTime).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="client-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.app.openClientModal('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteClient('${client.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
