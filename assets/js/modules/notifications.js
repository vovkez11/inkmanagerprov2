/**
 * InkManager Pro - Notifications Module
 * Handles browser notifications for session reminders
 */

/**
 * Check if notifications are supported
 * @returns {boolean} True if notifications are supported
 */
export function isNotificationSupported() {
    return 'Notification' in window;
}

/**
 * Get current notification permission status
 * @returns {string} Permission status ('granted', 'denied', 'default')
 */
export function getPermissionStatus() {
    if (!isNotificationSupported()) {
        return 'denied';
    }
    return Notification.permission;
}

/**
 * Request notification permission
 * @returns {Promise<string>} Permission status after request
 */
export async function requestPermission() {
    if (!isNotificationSupported()) {
        return 'denied';
    }
    
    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
}

/**
 * Show a browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} Notification object or null
 */
export function showNotification(title, options = {}) {
    if (!isNotificationSupported() || getPermissionStatus() !== 'granted') {
        return null;
    }
    
    const defaultOptions = {
        icon: '/inkmanagerprov2/icons/icon-192.png',
        badge: '/inkmanagerprov2/icons/icon-128.png',
        vibrate: [200, 100, 200],
        ...options
    };
    
    try {
        return new Notification(title, defaultOptions);
    } catch (error) {
        console.error('Error showing notification:', error);
        return null;
    }
}

/**
 * Show session reminder notification
 * @param {Object} session - Session object
 * @param {Object} client - Client object
 * @param {number} hoursUntil - Hours until session
 * @returns {Notification|null} Notification object or null
 */
export function showSessionReminder(session, client, hoursUntil) {
    const clientName = client ? client.name : 'Client';
    const sessionTime = new Date(session.dateTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const title = `📅 Upcoming Session Reminder`;
    const body = `Session with ${clientName} in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''} at ${sessionTime}`;
    
    return showNotification(title, {
        body,
        tag: `session-${session.id}`,
        requireInteraction: false,
        data: {
            sessionId: session.id,
            clientId: session.clientId,
            dateTime: session.dateTime
        }
    });
}

/**
 * Check for upcoming sessions that need reminders
 * @param {Array} sessions - All sessions
 * @param {Array} clients - All clients
 * @param {number} reminderHours - Hours before session to send reminder
 * @param {Set} sentNotifications - Set of session IDs that already received notifications
 * @returns {Array} Sessions that need reminders
 */
export function getSessionsNeedingReminders(sessions, clients, reminderHours, sentNotifications) {
    const now = new Date();
    const reminderWindow = reminderHours * 60 * 60 * 1000; // Convert hours to milliseconds
    
    return sessions.filter(session => {
        // Skip if already sent notification for this session
        if (sentNotifications.has(session.id)) {
            return false;
        }
        
        const sessionTime = new Date(session.dateTime);
        const timeDiff = sessionTime - now;
        
        // Session is within the reminder window and hasn't passed yet
        return timeDiff > 0 && timeDiff <= reminderWindow;
    });
}

/**
 * Send reminders for upcoming sessions
 * @param {Array} sessions - All sessions
 * @param {Array} clients - All clients
 * @param {number} reminderHours - Hours before session to send reminder
 * @param {Set} sentNotifications - Set of session IDs that already received notifications
 * @returns {Array} Session IDs that were sent notifications
 */
export function sendSessionReminders(sessions, clients, reminderHours, sentNotifications) {
    if (getPermissionStatus() !== 'granted') {
        return [];
    }
    
    const sessionsToRemind = getSessionsNeedingReminders(sessions, clients, reminderHours, sentNotifications);
    const notifiedIds = [];
    
    sessionsToRemind.forEach(session => {
        const client = clients.find(c => c.id === session.clientId);
        const sessionTime = new Date(session.dateTime);
        const hoursUntil = Math.ceil((sessionTime - new Date()) / (60 * 60 * 1000));
        
        const notification = showSessionReminder(session, client, hoursUntil);
        
        if (notification) {
            notifiedIds.push(session.id);
            sentNotifications.add(session.id);
            
            // Auto-close notification after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        }
    });
    
    return notifiedIds;
}

/**
 * Show test notification
 * @returns {Notification|null} Notification object or null
 */
export function showTestNotification() {
    return showNotification('🔔 Test Notification', {
        body: 'Notifications are working correctly! You will receive reminders for upcoming sessions.',
        requireInteraction: false
    });
}

/**
 * Schedule periodic notification checks
 * @param {Function} checkCallback - Callback to run on each check
 * @param {number} intervalMinutes - Check interval in minutes
 * @returns {number} Interval ID
 */
export function scheduleNotificationChecks(checkCallback, intervalMinutes = 5) {
    // Run immediately
    checkCallback();
    
    // Then run at intervals
    return setInterval(checkCallback, intervalMinutes * 60 * 1000);
}

/**
 * Clean up old sent notifications from tracking set
 * @param {Set} sentNotifications - Set of session IDs
 * @param {Array} sessions - Current sessions
 * @returns {Set} Cleaned up set
 */
export function cleanupSentNotifications(sentNotifications, sessions) {
    const sessionIds = new Set(sessions.map(s => s.id));
    
    // Remove notifications for sessions that no longer exist or have passed
    const now = new Date();
    for (const sessionId of sentNotifications) {
        const session = sessions.find(s => s.id === sessionId);
        if (!session || new Date(session.dateTime) < now) {
            sentNotifications.delete(sessionId);
        }
    }
    
    return sentNotifications;
}

/**
 * Get notification settings summary
 * @param {boolean} enabled - Whether notifications are enabled
 * @param {number} reminderHours - Reminder hours setting
 * @returns {Object} Settings summary
 */
export function getNotificationSettings(enabled, reminderHours) {
    return {
        enabled,
        reminderHours,
        permission: getPermissionStatus(),
        supported: isNotificationSupported(),
        canSend: enabled && isNotificationSupported() && getPermissionStatus() === 'granted'
    };
}
