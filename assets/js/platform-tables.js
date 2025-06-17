/*!
 * Platform Tables JavaScript v2.0
 * Platform-agnostic table rendering for ATT4CKQL
 * Enhanced from table.js to support AWS, Azure, EntraID, GCP, etc.
 * Created: 2025
 */

// =====================================
// PLATFORM TABLES NAMESPACE
// =====================================
window.PlatformTables = window.PlatformTables || {
    version: '2.0.0',
    currentPlatform: null,
    detectionRules: [],
    
    // Platform-specific configurations
    platformConfigs: {
        aws: {
            name: 'Amazon Web Services',
            queryPath: '/Amazon Web Services/Queries/',
            logsPath: '/Amazon Web Services/logs/',
            explainedPath: '/Amazon Web Services/explained/',
            color: '#FF9900'
        },
        azure: {
            name: 'Microsoft Azure', 
            queryPath: '/Azure/Queries/',
            logsPath: '/Azure/logs/',
            explainedPath: '/Azure/explained/',
            color: '#0078D4'
        },
        gcp: {
            name: 'Google Cloud Platform',
            queryPath: '/Google Cloud Platform/Queries/',
            logsPath: '/Google Cloud Platform/logs/',
            explainedPath: '/Google Cloud Platform/explained/',
            color: '#4285F4'
        },
        entraid: {
            name: 'Microsoft Entra ID',
            queryPath: '/Entra ID/Queries/',
            logsPath: '/Entra ID/logs/',
            explainedPath: '/Entra ID/explained/',
            color: '#00BCF2'
        },
        office365: {
            name: 'Microsoft 365',
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
            color: '#5C2E91'
        }
    },
    
    // Sample detection rules data by platform
    detectionRulesData: {
        aws: [
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
                description: "Detects when Windows password data is retrieved from EC2 instances, which may indicate credential harvesting",
                severity: "medium",
                lastDetected: "2025-05-14T16:45:12.789Z",
                detectionCount: 2,
                mitreTactics: [
                    { tactic: "Credential Access (TA0006)", technique: "T1552.004 - Private Keys" }
                ],
                dataSource: "AWS EC2",
                queryFile: "ATT4CKQL - AWS - EC2 - Password Data Retrieved.kql",
                queryModalId: "ec2-password-kql",
                attackPath: "https://attack.mitre.org/techniques/T1552/004/",
                attackPathText: "MITRE ATT&CK T1552.004",
                sampleLogId: "ec2-password-data-retrieved-logs"
            },
            {
                name: "S3 Bucket Policy Modified",
                description: "Detects modifications to S3 bucket policies that could indicate data exfiltration attempts",
                severity: "high",
                lastDetected: "2025-05-15T09:12:33.456Z",
                detectionCount: 1,
                mitreTactics: [
                    { tactic: "Defense Evasion (TA0005)", technique: "T1562.007 - Disable or Modify Cloud Firewall" },
                    { tactic: "Exfiltration (TA0010)", technique: "T1537 - Transfer Data to Cloud Account" }
                ],
                dataSource: "AWS S3",
                queryFile: "ATT4CKQL - AWS - S3 - Bucket Policy Modified.kql",
                queryModalId: "s3-modification-kql",
                attackPath: "https://attack.mitre.org/techniques/T1537/",
                attackPathText: "MITRE ATT&CK T1537",
                sampleLogId: "s3-bucket-modification-logs"
            },
            {
                name: "IAM Access Keys Created and Deleted",
                description: "Identifies rapid creation and deletion of IAM access keys, potentially indicating key cycling attacks",
                severity: "medium",
                lastDetected: "2025-05-14T22:30:15.123Z",
                detectionCount: 5,
                mitreTactics: [
                    { tactic: "Persistence (TA0003)", technique: "T1098.001 - Account Manipulation: Additional Cloud Credentials" },
                    { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Disable Cloud Logs" }
                ],
                dataSource: "AWS IAM",
                queryFile: "ATT4CKQL - AWS - IAM - Access keys created and deleted within short time frame.kql",
                queryModalId: "iam-keys-created-deleted-kql",
                attackPath: "https://attack.mitre.org/techniques/T1098/001/",
                attackPathText: "MITRE ATT&CK T1098.001",
                sampleLogId: "iam-access-keys-created-deleted-logs"
            }
        ],
        
        azure: [
            {
                name: "Privileged Role Assignment",
                description: "Detects assignment of privileged roles in Azure AD that could indicate privilege escalation",
                severity: "high",
                lastDetected: "2025-05-15T11:20:45.789Z",
                detectionCount: 2,
                mitreTactics: [
                    { tactic: "Privilege Escalation (TA0004)", technique: "T1484.002 - Domain Policy Modification: Domain Trust Modification" },
                    { tactic: "Persistence (TA0003)", technique: "T1098.003 - Account Manipulation: Additional Cloud Roles" }
                ],
                dataSource: "Azure AD",
                queryFile: "ATT4CKQL - Azure - AAD - Privileged Role Assignment.kql",
                queryModalId: "azure-privileged-role-kql",
                attackPath: "https://attack.mitre.org/techniques/T1098/003/",
                attackPathText: "MITRE ATT&CK T1098.003",
                sampleLogId: "azure-privileged-role-logs"
            },
            {
                name: "Storage Account Public Access",
                description: "Identifies Azure Storage accounts configured for public access",
                severity: "medium",
                lastDetected: "2025-05-15T08:45:12.456Z",
                detectionCount: 3,
                mitreTactics: [
                    { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" },
                    { tactic: "Exfiltration (TA0010)", technique: "T1537 - Transfer Data to Cloud Account" }
                ],
                dataSource: "Azure Storage",
                queryFile: "ATT4CKQL - Azure - Storage - Public Access Detected.kql",
                queryModalId: "azure-storage-public-kql",
                attackPath: "https://attack.mitre.org/techniques/T1537/",
                attackPathText: "MITRE ATT&CK T1537",
                sampleLogId: "azure-storage-public-logs"
            }
        ],
        
        entraid: [
            {
                name: "MFA Method Changed",
                description: "Detects when multi-factor authentication methods are modified for user accounts",
                severity: "medium",
                lastDetected: "2025-05-15T13:15:30.234Z",
                detectionCount: 1,
                mitreTactics: [
                    { tactic: "Defense Evasion (TA0005)", technique: "T1556.006 - Modify Authentication Process: Multi-Factor Authentication" },
                    { tactic: "Persistence (TA0003)", technique: "T1098.005 - Account Manipulation: Device Registration" }
                ],
                dataSource: "Entra ID",
                queryFile: "ATT4CKQL - EntraID - MFA - Method Changed.kql",
                queryModalId: "entraid-mfa-change-kql",
                attackPath: "https://attack.mitre.org/techniques/T1556/006/",
                attackPathText: "MITRE ATT&CK T1556.006",
                sampleLogId: "entraid-mfa-change-logs"
            }
        ],
        
        gcp: [
            {
                name: "Service Account Key Created",
                description: "Detects creation of new service account keys that could indicate persistence establishment",
                severity: "medium",
                lastDetected: "2025-05-15T10:30:45.567Z",
                detectionCount: 2,
                mitreTactics: [
                    { tactic: "Persistence (TA0003)", technique: "T1098.001 - Account Manipulation: Additional Cloud Credentials" }
                ],
                dataSource: "GCP IAM",
                queryFile: "ATT4CKQL - GCP - IAM - Service Account Key Created.kql",
                queryModalId: "gcp-service-key-kql",
                attackPath: "https://attack.mitre.org/techniques/T1098/001/",
                attackPathText: "MITRE ATT&CK T1098.001",
                sampleLogId: "gcp-service-key-logs"
            }
        ],
        
        'active-directory': [
            {
                name: "DCSync Attack Detection",
                description: "Detects potential DCSync attacks using replication permissions abuse",
                severity: "high",
                lastDetected: "2025-05-15T14:20:15.890Z",
                detectionCount: 1,
                mitreTactics: [
                    { tactic: "Credential Access (TA0006)", technique: "T1003.006 - OS Credential Dumping: DCSync" }
                ],
                dataSource: "Active Directory",
                queryFile: "ATT4CKQL - AD - DCSync - Replication Rights Abuse.kql",
                queryModalId: "ad-dcsync-kql",
                attackPath: "https://attack.mitre.org/techniques/T1003/006/",
                attackPathText: "MITRE ATT&CK T1003.006",
                sampleLogId: "ad-dcsync-logs"
            }
        ],
        
        office365: [
            {
                name: "Mailbox Forward Rule Created",
                description: "Detects creation of mailbox forwarding rules that could indicate email exfiltration",
                severity: "medium",
                lastDetected: "2025-05-15T12:45:20.123Z",
                detectionCount: 3,
                mitreTactics: [
                    { tactic: "Collection (TA0009)", technique: "T1114.003 - Email Collection: Email Forwarding Rule" },
                    { tactic: "Exfiltration (TA0010)", technique: "T1020 - Automated Exfiltration" }
                ],
                dataSource: "Exchange Online",
                queryFile: "ATT4CKQL - O365 - Exchange - Mailbox Forward Rule.kql",
                queryModalId: "o365-forward-rule-kql",
                attackPath: "https://attack.mitre.org/techniques/T1114/003/",
                attackPathText: "MITRE ATT&CK T1114.003",
                sampleLogId: "o365-forward-rule-logs"
            }
        ]
    },
    
    // Initialize the platform tables system
    init: function(platform) {
        this.currentPlatform = platform || this.detectPlatform();
        
        if (!this.currentPlatform) {
            console.error('PlatformTables: No platform detected');
            return;
        }
        
        this.detectionRules = this.detectionRulesData[this.currentPlatform] || [];
        
        console.log(`PlatformTables: Initializing for platform: ${this.currentPlatform}`);
        console.log(`PlatformTables: Loaded ${this.detectionRules.length} detection rules`);
        
        // Initialize table rendering
        this.renderDetectionRules();
        
        // Bind responsive utilities
        this.initializeResponsiveFeatures();
    },
    
    // Auto-detect platform from URL
    detectPlatform: function() {
        const path = window.location.pathname;
        for (const platform of Object.keys(this.platformConfigs)) {
            if (path.includes(`/platforms/${platform}/`)) {
                return platform;
            }
        }
        return null;
    },
    
    // Main table rendering function
    renderDetectionRules: function() {
        const tableBody = document.getElementById('detection-rules-table-body');
        
        if (!tableBody) {
            console.error('PlatformTables: Table body element not found');
            return;
        }
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (this.detectionRules.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        No detection rules available for ${this.platformConfigs[this.currentPlatform]?.name || this.currentPlatform}
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
        
        console.log(`PlatformTables: Rendered ${this.detectionRules.length} detection rules for ${this.currentPlatform}`);
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
                    <strong>${this.escapeHtml(rule.name)}</strong>
                </div>
                <div class="detection-meta">
                    <span class="detection-timestamp">Last: ${this.formatTimestamp(rule.lastDetected)}</span>
                    <span class="detection-count">${rule.detectionCount} results</span>
                </div>
            </td>
            <td rowspan="${rowspan}" class="description-cell">
                ${this.escapeHtml(rule.description)}
            </td>
            <td class="mitre-tactic-cell">
                <div class="mitre-tactic">${this.escapeHtml(rule.mitreTactics[0].tactic)}</div>
                <div class="mitre-technique">${this.escapeHtml(rule.mitreTactics[0].technique)}</div>
            </td>
            <td rowspan="${rowspan}" class="data-source-cell">${this.escapeHtml(rule.dataSource)}</td>
            <td rowspan="${rowspan}" class="action-cell">
                <button class="view-query-btn" onclick="PlatformTables.openQueryModal('${rule.queryModalId}', '${rule.queryFile}')">
                    📄 View Query
                </button>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <a href="${rule.attackPath}" target="_blank" class="attack-path-link">
                    ${this.escapeHtml(rule.attackPathText)}
                </a>
            </td>
            <td rowspan="${rowspan}" class="action-cell">
                <button class="view-logs-btn sample-btn" onclick="PlatformTables.openSampleLogsModal('${rule.sampleLogId}')">
                    📊 Sample Logs
                </button>
            </td>
        `;
        
        return row;
    },
    
    // Create additional rows for multiple MITRE tactics
    createMitreRow: function(mitreTactic) {
        const row = document.createElement('tr');
        row.className = 'mitre-additional-row';
        row.innerHTML = `
            <td class="mitre-tactic-cell">
                <div class="mitre-tactic">${this.escapeHtml(mitreTactic.tactic)}</div>
                <div class="mitre-technique">${this.escapeHtml(mitreTactic.technique)}</div>
            </td>
        `;
        return row;
    },
    
    // Modal opening functions that integrate with ATT4CKQL system
    openQueryModal: function(modalId, queryFile) {
        if (window.ATT4CKQL && window.ATT4CKQL.ModalManager) {
            const fileName = queryFile.split('/').pop();
            const title = fileName.replace('.kql', ' - Detection Query');
            
            window.ATT4CKQL.ModalManager.open(modalId, {
                loadContent: true,
                type: 'query',
                fileName: fileName,
                platform: this.currentPlatform,
                title: title
            });
        } else {
            // Fallback to global function
            openQueryModal(modalId, queryFile);
        }
    },
    
    openSampleLogsModal: function(sampleLogId) {
        if (window.ATT4CKQL && window.ATT4CKQL.ModalManager) {
            window.ATT4CKQL.ModalManager.open(sampleLogId, {
                loadContent: true,
                type: 'logs',
                platform: this.currentPlatform
            });
        } else {
            // Fallback to global function
            openExternalModal(sampleLogId, 'logs');
        }
    },
    
    // Utility functions
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
    
    escapeHtml: function(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    updateResultsCount: function(count) {
        const resultCountElement = document.getElementById('results-count');
        if (resultCountElement) {
            resultCountElement.textContent = `${count} result${count !== 1 ? 's' : ''}`;
        }
        
        // Update page title if needed
        const platformName = this.platformConfigs[this.currentPlatform]?.name || this.currentPlatform;
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
        const platformConfig = this.platformConfigs[this.currentPlatform];
        if (platformConfig && platformConfig.color) {
            document.documentElement.style.setProperty('--platform-accent', platformConfig.color);
        }
    },
    
    // Method to add new detection rules dynamically
    addDetectionRule: function(rule) {
        if (!this.detectionRules) {
            this.detectionRules = [];
        }
        
        this.detectionRules.push(rule);
        this.renderDetectionRules();
    },
    
    // Method to filter detection rules
    filterRules: function(filterFn) {
        const originalRules = this.detectionRulesData[this.currentPlatform] || [];
        this.detectionRules = originalRules.filter(filterFn);
        this.renderDetectionRules();
    },
    
    // Method to search detection rules
    searchRules: function(searchTerm) {
        const originalRules = this.detectionRulesData[this.currentPlatform] || [];
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
    
    // Method to reset filters
    resetFilters: function() {
        this.detectionRules = this.detectionRulesData[this.currentPlatform] || [];
        this.renderDetectionRules();
    },
    
    // Method to get current platform info
    getPlatformInfo: function() {
        return {
            platform: this.currentPlatform,
            config: this.platformConfigs[this.currentPlatform],
            rulesCount: this.detectionRules.length,
            totalRulesCount: (this.detectionRulesData[this.currentPlatform] || []).length
        };
    }
};

// =====================================
// AUTO-INITIALIZATION
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize if on a platform page
    const platform = PlatformTables.detectPlatform();
    if (platform && document.getElementById('detection-rules-table-body')) {
        console.log('PlatformTables: Auto-initializing for detected platform:', platform);
        
        // Small delay to ensure all other scripts are loaded
        setTimeout(() => {
            PlatformTables.init(platform);
        }, 100);
    }
});

// =====================================
// LEGACY COMPATIBILITY
// =====================================
// Support for existing global functions
window.renderDetectionRules = function() {
    if (PlatformTables.currentPlatform) {
        PlatformTables.renderDetectionRules();
    }
};

window.updateResultsCount = function(count) {
    PlatformTables.updateResultsCount(count);
};

window.formatTimestamp = function(timestamp) {
    return PlatformTables.formatTimestamp(timestamp);
};

// Expose PlatformTables globally
window.PlatformTables = PlatformTables;