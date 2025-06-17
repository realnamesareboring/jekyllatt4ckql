/*!
 * ATT4CKQL Core JavaScript v2.1 - COMPLETE CONSOLIDATED VERSION
 * Enhanced KQL Queries for Microsoft Sentinel
 * Consolidated from main.js + aws-script.js + table.js + platform-tables.js
 * Created: 2025
 */

// =====================================
// NAMESPACE & CONFIGURATION
// =====================================
window.ATT4CKQL = window.ATT4CKQL || {
    version: '2.1.0',
    config: {
        baseUrl: window.siteBaseUrl || '',
        apiEndpoint: 'https://api.github.com/repos/realnamesareboring/jekyllatt4ckql',
        repoOwner: 'realnamesareboring',
        repoName: 'jekyllatt4ckql',
        debug: false
    },
    
    // Platform configurations for content paths
    platforms: {
        'aws': {
            name: 'Amazon Web Services',
            queryPath: '/Amazon Web Services/Queries/',
            logsPath: '/Amazon Web Services/logs/',
            explainedPath: '/Amazon Web Services/explained/',
            color: '#FF9900'
        },
        'azure': {
            name: 'Azure',
            queryPath: '/Azure/Queries/',
            logsPath: '/Azure/logs/',
            explainedPath: '/Azure/explained/',
            color: '#0078D4'
        },
        'gcp': {
            name: 'Google Cloud Platform',
            queryPath: '/Google Cloud Platform/Queries/',
            logsPath: '/Google Cloud Platform/logs/',
            explainedPath: '/Google Cloud Platform/explained/',
            color: '#4285F4'
        },
        'entraid': {
            name: 'Entra ID',
            queryPath: '/Entra ID/Queries/',
            logsPath: '/Entra ID/logs/',
            explainedPath: '/Entra ID/explained/',
            color: '#00BCF2'
        },
        'office365': {
            name: 'Office 365',
            queryPath: '/Office 365/Queries/',
            logsPath: '/Office 365/logs/',
            explainedPath: '/Office 365/explained/',
            color: '#D83B01'
        },
        'active-directory': {
            name: 'Active Directory',
            queryPath: '/Active Directory/Queries/',
            logsPath: '/Active Directory/logs/',
            explainedPath: '/Active Directory/explained/',
            color: '#106EBE'
        },
        'defender': {
            name: 'Microsoft Defender',
            queryPath: '/Microsoft Defender/Queries/',
            logsPath: '/Microsoft Defender/logs/',
            explainedPath: '/Microsoft Defender/explained/',
            color: '#00A4EF'
        }
    },
    
    // Query count storage
    queryCounts: {}
};

// =====================================
// DETECTION RULES DATA
// =====================================
ATT4CKQL.DetectionRulesData = {
    'aws': [
        {
            name: "EC2 Instance Created with IMDSv1",
            description: "Identifies EC2 instances launched with IMDSv1 set to optional, creating a credential theft risk",
            severity: "high",
            lastDetected: "2025-05-15T14:23:45.123Z",
            detectionCount: 3,
            mitreTactics: [
                { tactic: "Initial Access (TA0001)", technique: "T1078.004 - Cloud Accounts" },
                { tactic: "Credential Access (TA0006)", technique: "T1552.005 - Cloud Instance Metadata API" },
                { tactic: "Privilege Escalation (TA0004)", technique: "T1078.004 - Cloud Accounts" },
                { tactic: "Defense Evasion (TA0005)", technique: "T1078.004 - Cloud Accounts" }
            ],
            dataSource: "AWS EC2",
            queryFile: "ATT4CKQL - AWS - EC2 - Instance Created with IMDSv1.kql",
            queryModalId: "aws-imdsv1-kql",
            attackPath: "https://github.com/RhinoSecurityLabs/pacu/wiki/Module-Details#ec2__metadata_services",
            attackPathText: "Pacu IMDS v1 Attack",
            sampleLogId: "imdsv1-logstest" 
        },
        {
            name: "EC2 Suspicious Deployment Detected",
            description: "Identifies unusual EC2 instance deployments that may indicate cryptomining or other malicious activities",
            severity: "medium",
            lastDetected: "2025-05-15T04:17:32.654Z",
            detectionCount: 4,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1578.002 - Modify Cloud Compute Infrastructure: Create Cloud Instance" },
                { tactic: "Execution (TA0002)", technique: "T1204.003 - User Execution: Malicious Image" }
            ],
            dataSource: "AWS EC2",
            queryFile: "ATT4CKQL - AWS - EC2 - Suspicious Deployment Detected.kql",
            queryModalId: "ec2-suspicious-deployment-kql",
            attackPath: "https://stratus-red-team.cloud/attack-techniques/AWS/aws.execution.ec2-launch-unusual-instances/",
            attackPathText: "stratus-red-team: Launch Unusual EC2 instances",
            sampleLogId: "ec2-suspicious-deployment-logs"
        },
        {
            name: "EC2 Password Data Retrieved",
            description: "Detects when Windows password data is retrieved from EC2 instances, which may indicate compromise",
            severity: "medium",
            lastDetected: "2025-05-14T16:45:12.321Z",
            detectionCount: 2,
            mitreTactics: [
                { tactic: "Credential Access (TA0006)", technique: "T1552.005 - Unsecured Credentials: Cloud Instance Metadata API" }
            ],
            dataSource: "AWS EC2",
            queryFile: "ATT4CKQL - AWS - EC2 - Password Data Retrieved.kql",
            queryModalId: "ec2-password-data-kql",
            attackPath: "https://attack.mitre.org/techniques/T1552/005/",
            attackPathText: "MITRE ATT&CK T1552.005",
            sampleLogId: "ec2-password-data-logs"
        },
        {
            name: "GuardDuty Threat Detected",
            description: "Amazon GuardDuty has detected a threat indicating potential malicious activity",
            severity: "high",
            lastDetected: "2025-05-15T09:32:17.543Z",
            detectionCount: 6,
            mitreTactics: [
                { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" },
                { tactic: "Persistence (TA0003)", technique: "T1098 - Account Manipulation" }
            ],
            dataSource: "AWS GuardDuty",
            queryFile: "ATT4CKQL - AWS - GuardDuty - Threat Detected.kql",
            queryModalId: "guardduty-threat-kql",
            attackPath: "https://attack.mitre.org/techniques/T1190/",
            attackPathText: "MITRE ATT&CK T1190",
            sampleLogId: "guardduty-threat-logs"
        },
        {
            name: "IAM Password Policy Disabled",
            description: "Detects when IAM password policy is disabled or weakened, reducing account security",
            severity: "medium",
            lastDetected: "2025-05-13T11:15:28.876Z",
            detectionCount: 1,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1562.007 - Impair Defenses: Disable or Modify Cloud Firewall" }
            ],
            dataSource: "AWS IAM",
            queryFile: "ATT4CKQL - AWS - IAM - Password Policy Disabled.kql",
            queryModalId: "iam-password-policy-kql",
            attackPath: "https://attack.mitre.org/techniques/T1562/007/",
            attackPathText: "MITRE ATT&CK T1562.007",
            sampleLogId: "iam-password-policy-logs"
        },
        {
            name: "IAM Root Activity Detected",
            description: "Identifies root account usage which should be rare and monitored closely",
            severity: "high",
            lastDetected: "2025-05-12T08:22:41.234Z",
            detectionCount: 1,
            mitreTactics: [
                { tactic: "Privilege Escalation (TA0004)", technique: "T1078.004 - Valid Accounts: Cloud Accounts" }
            ],
            dataSource: "AWS IAM",
            queryFile: "ATT4CKQL - AWS - IAM - Root Activity Detected.kql",
            queryModalId: "iam-root-activity-kql",
            attackPath: "https://attack.mitre.org/techniques/T1078/004/",
            attackPathText: "MITRE ATT&CK T1078.004",
            sampleLogId: "iam-root-activity-logs"
        },
        {
            name: "S3 Bucket Policy Changed",
            description: "Detects changes to S3 bucket policies that could lead to data exposure",
            severity: "medium",
            lastDetected: "2025-05-14T13:44:55.789Z",
            detectionCount: 3,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1578.004 - Modify Cloud Compute Infrastructure: Revert Cloud Instance" }
            ],
            dataSource: "AWS S3",
            queryFile: "ATT4CKQL - AWS - S3 - Bucket Policy Changed.kql",
            queryModalId: "s3-bucket-policy-kql",
            attackPath: "https://attack.mitre.org/techniques/T1578/004/",
            attackPathText: "MITRE ATT&CK T1578.004",
            sampleLogId: "s3-bucket-policy-logs"
        },
        {
            name: "VPC Flow Logs Disabled",
            description: "Identifies when VPC Flow Logs are disabled, potentially blinding network monitoring",
            severity: "medium",
            lastDetected: "2025-05-11T19:33:12.456Z",
            detectionCount: 2,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Impair Defenses: Disable Cloud Logs" }
            ],
            dataSource: "AWS VPC",
            queryFile: "ATT4CKQL - AWS - VPC - Flow Logs Disabled.kql",
            queryModalId: "vpc-flow-logs-kql",
            attackPath: "https://attack.mitre.org/techniques/T1562/008/",
            attackPathText: "MITRE ATT&CK T1562.008",
            sampleLogId: "vpc-flow-logs-disabled-logs"
        }
    ],
    'azure': [],
    'gcp': [],
    'entraid': [],
    'office365': [],
    'active-directory': [],
    'defender': []
};

// =====================================
// PLATFORM TABLES MANAGER
// =====================================
ATT4CKQL.PlatformTables = {
    currentPlatform: null,
    detectionRules: [],
    
    // Initialize the platform tables system
    init: function(platform) {
        this.currentPlatform = platform || this.detectPlatform();
        
        if (!this.currentPlatform) {
            ATT4CKQL.utils.log('PlatformTables: No platform detected', 'error');
            return;
        }
        
        this.detectionRules = ATT4CKQL.DetectionRulesData[this.currentPlatform] || [];
        
        ATT4CKQL.utils.log(`PlatformTables: Initializing for platform: ${this.currentPlatform}`);
        ATT4CKQL.utils.log(`PlatformTables: Loaded ${this.detectionRules.length} detection rules`);
        
        // Initialize table rendering
        this.renderDetectionRules();
        
        // Initialize responsive features
        this.initializeResponsiveFeatures();
        
        // Update page title and counts
        this.updatePageInfo();
    },
    
    // Auto-detect platform from URL
    detectPlatform: function() {
        const path = window.location.pathname;
        for (const platform of Object.keys(ATT4CKQL.platforms)) {
            if (path.includes(`/platforms/${platform}/`) || path.includes(`/${platform}/`)) {
                return platform;
            }
        }
        return null;
    },
    
    // Main table rendering function
    renderDetectionRules: function() {
        const tableBody = document.getElementById('detection-rules-table-body');
        
        if (!tableBody) {
            ATT4CKQL.utils.log('PlatformTables: Table body element not found', 'error');
            return;
        }
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (this.detectionRules.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        No detection rules available for ${ATT4CKQL.platforms[this.currentPlatform]?.name || this.currentPlatform}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Render each detection rule
        this.detectionRules.forEach(rule => {
            const rowspan = Math.max(1, rule.mitreTactics.length);
            const firstRow = this.createDetectionRow(rule, rowspan);
            tableBody.appendChild(firstRow);
            
            // Add additional rows for multiple MITRE tactics
            if (rule.mitreTactics.length > 1) {
                for (let i = 1; i < rule.mitreTactics.length; i++) {
                    const additionalRow = this.createMitreRow(rule.mitreTactics[i]);
                    tableBody.appendChild(additionalRow);
                }
            }
        });
        
        // Update results count
        this.updateResultsCount(this.detectionRules.length);
        
        ATT4CKQL.utils.log(`PlatformTables: Rendered ${this.detectionRules.length} detection rules for ${this.currentPlatform}`);
    },
    
    // Create the main detection rule row
    createDetectionRow: function(rule, rowspan) {
        const row = document.createElement('tr');
        row.className = 'detection-row';
        
        // Build the row HTML with platform-agnostic function calls
        row.innerHTML = `
            <td rowspan="${rowspan}" class="detection-name-cell">
                <div class="detection-title">
                    <span class="severity-indicator severity-${rule.severity}"></span>
                    <strong>${ATT4CKQL.utils.escapeHtml(rule.name)}</strong>
                </div>
                <div class="detection-meta">
                    <span class="detection-timestamp">Last: ${this.formatTimestamp(rule.lastDetected)}</span>
                    <span class="detection-count">${rule.detectionCount} results</span>
                </div>
            </td>
            <td rowspan="${rowspan}" class="description-cell">
                ${ATT4CKQL.utils.escapeHtml(rule.description)}
            </td>
            <td class="mitre-tactic-cell">
                <div class="mitre-tactic">${ATT4CKQL.utils.escapeHtml(rule.mitreTactics[0].tactic)}</div>
                <div class="mitre-technique">${ATT4CKQL.utils.escapeHtml(rule.mitreTactics[0].technique)}</div>
            </td>
            <td rowspan="${rowspan}" class="data-source-cell">${ATT4CKQL.utils.escapeHtml(rule.dataSource)}</td>
            <td rowspan="${rowspan}" class="action-cell">
                <button class="view-query-btn" onclick="ATT4CKQL.PlatformTables.openQueryModal('${rule.queryModalId}', '${rule.queryFile}')">
                    📄 View Query
                </button>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <a href="${rule.attackPath}" target="_blank" class="attack-path-link">
                    ${ATT4CKQL.utils.escapeHtml(rule.attackPathText)}
                </a>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <button class="view-logs-btn sample-btn" onclick="ATT4CKQL.PlatformTables.openSampleLogsModal('${rule.sampleLogId}')">
                    📊 Sample Logs
                </button>
            </td>
        `;
        
        return row;
    },
    
    // Create additional MITRE tactic rows
    createMitreRow: function(mitreTactic) {
        const row = document.createElement('tr');
        row.className = 'mitre-additional-row';
        
        row.innerHTML = `
            <td class="mitre-tactic-cell">
                <div class="mitre-tactic">${ATT4CKQL.utils.escapeHtml(mitreTactic.tactic)}</div>
                <div class="mitre-technique">${ATT4CKQL.utils.escapeHtml(mitreTactic.technique)}</div>
            </td>
        `;
        
        return row;
    },
    
    // Format timestamp for display
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
    },
    
    // Update results count display
    updateResultsCount: function(count) {
        const resultCountElement = document.getElementById('results-count');
        if (resultCountElement) {
            resultCountElement.textContent = `${count} result${count !== 1 ? 's' : ''}`;
        }
        
        // Update page title if needed
        const platformName = ATT4CKQL.platforms[this.currentPlatform]?.name || this.currentPlatform;
        const pageTitle = document.querySelector('h1');
        if (pageTitle && !pageTitle.textContent.includes(count)) {
            pageTitle.textContent = `${platformName} Detection Rules - ${count} Rules Available`;
        }
    },
    
    // Initialize responsive features
    initializeResponsiveFeatures: function() {
        // Handle responsive tables
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.scrollWidth > table.clientWidth) {
                table.classList.add('table-scrollable');
            }
        });
        
        // Add platform color accent
        const platformConfig = ATT4CKQL.platforms[this.currentPlatform];
        if (platformConfig && platformConfig.color) {
            document.documentElement.style.setProperty('--platform-accent', platformConfig.color);
        }
    },
    
    // Update page information
    updatePageInfo: function() {
        const platformConfig = ATT4CKQL.platforms[this.currentPlatform];
        if (platformConfig) {
            document.title = `${platformConfig.name} Detection Rules - ATT4CKQL`;
        }
    },
    
    // Open query modal
    openQueryModal: function(modalId, queryFile) {
        const platform = this.currentPlatform || 'aws';
        const fileName = queryFile.split('/').pop();
        const title = fileName.replace('.kql', ' - Detection Query');
        
        ATT4CKQL.ModalManager.open(modalId, { 
            loadContent: true, 
            type: 'query',
            fileName: fileName,
            platform: platform,
            title: title
        }); 
    },
    
    // Open sample logs modal
    openSampleLogsModal: function(sampleLogId) {
        const platform = this.currentPlatform || 'aws';
        ATT4CKQL.ModalManager.open(sampleLogId, { 
            loadContent: true, 
            type: 'logs',
            platform: platform
        }); 
    },
    
    // Search and filter methods
    searchRules: function(searchTerm) {
        const originalRules = ATT4CKQL.DetectionRulesData[this.currentPlatform] || [];
        const term = searchTerm.toLowerCase();
        
        this.detectionRules = originalRules.filter(rule => 
            rule.name.toLowerCase().includes(term) ||
            rule.description.toLowerCase().includes(term) ||
            rule.dataSource.toLowerCase().includes(term) ||
            rule.mitreTactics.some(tactic => 
                tactic.tactic.toLowerCase().includes(term) ||
                tactic.technique.toLowerCase().includes(term)
            )
        );
        
        this.renderDetectionRules();
    },
    
    filterBySeverity: function(severity) {
        const originalRules = ATT4CKQL.DetectionRulesData[this.currentPlatform] || [];
        
        if (severity === 'all') {
            this.detectionRules = originalRules;
        } else {
            this.detectionRules = originalRules.filter(rule => rule.severity === severity);
        }
        
        this.renderDetectionRules();
    },
    
    resetFilters: function() {
        this.detectionRules = ATT4CKQL.DetectionRulesData[this.currentPlatform] || [];
        this.renderDetectionRules();
    }
};

// =====================================
// CORE UTILITY FUNCTIONS
// =====================================
ATT4CKQL.utils = {
    log: function(message, level = 'info') {
        if (ATT4CKQL.config.debug || level === 'error') {
            console[level]('[ATT4CKQL]', message);
        }
    },
    
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    getBasePath: function(path) {
        const baseUrl = ATT4CKQL.config.baseUrl;
        if (baseUrl && !path.startsWith(baseUrl)) {
            return baseUrl + (path.startsWith('/') ? '' : '/') + path;
        }
        return path;
    },
    
    getCurrentPlatform: function() {
        const path = window.location.pathname;
        for (const platform of Object.keys(ATT4CKQL.platforms)) {
            if (path.includes(`/platforms/${platform}/`) || path.includes(`/${platform}/`)) {
                return platform;
            }
        }
        return null;
    },
    
    buildGitHubUrl: function(platform, type, fileName) {
        const platformConfig = ATT4CKQL.platforms[platform];
        if (!platformConfig) return null;
        
        let basePath;
        switch(type) {
            case 'query': basePath = platformConfig.queryPath; break;
            case 'logs': basePath = platformConfig.logsPath; break;
            case 'explained': basePath = platformConfig.explainedPath; break;
            default: return null;
        }
        
        return `${ATT4CKQL.config.apiEndpoint}/contents${basePath}${fileName}`;
    }
};

// =====================================
// THEME MANAGEMENT
// =====================================
ATT4CKQL.ThemeManager = {
    currentTheme: 'defender',
    
    init: function() {
        this.loadThemeFromStorage();
        this.bindThemeToggle();
        ATT4CKQL.utils.log('Theme manager initialized');
    },
    
    setTheme: function(theme) {
        this.currentTheme = theme;
        document.body.classList.toggle('theme-attacker', theme === 'attacker');
        localStorage.setItem('att4ckql-theme', theme);
        ATT4CKQL.utils.log(`Theme set to: ${theme}`);
    },
    
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'defender' ? 'attacker' : 'defender';
        this.setTheme(newTheme);
    },
    
    loadThemeFromStorage: function() {
        const savedTheme = localStorage.getItem('att4ckql-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    },
    
    bindThemeToggle: function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },
    
    hideThemeChooser: function() {
        const themeChooser = document.getElementById('theme-chooser');
        const mainContent = document.getElementById('main-content');
        
        if (themeChooser) {
            themeChooser.style.display = 'none';
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
        }
    }
};

// =====================================
// MODAL MANAGEMENT
// =====================================
ATT4CKQL.ModalManager = {
    currentModal: null,
    
    open: function(modalId, options = {}) {
        this.close(); // Close any existing modal first
        
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            ATT4CKQL.utils.log(`Modal ${modalId} not found`, 'error');
            return;
        }
        
        this.currentModal = modalId;
        modalElement.style.display = 'block';
        
        if (options.loadContent) {
            this.loadModalContent(modalId, options);
        }
        
        ATT4CKQL.utils.log(`Modal ${modalId} opened`);
    },
    
    close: function(modalId = null) {
        const targetModalId = modalId || this.currentModal;
        
        if (targetModalId) {
            const modalElement = document.getElementById(targetModalId);
            if (modalElement) {
                modalElement.style.display = 'none';
                this.currentModal = null;
                ATT4CKQL.utils.log(`Modal ${targetModalId} closed`);
            }
        }
    },
    
    loadModalContent: function(modalId, options) {
        const modalElement = document.getElementById(modalId);
        const { type, platform, fileName, title } = options;
        
        // Show loading state
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                <div class="modal-loading">Loading ${type}...</div>
            </div>
        `;
        
        if (type === 'query' && fileName) {
            this.loadQueryContent(modalId, platform, fileName, title);
        } else if (type === 'logs') {
            this.loadLogsContent(modalId, platform, modalId);
        }
    },
    
    loadQueryContent: function(modalId, platform, fileName, title) {
        let githubPath = fileName;
        
        // Add platform path if not already present
        const platformConfig = ATT4CKQL.platforms[platform];
        if (platformConfig && !githubPath.includes('Queries/')) {
            githubPath = `${platformConfig.queryPath.replace(/^\/|\/$/g, '')}/${fileName}`;
        }
        
        const apiUrl = `${ATT4CKQL.config.apiEndpoint}/contents/${githubPath}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.content) {
                    const decodedContent = atob(data.content);
                    const cleanQuery = decodedContent.replace(/^\/\/.*$/gm, '').trim();
                    
                    const modalElement = document.getElementById(modalId);
                    modalElement.innerHTML = this.createQueryModalContent(modalId, cleanQuery, title || fileName);
                } else {
                    throw new Error('No content found in response');
                }
            })
            .catch(error => {
                ATT4CKQL.utils.log(`Failed to load query: ${error.message}`, 'error');
                const modalElement = document.getElementById(modalId);
                modalElement.innerHTML = `
                    <div class="modal-content">
                        <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                        <div class="modal-error">Failed to load query. Please try again.</div>
                    </div>
                `;
            });
    },
    
    loadLogsContent: function(modalId, platform, logId) {
        const platformConfig = ATT4CKQL.platforms[platform];
        if (!platformConfig) return;
        
        const logsPath = `${platformConfig.logsPath.replace(/^\/|\/$/g, '')}/${logId}.html`;
        const apiUrl = `${ATT4CKQL.config.apiEndpoint}/contents/${logsPath}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.content) {
                    const decodedContent = atob(data.content);
                    const modalElement = document.getElementById(modalId);
                    modalElement.innerHTML = this.processModalContent(decodedContent, modalId, { title: 'Sample Logs' });
                } else {
                    throw new Error('No content found in response');
                }
            })
            .catch(error => {
                ATT4CKQL.utils.log(`Failed to load logs: ${error.message}`, 'error');
                const modalElement = document.getElementById(modalId);
                modalElement.innerHTML = `
                    <div class="modal-content">
                        <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                        <div class="modal-error">Failed to load sample logs. Please try again.</div>
                    </div>
                `;
            });
    },
    
    createQueryModalContent: function(modalId, queryContent, title) {
        const cleanQuery = ATT4CKQL.utils.escapeHtml(queryContent);
        
        return `
            <div class="modal-content">
                <span class="close-btn" onclick="ATT4CKQL.ModalManager.close('${modalId}')">&times;</span>
                <div class="shell-container">
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
                <div class="modal-actions">
                    <button class="copy-btn" onclick="ATT4CKQL.QueryManager.copyToClipboard('${modalId}')">📋 Copy Query</button>
                    <button class="explain-btn" onclick="ATT4CKQL.QueryManager.scrollToExplanation('${modalId}')">📖 View Explanation</button>
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
    }
};

// =====================================
// QUERY MANAGEMENT
// =====================================
ATT4CKQL.QueryManager = {
    copyToClipboard: function(modalId) {
        const modalElement = document.getElementById(modalId);
        const queryElement = modalElement.querySelector('.kql-query code');
        
        if (!queryElement) {
            ATT4CKQL.utils.log('Query element not found for copying', 'error');
            return;
        }
        
        const queryText = queryElement.textContent;
        
        navigator.clipboard.writeText(queryText).then(() => {
            // Visual feedback
            const copyBtn = modalElement.querySelector('.copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = '#107c10';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }
            
            ATT4CKQL.utils.log('Query copied to clipboard');
        }).catch(error => {
            ATT4CKQL.utils.log(`Failed to copy query: ${error.message}`, 'error');
            alert('Failed to copy. Please try again.');
        });
    },
    
    scrollToExplanation: function(modalId) {
        // This would scroll to explanation section if it exists in the modal
        const modalElement = document.getElementById(modalId);
        const explanationElement = modalElement.querySelector('.explanation-section');
        
        if (explanationElement) {
            explanationElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            ATT4CKQL.utils.log('No explanation section found in modal');
        }
    }
};

// =====================================
// QUERY COUNT MANAGEMENT
// =====================================
ATT4CKQL.QueryCounter = {
    init: function() {
        this.countQueriesFromData();
        this.updateCounts();
        ATT4CKQL.utils.log('Query counter initialized');
    },
    
    countQueriesFromData: function() {
        // Count queries from the detection rules data
        for (const platform in ATT4CKQL.DetectionRulesData) {
            const rules = ATT4CKQL.DetectionRulesData[platform];
            if (rules && rules.length > 0) {
                ATT4CKQL.queryCounts[platform] = rules.length;
            }
        }
        
        // Set some default counts for platforms without data yet
        const defaultCounts = {
            'active-directory': 42,
            'gcp': 28,
            'azure': 47,
            'entraid': 39,
            'office365': 31,
            'defender': 38
        };
        
        for (const platform in defaultCounts) {
            if (!ATT4CKQL.queryCounts[platform]) {
                ATT4CKQL.queryCounts[platform] = defaultCounts[platform];
            }
        }
    },
    
    updateCounts: function() {
        // Update count displays on the page
        for (const platform in ATT4CKQL.queryCounts) {
            const countElement = document.getElementById(`${platform}-count`);
            if (countElement) {
                countElement.textContent = ATT4CKQL.queryCounts[platform];
            }
        }
        
        // Update total count
        const totalCount = Object.values(ATT4CKQL.queryCounts).reduce((sum, count) => sum + count, 0);
        const totalElement = document.getElementById('total-queries-count');
        if (totalElement) {
            totalElement.textContent = totalCount;
        }
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
// CORE APPLICATION INITIALIZATION
// =====================================
ATT4CKQL.init = function() {
    this.utils.log('Initializing ATT4CKQL v' + this.version);
    
    // Initialize core components
    this.ThemeManager.init();
    this.QueryCounter.init();
    
    // Platform-specific initialization
    const platform = this.utils.getCurrentPlatform();
    if (platform && document.getElementById('detection-rules-table-body')) {
        // Initialize platform tables if we're on a platform page
        setTimeout(() => {
            this.PlatformTables.init(platform);
        }, 100);
    }
    
    this.utils.log('ATT4CKQL initialization complete');
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

function renderDetectionRules() {
    if (ATT4CKQL.PlatformTables.currentPlatform) {
        ATT4CKQL.PlatformTables.renderDetectionRules();
    }
}

function updateResultsCount(count) {
    ATT4CKQL.PlatformTables.updateResultsCount(count);
}

function formatTimestamp(timestamp) {
    return ATT4CKQL.PlatformTables.formatTimestamp(timestamp);
}

function initializeDetectionTable() {
    const platform = ATT4CKQL.utils.getCurrentPlatform();
    if (platform) {
        ATT4CKQL.PlatformTables.init(platform);
    }
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
    }
});

// Expose ATT4CKQL globally for debugging and external access
window.ATT4CKQL = ATT4CKQL;

// Legacy support for external references
window.PlatformTables = ATT4CKQL.PlatformTables;