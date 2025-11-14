/**
 * InkManager Pro - UI Module
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
