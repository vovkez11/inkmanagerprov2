/**
 * InkManager Pro - Analytics Module
 * Handles dashboard statistics and analytics calculations
 */

/**
 * Get upcoming sessions
 * @param {Array} sessions - All sessions
 * @returns {Array} Upcoming sessions
 */
export function getUpcomingSessions(sessions) {
    const now = new Date();
    return sessions.filter(s => new Date(s.dateTime) > now);
}

/**
 * Get today's sessions
 * @param {Array} sessions - All sessions
 * @returns {Array} Today's sessions sorted by time
 */
export function getTodaysSessions(sessions) {
    const today = new Date().toDateString();
    return sessions
        .filter(s => new Date(s.dateTime).toDateString() === today)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
}

/**
 * Calculate monthly revenue
 * @param {Array} sessions - All sessions
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {number} Total revenue for the month
 */
export function getMonthlyRevenue(sessions, month, year) {
    return sessions
        .filter(s => {
            const sessionDate = new Date(s.dateTime);
            return sessionDate.getMonth() === month && 
                   sessionDate.getFullYear() === year;
        })
        .reduce((sum, session) => sum + (session.price || 0), 0);
}

/**
 * Calculate current month revenue
 * @param {Array} sessions - All sessions
 * @returns {number} Total revenue for current month
 */
export function getCurrentMonthRevenue(sessions) {
    const now = new Date();
    return getMonthlyRevenue(sessions, now.getMonth(), now.getFullYear());
}

/**
 * Get dashboard statistics
 * @param {Object} data - {clients, sessions, inventory}
 * @returns {Object} Dashboard stats
 */
export function getDashboardStats(data) {
    const { clients, sessions, inventory } = data;
    
    return {
        totalClients: clients.length,
        upcomingSessions: getUpcomingSessions(sessions).length,
        monthlyRevenue: getCurrentMonthRevenue(sessions),
        lowStockItems: inventory.filter(item => item.qty <= item.alert).length,
        todaysSessions: getTodaysSessions(sessions)
    };
}

/**
 * Get sessions by status
 * @param {Array} sessions - All sessions
 * @param {string} status - Session status
 * @returns {Array} Filtered sessions
 */
export function getSessionsByStatus(sessions, status) {
    return sessions.filter(s => s.status === status);
}

/**
 * Get completed sessions count
 * @param {Array} sessions - All sessions
 * @returns {number} Count of completed sessions
 */
export function getCompletedSessionsCount(sessions) {
    return getSessionsByStatus(sessions, 'completed').length;
}

/**
 * Calculate total revenue
 * @param {Array} sessions - All sessions
 * @returns {number} Total revenue from all sessions
 */
export function getTotalRevenue(sessions) {
    return sessions.reduce((sum, session) => sum + (session.price || 0), 0);
}

/**
 * Get average session price
 * @param {Array} sessions - All sessions
 * @returns {number} Average price
 */
export function getAverageSessionPrice(sessions) {
    if (sessions.length === 0) return 0;
    return getTotalRevenue(sessions) / sessions.length;
}

/**
 * Get client retention rate (clients with multiple sessions)
 * @param {Array} clients - All clients
 * @param {Array} sessions - All sessions
 * @returns {number} Retention rate (0-100)
 */
export function getClientRetentionRate(clients, sessions) {
    if (clients.length === 0) return 0;
    
    const clientSessionCounts = {};
    sessions.forEach(session => {
        clientSessionCounts[session.clientId] = (clientSessionCounts[session.clientId] || 0) + 1;
    });
    
    const returningClients = Object.values(clientSessionCounts).filter(count => count > 1).length;
    return (returningClients / clients.length) * 100;
}

/**
 * Get revenue by period
 * @param {Array} sessions - All sessions
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Revenue for the period
 */
export function getRevenueByPeriod(sessions, startDate, endDate) {
    return sessions
        .filter(s => {
            const sessionDate = new Date(s.dateTime);
            return sessionDate >= startDate && sessionDate <= endDate;
        })
        .reduce((sum, session) => sum + (session.price || 0), 0);
}

/**
 * Get busiest day of week
 * @param {Array} sessions - All sessions
 * @returns {Object} {day: number (0-6), count: number}
 */
export function getBusiestDay(sessions) {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    
    sessions.forEach(session => {
        const day = new Date(session.dateTime).getDay();
        dayCounts[day]++;
    });
    
    const maxCount = Math.max(...dayCounts);
    const busiestDay = dayCounts.indexOf(maxCount);
    
    return { day: busiestDay, count: maxCount };
}

/**
 * Get top clients by revenue
 * @param {Array} clients - All clients
 * @param {Array} sessions - All sessions
 * @param {number} limit - Number of top clients to return
 * @returns {Array} Top clients with revenue
 */
export function getTopClientsByRevenue(clients, sessions, limit = 5) {
    const clientRevenue = {};
    
    sessions.forEach(session => {
        if (session.clientId) {
            clientRevenue[session.clientId] = (clientRevenue[session.clientId] || 0) + (session.price || 0);
        }
    });
    
    return Object.entries(clientRevenue)
        .map(([clientId, revenue]) => {
            const client = clients.find(c => c.id === clientId);
            return { client, revenue };
        })
        .filter(item => item.client)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
}

/**
 * Get session completion rate
 * @param {Array} sessions - All sessions
 * @returns {number} Completion rate (0-100)
 */
export function getSessionCompletionRate(sessions) {
    if (sessions.length === 0) return 0;
    const completed = getCompletedSessionsCount(sessions);
    return (completed / sessions.length) * 100;
}
