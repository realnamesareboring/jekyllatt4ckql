/*!
 * ATT4CKQL Core JavaScript v2.2 - CORRECTED WORKING VERSION
 * Enhanced KQL Queries for Microsoft Sentinel
 * Consolidated from main.js + aws-script.js + table.js + platform-tables.js
 * FIXES: Count script, modal buttons, formatting, close buttons
 * Created: 2025
 */

// =====================================
// NAMESPACE & CONFIGURATION
// =====================================
window.ATT4CKQL = window.ATT4CKQL || {
    version: '2.2.0',
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
    
    // Query count storage (FIXED - includes proper counts from main.js)
    queryCounts: {
        'active-directory': 42,
        'aws': 15, // Updated to reflect actual AWS detection rules
        'gcp': 28,
        'azure': 47,
        'entraid': 39,
        'office365': 31,
        'defender': 38
    }
};

// =====================================
// DETECTION RULES DATA (COMPLETE LIST FROM TABLE.JS)
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
        },
        {
            name: "CloudTrail Stopped",
            description: "Detects when AWS CloudTrail logging is stopped, potentially hiding malicious activity",
            severity: "high",
            lastDetected: "2025-05-10T22:18:33.987Z",
            detectionCount: 1,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Impair Defenses: Disable Cloud Logs" }
            ],
            dataSource: "AWS CloudTrail",
            queryFile: "ATT4CKQL - AWS - CloudTrail - Stopped.kql",
            queryModalId: "cloudtrail-stopped-kql",
            attackPath: "https://attack.mitre.org/techniques/T1562/008/",
            attackPathText: "MITRE ATT&CK T1562.008",
            sampleLogId: "cloudtrail-stopped-logs"
        },
        {
            name: "Lambda Function Invoked from Suspicious IP",
            description: "Identifies Lambda function invocations from potentially malicious source IP addresses",
            severity: "medium",
            lastDetected: "2025-05-14T07:39:21.456Z",
            detectionCount: 5,
            mitreTactics: [
                { tactic: "Execution (TA0002)", technique: "T1204.003 - User Execution: Malicious Image" },
                { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" }
            ],
            dataSource: "AWS Lambda",
            queryFile: "ATT4CKQL - AWS - Lambda - Suspicious IP Invocation.kql",
            queryModalId: "lambda-suspicious-ip-kql",
            attackPath: "https://attack.mitre.org/techniques/T1204/003/",
            attackPathText: "MITRE ATT&CK T1204.003",
            sampleLogId: "lambda-suspicious-ip-logs"
        },
        {
            name: "RDS Database Snapshot Shared Publicly",
            description: "Detects when RDS database snapshots are shared publicly, potentially exposing sensitive data",
            severity: "high",
            lastDetected: "2025-05-13T15:27:44.123Z",
            detectionCount: 2,
            mitreTactics: [
                { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage Object" }
            ],
            dataSource: "AWS RDS",
            queryFile: "ATT4CKQL - AWS - RDS - Public Snapshot Shared.kql",
            queryModalId: "rds-public-snapshot-kql",
            attackPath: "https://attack.mitre.org/techniques/T1530/",
            attackPathText: "MITRE ATT&CK T1530",
            sampleLogId: "rds-public-snapshot-logs"
        },
        {
            name: "Unusual API Calls from New Location",
            description: "Identifies API calls from geographic locations not previously seen for the account",
            severity: "medium",
            lastDetected: "2025-05-15T11:42:17.789Z",
            detectionCount: 7,
            mitreTactics: [
                { tactic: "Initial Access (TA0001)", technique: "T1078.004 - Valid Accounts: Cloud Accounts" },
                { tactic: "Defense Evasion (TA0005)", technique: "T1078.004 - Valid Accounts: Cloud Accounts" }
            ],
            dataSource: "AWS CloudTrail",
            queryFile: "ATT4CKQL - AWS - CloudTrail - New Location API Calls.kql",
            queryModalId: "unusual-location-api-kql",
            attackPath: "https://attack.mitre.org/techniques/T1078/004/",
            attackPathText: "MITRE ATT&CK T1078.004",
            sampleLogId: "unusual-location-api-logs"
        },
        {
            name: "Security Group Rules Modified",
            description: "Detects modifications to security group rules that could allow unauthorized access",
            severity: "medium",
            lastDetected: "2025-05-14T19:33:55.234Z",
            detectionCount: 4,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1562.007 - Impair Defenses: Disable or Modify Cloud Firewall" },
                { tactic: "Persistence (TA0003)", technique: "T1098 - Account Manipulation" }
            ],
            dataSource: "AWS EC2",
            queryFile: "ATT4CKQL - AWS - EC2 - Security Group Modified.kql",
            queryModalId: "security-group-modified-kql",
            attackPath: "https://attack.mitre.org/techniques/T1562/007/",
            attackPathText: "MITRE ATT&CK T1562.007",
            sampleLogId: "security-group-modified-logs"
        },
        {
            name: "AWS Config Service Disabled",
            description: "Identifies when AWS Config service is disabled, potentially hiding configuration changes",
            severity: "medium",
            lastDetected: "2025-05-12T14:22:11.567Z",
            detectionCount: 1,
            mitreTactics: [
                { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Impair Defenses: Disable Cloud Logs" }
            ],
            dataSource: "AWS Config",
            queryFile: "ATT4CKQL - AWS - Config - Service Disabled.kql",
            queryModalId: "config-disabled-kql",
            attackPath: "https://attack.mitre.org/techniques/T1562/008/",
            attackPathText: "MITRE ATT&CK T1562.008",
            sampleLogId: "config-disabled-logs"
        },
        {
            name: "Excessive Failed Login Attempts",
            description: "Detects multiple failed login attempts that could indicate brute force attacks",
            severity: "medium",
            lastDetected: "2025-05-15T16:45:33.891Z",
            detectionCount: 12,
            mitreTactics: [
                { tactic: "Credential Access (TA0006)", technique: "T1110 - Brute Force" }
            ],
            dataSource: "AWS CloudTrail",
            queryFile: "ATT4CKQL - AWS - CloudTrail - Excessive Failed Logins.kql",
            queryModalId: "excessive-failed-logins-kql",
            attackPath: "https://attack.mitre.org/techniques/T1110/",
            attackPathText: "MITRE ATT&CK T1110",
            sampleLogId: "excessive-failed-logins-logs"
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
// CORE UTILITY FUNCTIONS (ENHANCED)
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
// QUERY COUNTER MODULE (FIXED from main.js)
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
    }
};

// =====================================
// PLATFORM TABLES MANAGER (FIXED)
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
    
    // Main table rendering function (FIXED)
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
    
    // Create the main detection rule row (FIXED)
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
                <button class="view-query-btn" onclick="openQueryModal('${rule.queryModalId}', '${rule.queryFile}')">
                    📄 View Query
                </button>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <a href="${rule.attackPath}" target="_blank" class="attack-path-link">
                    ${ATT4CKQL.utils.escapeHtml(rule.attackPathText)}
                </a>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <button class="view-logs-btn sample-btn" onclick="openExternalModal('${rule.sampleLogId}', 'logs')">
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
    }
};

// =====================================
// THEME MANAGEMENT (ENHANCED)
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
        sessionStorage.setItem('att4ckql-theme', theme);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        ATT4CKQL.utils.log(`Theme set to: ${theme}`);
    },
    
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'defender' ? 'attacker' : 'defender';
        this.setTheme(newTheme);
    },
    
    loadThemeFromStorage: function() {
        const savedTheme = sessionStorage.getItem('att4ckql-theme');
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
// MODAL MANAGEMENT (FIXED FROM AWS-SCRIPT.JS)
// =====================================
ATT4CKQL.ModalManager = {
    activeModal: null,
    
    init: function() {
        this.bindGlobalEvents();
        ATT4CKQL.utils.log('Modal manager initialized');
    },
    
    open: function(modalId, content = null) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            ATT4CKQL.utils.log(`Modal ${modalId} not found`, 'error');
            return;
        }
        
        this.activeModal = modalId;
        modalElement.style.display = 'block';
        
        if (content) {
            modalElement.innerHTML = content;
        }
        
        ATT4CKQL.utils.log(`Modal ${modalId} opened`);
    },
    
    close: function(modalId = null) {
        const targetModalId = modalId || this.activeModal;
        
        if (targetModalId) {
            const modalElement = document.getElementById(targetModalId);
            if (modalElement) {
                modalElement.style.display = 'none';
                this.activeModal = null;
                ATT4CKQL.utils.log(`Modal ${targetModalId} closed`);
            }
        }
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
// QUERY MODAL FUNCTIONALITY (FIXED FROM AWS-SCRIPT.JS)
// =====================================
ATT4CKQL.QueryModal = {
    async fetchExplanationContent(modalId) {
        try {
            let explanationId = modalId;
            
            // If modalId starts with 'aws-', remove it
            if (modalId.startsWith('aws-')) {
                explanationId = modalId.substring(4);
            }
            
            // If explanationId ends with '-kql', remove it
            if (explanationId.endsWith('-kql')) {
                explanationId = explanationId.substring(0, explanationId.length - 4);
            }
            
            const explanationPath = ATT4CKQL.utils.getBasePath(`/Amazon Web Services/explained/${explanationId}-kqlexplained.html`);
            const response = await fetch(explanationPath);
            
            if (!response.ok) {
                return '<div id="explanation-section"><h3>Explanation</h3><p>Explanation content not available.</p></div>';
            }
            
            const content = await response.text();
            return `<div id="explanation-section" class="query-explanation">${content}</div>`;
        } catch (error) {
            return '<div id="explanation-section"><h3>Explanation</h3><p>Failed to load explanation.</p></div>';
        }
    },
    
    async processQueryContent(modalId, queryContent, fileName) {
        const modalElement = document.getElementById(modalId);
        
        // Store the query content for copying
        window[`${modalId}_content`] = queryContent;
        
        // Fetch the explanation content
        const explanationContent = await this.fetchExplanationContent(modalId);
        
        // Create properly styled modal with shell console look
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">${fileName.replace('.kql', ' - Detection Query')}</div>
                    <div class="modal-actions">
                        <button onclick="copyQueryToClipboard('${modalId}')" class="copy-btn">📋 Copy Query</button>
                        <button onclick="scrollToExplanation('${modalId}')" class="explain-btn">📖 Explain</button>
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
                            <div class="shell-title">${fileName}</div>
                        </div>
                        <div class="shell-content">
                            <pre class="kql-query"><code>${ATT4CKQL.utils.escapeHtml(queryContent)}</code></pre>
                        </div>
                    </div>
                    ${explanationContent}
                </div>
            </div>
        `;
    }
};

// =====================================
// RESPONSIVE UTILITIES
// =====================================
ATT4CKQL.ResponsiveUtils = {
    init: function() {
        this.handleResponsiveTables();
        ATT4CKQL.utils.log('Responsive utilities initialized');
    },
    
    handleResponsiveTables: function() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.scrollWidth > table.clientWidth) {
                table.classList.add('table-scrollable');
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
    this.ModalManager.init();
    
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
// GLOBAL FUNCTIONS (BACKWARD COMPATIBILITY)
// =====================================

// Helper function to get the correct path with baseurl
function getBasePath(path) {
    return ATT4CKQL.utils.getBasePath(path);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return ATT4CKQL.utils.escapeHtml(unsafe);
}

// Function to load modal content from Jekyll-served files (FROM AWS-SCRIPT.JS)
async function loadExternalModalContent(modalId, modalType) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Modal element with ID ${modalId} not found.`);
        return;
    }
    
    const modalPath = getBasePath(`/Amazon Web Services/logs/${modalId}.html`);
    
    try {
        // Show loading indicator and display the modal
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-loading">Loading content...</div>
            </div>
        `;
        modalElement.style.display = "block";
        
        // Fetch the modal content from Jekyll-served files
        const response = await fetch(modalPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const content = await response.text();
        
        // Process and clean the content
        let processedContent = content.replace(/^---[\s\S]*?---\s*/m, '');
        
        // Ensure proper modal structure
        if (!processedContent.includes('modal-content')) {
            const closeBtnMatch = processedContent.match(/(<span class="close-btn"[^>]*>.*?<\/span>)/);
            const closeBtnHtml = closeBtnMatch ? closeBtnMatch[1] : `<span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>`;
            
            const contentWithoutCloseBtn = processedContent.replace(/<span class="close-btn"[^>]*>.*?<\/span>/g, '');
            
            processedContent = `
                <div class="modal-content">
                    ${closeBtnHtml}
                    <div class="modal-body">
                        ${contentWithoutCloseBtn}
                    </div>
                </div>
            `;
        }
        
        // Add table wrapper for better scrolling if log tables are present
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
        
        // Set the processed content
        modalElement.innerHTML = processedContent;
        
    } catch (error) {
        console.error('Error loading content:', error);
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Content</div>
                </div>
                <div class="modal-body">
                    <p>There was an error loading the content: ${error.message}</p>
                    <p>Path attempted: ${modalPath}</p>
                    <p>Content is served locally from Jekyll.</p>
                </div>
            </div>
        `;
    }
}

// Function to fetch KQL query from Jekyll-served files (FROM AWS-SCRIPT.JS)
async function fetchQueryWithShellDisplay(modalId, githubPath) {
    const modalElement = document.getElementById(modalId);
    const fileName = githubPath.split('/').pop();
    
    try {
        const queryPath = getBasePath(`/Amazon Web Services/Queries/${fileName}`);
        const response = await fetch(queryPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const queryContent = await response.text();
        const cleanedQuery = queryContent.replace(/^---[\s\S]*?---\s*/m, '').trim();
        
        // Process the content and display with explanation
        await ATT4CKQL.QueryModal.processQueryContent(modalId, cleanedQuery, fileName);
        
    } catch (error) {
        console.error('Error fetching query:', error);
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Query</div>
                </div>
                <div class="modal-body">
                    <p>There was an error loading the KQL query: ${error.message}</p>
                    <p>Path attempted: ${getBasePath(`/Amazon Web Services/Queries/${fileName}`)}</p>
                    <p>Make sure the KQL file exists in the repository.</p>
                </div>
            </div>
        `;
    }
}

// Function to copy query to clipboard (FROM AWS-SCRIPT.JS)
function copyQueryToClipboard(modalId) {
    const content = window[`${modalId}_content`];
    if (!content) {
        console.error('No content found for copying');
        alert('No content to copy');
        return;
    }
    
    navigator.clipboard.writeText(content).then(function() {
        const copyBtn = document.querySelector(`#${modalId} .copy-btn`);
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ Copied!";
            copyBtn.style.background = '#107c10';
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }).catch(function(err) {
        console.error('Unable to copy text: ', err);
        alert('Failed to copy. Please try again.');
    });
}

// Function to scroll to explanation section (FROM AWS-SCRIPT.JS)
function scrollToExplanation(modalId) {
    const modalElement = document.getElementById(modalId);
    const explanationElement = modalElement.querySelector('#explanation-section') || 
                              modalElement.querySelector('.explanation') ||
                              modalElement.querySelector('.query-explanation');
    
    if (explanationElement) {
        explanationElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        console.log("Scrolled to explanation section");
    } else {
        console.log("Explanation section not found");
    }
}

// Function to open external modals
function openExternalModal(modalId, modalType) {
    loadExternalModalContent(modalId, modalType);
}

// Function to open modal (for backward compatibility)
function openModal(modalId) {
    loadExternalModalContent(modalId, 'logs');
}

// Function to open query modal with specific GitHub path
function openQueryModal(modalId, githubPath) {
    // Show loading message and display the modal
    const modalElement = document.getElementById(modalId);
    modalElement.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
            <div class="modal-loading">Loading query...</div>
        </div>
    `;
    modalElement.style.display = "block";
    
    // Then fetch the KQL query with corrected path
    if (!githubPath.includes('Queries/')) {
        githubPath = `Amazon Web Services/Queries/${githubPath.split('/').pop()}`;
    }
    
    fetchQueryWithShellDisplay(modalId, githubPath);
}

// Function to close modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.style.display = "none";
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

// Function to show main page (theme chooser)
function showMain(theme) {
    ATT4CKQL.ThemeManager.setTheme(theme);
    ATT4CKQL.ThemeManager.hideThemeChooser();
}

// Function to render detection rules (from table.js)
function renderDetectionRules() {
    if (ATT4CKQL.PlatformTables.currentPlatform) {
        ATT4CKQL.PlatformTables.renderDetectionRules();
    }
}

// Function to update results count (from table.js)
function updateResultsCount(count) {
    ATT4CKQL.PlatformTables.updateResultsCount(count);
}

// Function to format timestamp (from table.js)
function formatTimestamp(timestamp) {
    return ATT4CKQL.PlatformTables.formatTimestamp(timestamp);
}

// Function to initialize detection table (from table.js)
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
    // Apply theme if stored in session storage
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme === 'attacker') {
        document.body.classList.add('theme-attacker');
    }
    
    // Initialize core ATT4CKQL application
    ATT4CKQL.init();
    
    // Initialize responsive utilities
    ATT4CKQL.ResponsiveUtils.init();
    
    // Platform-specific initialization
    const platform = ATT4CKQL.utils.getCurrentPlatform();
    if (platform) {
        ATT4CKQL.utils.log(`Detected platform: ${platform}`);
    }
    
    // Initialize detection table if on platform page
    setTimeout(() => {
        if (document.getElementById('detection-rules-table-body')) {
            initializeDetectionTable();
        }
    }, 100);
});

// Expose ATT4CKQL globally for debugging and external access
window.ATT4CKQL = ATT4CKQL;