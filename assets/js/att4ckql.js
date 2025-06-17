/*!
 * ATT4CKQL Core JavaScript v2.0
 * Enhanced KQL Queries for Microsoft Sentinel
 * Consolidated from main.js + aws-script.js
 * Created: 2025
 */

// =====================================
// NAMESPACE & CONFIGURATION
// =====================================
window.ATT4CKQL = window.ATT4CKQL || {
    version: '2.0.0',
    config: {
        baseUrl: window.siteBaseUrl || '',
        apiEndpoint: 'https://api.github.com/repos/realnamesareboring/ATT4CKQL',
        repoOwner: 'realnamesareboring',
        repoName: 'ATT4CKQL',
        debug: false
    },
    
    // Platform configurations for content paths
    platforms: {
        'aws': {
            name: 'Amazon Web Services',
            queryPath: '/Amazon Web Services/Queries/',
            logsPath: '/Amazon Web Services/logs/',
            explainedPath: '/Amazon Web Services/explained/'
        },
        'azure': {
            name: 'Azure',
            queryPath: '/Azure/Queries/',
            logsPath: '/Azure/logs/',
            explainedPath: '/Azure/explained/'
        },
        'gcp': {
            name: 'Google Cloud Platform',
            queryPath: '/Google Cloud Platform/Queries/',
            logsPath: '/Google Cloud Platform/logs/',
            explainedPath: '/Google Cloud Platform/explained/'
        },
        'entraid': {
            name: 'Entra ID',
            queryPath: '/Entra ID/Queries/',
            logsPath: '/Entra ID/logs/',
            explainedPath: '/Entra ID/explained/'
        },
        'office365': {
            name: 'Office 365',
            queryPath: '/Office 365/Queries/',
            logsPath: '/Office 365/logs/',
            explainedPath: '/Office 365/explained/'
        },
        'active-directory': {
            name: 'Active Directory',
            queryPath: '/Active Directory/Queries/',
            logsPath: '/Active Directory/logs/',
            explainedPath: '/Active Directory/explained/'
        }
    },
    
    // Query counts for index page
    queryCounts: {
        'active-directory': 42,
        'aws': 15,
        'gcp': 28,
        'azure': 47,
        'entraid': 39,
        'office365': 31,
        'defender': 38
    },
    
    // Utility functions
    utils: {
        log: function(message, level = 'info') {
            if (ATT4CKQL.config.debug || level === 'error') {
                console[level](`[ATT4CKQL] ${message}`);
            }
        },
        
        getBasePath: function(path) {
            return ATT4CKQL.config.baseUrl + path;
        },
        
        escapeHtml: function(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        
        getCurrentPlatform: function() {
            const path = window.location.pathname;
            for (const [key, platform] of Object.entries(ATT4CKQL.platforms)) {
                if (path.includes(`/platforms/${key}/`)) {
                    return key;
                }
            }
            return null;
        },
        
        formatTimestamp: function(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        }
    },
    
    // Initialize all modules
    init: function() {
        this.utils.log('Initializing ATT4CKQL application...');
        
        // Initialize core modules
        this.ThemeManager.init();
        this.ModalManager.init();
        this.QueryManager.init();
        
        // Initialize page-specific modules
        if (document.querySelector('.source-link')) {
            this.QueryCounter.init();
        }
        
        this.utils.log('ATT4CKQL application initialized successfully');
    }
};

// =====================================
// THEME MANAGEMENT MODULE
// =====================================
ATT4CKQL.ThemeManager = {
    currentTheme: 'defender',
    
    init: function() {
        this.loadSavedTheme();
        this.bindEvents();
        ATT4CKQL.utils.log('Theme Manager initialized');
    },
    
    setTheme: function(theme) {
        this.currentTheme = theme;
        
        if (theme === 'attacker') {
            document.body.classList.add('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'attacker');
            ATT4CKQL.utils.log('Theme set to attacker');
        } else {
            document.body.classList.remove('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'defender');
            ATT4CKQL.utils.log('Theme set to defender');
        }
        
        // Dispatch theme change event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
    },
    
    getCurrentTheme: function() {
        return this.currentTheme;
    },
    
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'attacker' ? 'defender' : 'attacker';
        this.setTheme(newTheme);
    },
    
    loadSavedTheme: function() {
        const saved = sessionStorage.getItem('att4ckql-theme');
        if (saved) {
            this.setTheme(saved);
        }
    },
    
    bindEvents: function() {
        // Theme toggle button
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Theme chooser buttons
        const defenderBtn = document.querySelector('.defender-button');
        const attackerBtn = document.querySelector('.attacker-button');
        
        if (defenderBtn) {
            defenderBtn.addEventListener('click', () => {
                this.setTheme('defender');
                this.hideThemeChooser();
            });
        }
        
        if (attackerBtn) {
            attackerBtn.addEventListener('click', () => {
                this.setTheme('attacker');
                this.hideThemeChooser();
            });
        }
    },
    
    hideThemeChooser: function() {
        const chooser = document.getElementById('theme-chooser');
        const mainContent = document.getElementById('main-content');
        
        if (chooser) chooser.style.display = 'none';
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
        }
    }
};

// =====================================
// MODAL MANAGEMENT MODULE
// =====================================
ATT4CKQL.ModalManager = {
    activeModal: null,
    
    init: function() {
        this.bindGlobalEvents();
        ATT4CKQL.utils.log('Modal Manager initialized');
    },
    
    open: function(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            ATT4CKQL.utils.log(`Modal ${modalId} not found`, 'error');
            return;
        }
        
        this.activeModal = modalId;
        
        // Show loading state first
        if (options.loadContent) {
            this.showLoading(modal, modalId);
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Load content if specified
        if (options.loadContent) {
            this.loadContent(modalId, options);
        }
        
        ATT4CKQL.utils.log(`Modal ${modalId} opened`);
    },
    
    close: function(modalId) {
        const modal = modalId ? document.getElementById(modalId) : 
                      document.querySelector('.modal[style*="display: block"]');
        
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.activeModal = null;
            ATT4CKQL.utils.log(`Modal ${modalId || 'active'} closed`);
        }
    },
    
    showLoading: function(modal, modalId) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                <div class="modal-loading">Loading content...</div>
            </div>
        `;
        modal.style.display = 'block';
    },
    
    loadContent: async function(modalId, options) {
        const modal = document.getElementById(modalId);
        const platform = options.platform || ATT4CKQL.utils.getCurrentPlatform() || 'aws';
        const platformConfig = ATT4CKQL.platforms[platform];
        
        if (!platformConfig) {
            ATT4CKQL.utils.log(`Platform ${platform} not configured`, 'error');
            return;
        }
        
        let contentPath;
        
        // Determine content path based on type
        switch (options.type) {
            case 'query':
                contentPath = platformConfig.queryPath + (options.fileName || '');
                break;
            case 'logs':
                contentPath = platformConfig.logsPath + modalId + '.html';
                break;
            case 'explained':
                contentPath = platformConfig.explainedPath + modalId + '-explained.html';
                break;
            default:
                contentPath = options.contentPath || platformConfig.logsPath + modalId + '.html';
        }
        
        const fullPath = ATT4CKQL.utils.getBasePath(contentPath);
        
        try {
            const response = await fetch(fullPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            // Process content based on type
            if (options.type === 'query') {
                modal.innerHTML = this.createQueryModalContent(content, modalId, options.title || 'KQL Query');
                // Store content for copying
                window[`${modalId}_content`] = content.replace(/^---[\s\S]*?---\s*/m, '').trim();
            } else {
                modal.innerHTML = this.processModalContent(content, modalId, options);
            }
            
            ATT4CKQL.utils.log(`Content loaded for modal ${modalId}`);
            
        } catch (error) {
            modal.innerHTML = this.createErrorContent(error.message, modalId, fullPath);
            ATT4CKQL.utils.log(`Failed to load content for modal ${modalId}: ${error.message}`, 'error');
        }
    },
    
    createQueryModalContent: function(queryContent, modalId, title) {
        const cleanQuery = ATT4CKQL.utils.escapeHtml(queryContent.replace(/^---[\s\S]*?---\s*/m, '').trim());
        
        return `
            <div class="modal-content">
                <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <div class="modal-actions">
                        <button onclick="ATT4CKQL.QueryManager.copyToClipboard('${modalId}')" class="copy-btn">📋 Copy Query</button>
                        <button onclick="ATT4CKQL.QueryManager.scrollToExplanation('${modalId}')" class="explain-btn">📖 Explain</button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="query-container">
                        <div class="shell-header">
                            <div class="shell-controls">
                                <span class="shell-control close"></span>
                                <span class="shell-control minimize"></span>
                                <span class="shell-control maximize"></span>
                            </div>
                            <div class="shell-title">${title}</div>
                        </div>
                        <div class="shell-content">
                            <pre class="kql-query"><code>${cleanQuery}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    processModalContent: function(content, modalId, options = {}) {
        // Remove Jekyll front matter if present
        let processedContent = content.replace(/^---[\s\S]*?---\s*/m, '');
        
        // Ensure proper modal structure
        if (!processedContent.includes('modal-content')) {
            processedContent = `
                <div class="modal-content">
                    <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                    <div class="modal-header">
                        <div class="modal-title">${options.title || 'Content'}</div>
                    </div>
                    <div class="modal-body">
                        ${processedContent}
                    </div>
                </div>
            `;
        } else {
            // Ensure close button works with consolidated functions
            processedContent = processedContent.replace(
                /onclick="closeModal\('([^']+)'\)"/g,
                `onclick="ATT4CKQL.ModalManager.close('${modalId}')"`
            );
        }
        
        // Add table wrapper for better scrolling
        if (processedContent.includes('log-table') && !processedContent.includes('table-wrapper')) {
            processedContent = processedContent.replace(
                /<table class="log-table"/g,
                '<div class="table-wrapper"><table class="log-table"'
            );
            processedContent = processedContent.replace(
                /<\/table>/g,
                '</table></div>'
            );
        }
        
        return processedContent;
    },
    
    createErrorContent: function(error, modalId, path) {
        return `
            <div class="modal-content">
                <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Content</div>
                </div>
                <div class="modal-body">
                    <p><strong>Error:</strong> ${error}</p>
                    <p><strong>Path:</strong> ${path}</p>
                    <p>Please check that the file exists and try again.</p>
                </div>
            </div>
        `;
    },
    
    bindGlobalEvents: function() {
        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
        
        // Click outside closes modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.close();
            }
        });
    }
};

// =====================================
// QUERY MANAGEMENT MODULE
// =====================================
ATT4CKQL.QueryManager = {
    init: function() {
        this.bindEvents();
        ATT4CKQL.utils.log('Query Manager initialized');
    },
    
    copyToClipboard: async function(modalId) {
        const content = window[`${modalId}_content`];
        if (!content) {
            ATT4CKQL.utils.log(`No content found for ${modalId}`, 'error');
            this.showCopyFeedback('No content to copy', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(content);
            this.showCopyFeedback('Copied to clipboard!', 'success');
            ATT4CKQL.utils.log(`Query copied to clipboard from ${modalId}`);
        } catch (error) {
            this.fallbackCopy(content);
            ATT4CKQL.utils.log(`Fallback copy used for ${modalId}`, 'warn');
        }
    },
    
    fallbackCopy: function(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback('Copied to clipboard!', 'success');
        } catch (err) {
            this.showCopyFeedback('Copy failed. Please select and copy manually.', 'error');
        }
        
        document.body.removeChild(textArea);
    },
    
    showCopyFeedback: function(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.copy-notification');
        existing.forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `copy-notification copy-notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#107c10',
            error: '#d13438',
            warn: '#ff8c00',
            info: '#0078d4'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    },
    
    scrollToExplanation: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const explanationSelectors = [
            '#explanation-section',
            '.explanation',
            '.query-explanation',
            '.modal-explanation'
        ];
        
        let explanationElement = null;
        for (const selector of explanationSelectors) {
            explanationElement = modal.querySelector(selector);
            if (explanationElement) break;
        }
        
        if (explanationElement) {
            explanationElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            ATT4CKQL.utils.log(`Scrolled to explanation in ${modalId}`);
        } else {
            ATT4CKQL.utils.log(`No explanation section found in ${modalId}`, 'warn');
        }
    },
    
    bindEvents: function() {
        // Handle copy button clicks using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.copy-btn, .copy-btn *')) {
                const button = e.target.closest('.copy-btn');
                const modal = button.closest('.modal');
                if (modal) {
                    this.copyToClipboard(modal.id);
                }
            }
        });
    }
};

// =====================================
// QUERY COUNTER MODULE (from main.js)
// =====================================
ATT4CKQL.QueryCounter = {
    init: function() {
        this.updateCounts();
        this.bindCountUpdates();
        ATT4CKQL.utils.log('Query Counter initialized');
    },
    
    updateCounts: function() {
        const sourceLinks = document.querySelectorAll('.source-link[data-source]');
        let totalCount = 0;
        
        sourceLinks.forEach(link => {
            const sourceId = link.getAttribute('data-source');
            const countCell = link.closest('tr').querySelector('.query-count');
            
            if (countCell && ATT4CKQL.queryCounts[sourceId]) {
                const count = ATT4CKQL.queryCounts[sourceId];
                countCell.textContent = count;
                totalCount += count;
                
                // Add highlight effect
                countCell.classList.add('updated');
                setTimeout(() => {
                    countCell.classList.remove('updated');
                }, 2000);
            }
        });
        
        // Update results count in header
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${Object.keys(ATT4CKQL.queryCounts).length} sources (${totalCount} total queries)`;
        }
        
        ATT4CKQL.utils.log(`Updated query counts: ${totalCount} total across ${Object.keys(ATT4CKQL.queryCounts).length} sources`);
    },
    
    bindCountUpdates: function() {
        // Automatically refresh counts when theme changes
        window.addEventListener('themeChanged', () => {
            setTimeout(() => this.updateCounts(), 100);
        });
    },
    
    // Method to dynamically count KQL files from GitHub API (optional enhancement)
    countKQLFilesFromAPI: async function() {
        const folders = {
            'active-directory': ['Active Directory/Queries'],
            'aws': ['Amazon Web Services/Queries'],
            'gcp': ['Google Cloud Platform/Queries'],
            'azure': ['Azure/Queries'],
            'entraid': ['Entra ID/Queries'],
            'office365': ['Office 365/Queries']
        };
        
        for (const [platform, paths] of Object.entries(folders)) {
            let totalCount = 0;
            
            for (const path of paths) {
                try {
                    const response = await fetch(`${ATT4CKQL.config.apiEndpoint}/contents/${encodeURIComponent(path)}`);
                    if (response.ok) {
                        const data = await response.json();
                        const kqlFiles = data.filter(file => 
                            file.name.toLowerCase().endsWith('.kql') && file.type === 'file'
                        );
                        totalCount += kqlFiles.length;
                    }
                } catch (error) {
                    ATT4CKQL.utils.log(`Failed to count files for ${platform}/${path}: ${error.message}`, 'warn');
                }
            }
            
            if (totalCount > 0) {
                ATT4CKQL.queryCounts[platform] = totalCount;
            }
        }
        
        this.updateCounts();
    }
};

// =====================================
// RESPONSIVE UTILITIES
// =====================================
ATT4CKQL.ResponsiveUtils = {
    init: function() {
        this.handleResponsiveTables();
        this.initializeModalClickOutside();
        ATT4CKQL.utils.log('Responsive utilities initialized');
    },
    
    handleResponsiveTables: function() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.scrollWidth > table.clientWidth) {
                table.classList.add('table-scrollable');
            }
        });
    },
    
    initializeModalClickOutside: function() {
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                ATT4CKQL.ModalManager.close();
            }
        });
    }
};

// =====================================
// GLOBAL FUNCTION COMPATIBILITY
// =====================================
// Maintain backward compatibility with existing HTML onclick handlers

function openModal(modalId) { 
    const platform = ATT4CKQL.utils.getCurrentPlatform() || 'aws';
    ATT4CKQL.ModalManager.open(modalId, { 
        loadContent: true, 
        type: 'logs',
        platform: platform
    }); 
}

function closeModal(modalId) { 
    ATT4CKQL.ModalManager.close(modalId); 
}

function openExternalModal(modalId, modalType) { 
    const platform = ATT4CKQL.utils.getCurrentPlatform() || 'aws';
    ATT4CKQL.ModalManager.open(modalId, { 
        loadContent: true, 
        type: modalType || 'logs',
        platform: platform
    }); 
}

function openQueryModal(modalId, githubPath) {
    const platform = ATT4CKQL.utils.getCurrentPlatform() || 'aws';
    const fileName = githubPath.split('/').pop();
    const title = fileName.replace('.kql', ' - Detection Query');
    
    ATT4CKQL.ModalManager.open(modalId, { 
        loadContent: true, 
        type: 'query',
        fileName: fileName,
        platform: platform,
        title: title
    }); 
}

function copyQueryToClipboard(modalId) { 
    ATT4CKQL.QueryManager.copyToClipboard(modalId); 
}

function scrollToExplanation(modalId) { 
    ATT4CKQL.QueryManager.scrollToExplanation(modalId); 
}

function showMain(theme) {
    ATT4CKQL.ThemeManager.setTheme(theme);
    ATT4CKQL.ThemeManager.hideThemeChooser();
}

// Legacy function support
function getBasePath(path) {
    return ATT4CKQL.utils.getBasePath(path);
}

function escapeHtml(unsafe) {
    return ATT4CKQL.utils.escapeHtml(unsafe);
}

// =====================================
// APPLICATION INITIALIZATION
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core ATT4CKQL application
    ATT4CKQL.init();
    
    // Initialize responsive utilities
    ATT4CKQL.ResponsiveUtils.init();
    
    // Platform-specific initialization
    const platform = ATT4CKQL.utils.getCurrentPlatform();
    if (platform) {
        ATT4CKQL.utils.log(`Detected platform: ${platform}`);
        
        // Initialize platform tables if PlatformTables is available
        if (window.PlatformTables) {
            window.PlatformTables.init(platform);
        }
    }
});

// Expose ATT4CKQL globally for debugging and external access
window.ATT4CKQL = ATT4CKQL;