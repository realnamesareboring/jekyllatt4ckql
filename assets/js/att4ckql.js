/*!
 * ATT4CKQL Core JavaScript v2.3 - EXACT MATCH TO ORIGINAL
 * Enhanced KQL Queries for Microsoft Sentinel
 * Consolidated from main.js + aws-script.js + table.js (EXACT STRUCTURE)
 * FIXES: Uses original table.js detection rules data and modal IDs
 * Created: 2025
 */

// =====================================
// NAMESPACE & CONFIGURATION
// =====================================
window.ATT4CKQL = window.ATT4CKQL || {
    version: '2.3.0',
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
    
    // Query count storage (FIXED - from main.js)
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
// DETECTION RULES DATA (EXACT FROM ORIGINAL table.js)
// =====================================

// Define all detection rules with their metadata (enhanced for Azure styling)
const detectionRules = [
    // EC2 IMDSv1 Vulnerability Detection
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
    
    // EC2 Suspicious Deployment Detection
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
    
    // EC2 Password Data Retrieved
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
        queryModalId: "ec2-password-kql",
        attackPath: "https://attack.mitre.org/techniques/T1552/005/",
        attackPathText: "MITRE ATT&CK T1552.005",
        sampleLogId: "ec2-password-data-retrieved-logs"
    },
    
    // Snapshot Exfiltration Detection
    {
        name: "Snapshot Exfiltration Detection",
        description: "Detects potential data exfiltration through EBS snapshot sharing or copying to external accounts",
        severity: "high",
        lastDetected: "2025-05-14T22:18:33.987Z",
        detectionCount: 1,
        mitreTactics: [
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage Object" }
        ],
        dataSource: "AWS EC2",
        queryFile: "ATT4CKQL - AWS - EC2 - Snapshot Exfiltration Detection.kql",
        queryModalId: "snapshot-exfil-kql",
        attackPath: "https://attack.mitre.org/techniques/T1530/",
        attackPathText: "Data from Cloud Storage Object",
        sampleLogId: "snapshot-exfiltration-logs"
    },
    
    // S3 Bucket Modification Detection
    {
        name: "S3 Bucket Modification Detection",
        description: "Identifies suspicious modifications to S3 bucket configurations that could lead to data exposure",
        severity: "high",
        lastDetected: "2025-05-15T08:42:17.789Z",
        detectionCount: 6,
        mitreTactics: [
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage Object" },
            { tactic: "Exfiltration (TA0010)", technique: "T1537 - Transfer Data to Cloud Account" }
        ],
        dataSource: "AWS S3",
        queryFile: "ATT4CKQL - AWS - S3 - Bucket Modification Detection.kql",
        queryModalId: "s3-modification-kql",
        attackPath: "https://attack.mitre.org/techniques/T1530/",
        attackPathText: "Data from Cloud Storage Object",
        sampleLogId: "s3-bucket-modification-logs"
    },
    
    // S3 Buckets Accessed from Untrusted Networks
    {
        name: "S3 Buckets Accessed from Untrusted Networks",
        description: "Detects S3 bucket access from IP addresses outside of trusted corporate networks",
        severity: "medium",
        lastDetected: "2025-05-15T11:33:44.234Z",
        detectionCount: 12,
        mitreTactics: [
            { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" },
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage Object" }
        ],
        dataSource: "AWS S3",
        queryFile: "ATT4CKQL - AWS - S3 - Buckets Accessed from Untrusted Networks.kql",
        queryModalId: "s3-untrusted-access-kql",
        attackPath: "https://attack.mitre.org/techniques/T1190/",
        attackPathText: "Exploit Public-Facing Application",
        sampleLogId: "s3-buckets-untrusted-network-logs"
    },
    
    // IAM Access Keys Created or Deleted
    {
        name: "IAM Access Keys Created or Deleted",
        description: "Monitors for suspicious creation or deletion of IAM access keys that could indicate account compromise",
        severity: "medium",
        lastDetected: "2025-05-14T19:27:55.123Z",
        detectionCount: 8,
        mitreTactics: [
            { tactic: "Persistence (TA0003)", technique: "T1098.001 - Account Manipulation: Additional Cloud Credentials" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Access Keys Created or Deleted.kql",
        queryModalId: "iam-keys-created-deleted-kql",
        attackPath: "https://attack.mitre.org/techniques/T1098/001/",
        attackPathText: "Account Manipulation: Additional Cloud Credentials",
        sampleLogId: "iam-access-keys-created-deleted-logs"
    },
    
    // IAM Cloud User Creation
    {
        name: "IAM Cloud User Creation",
        description: "Detects the creation of new IAM users, which could indicate unauthorized access or privilege escalation attempts",
        severity: "medium",
        lastDetected: "2025-05-13T13:45:22.456Z",
        detectionCount: 5,
        mitreTactics: [
            { tactic: "Persistence (TA0003)", technique: "T1136.003 - Create Account: Cloud Account" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Cloud User Creation.kql",
        queryModalId: "iam-user-creation-kql",
        attackPath: "https://attack.mitre.org/techniques/T1136/003/",
        attackPathText: "Create Account: Cloud Account",
        sampleLogId: "iam-cloud-user-creation-logs"
    },
    
    // IAM Console Login without MFA
    {
        name: "IAM Console Login without MFA",
        description: "Identifies console logins to AWS accounts that bypass multi-factor authentication requirements",
        severity: "high",
        lastDetected: "2025-05-15T09:18:33.678Z",
        detectionCount: 4,
        mitreTactics: [
            { tactic: "Initial Access (TA0001)", technique: "T1078.004 - Valid Accounts: Cloud Accounts" },
            { tactic: "Defense Evasion (TA0005)", technique: "T1562.006 - Impair Defenses: Indicator Blocking" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Console Login without MFA.kql",
        queryModalId: "iam-login-no-mfa-kql",
        attackPath: "https://attack.mitre.org/techniques/T1078/004/",
        attackPathText: "Valid Accounts: Cloud Accounts",
        sampleLogId: "iam-console-login-no-mfa-logs"
    },
    
    // Network Malicious IP Connections
    {
        name: "Network - Malicious IP Connections to AWS Resources",
        description: "Detects connections to AWS resources from known malicious IP addresses or suspicious geographic locations",
        severity: "high",
        lastDetected: "2025-05-15T14:33:22.651Z",
        detectionCount: 3,
        mitreTactics: [
            { tactic: "Command and Control (TA0011)", technique: "T1071.001 - Application Layer Protocol: Web Protocols" },
            { tactic: "Exfiltration (TA0010)", technique: "T1048 - Exfiltration Over Alternative Protocol" }
        ],
        dataSource: "AWS VPC Flow Logs",
        queryFile: "ATT4CKQL - AWS - Network - Malicious IP Connections to AWS Resources.kql",
        queryModalId: "network-malicious-ips-kql",
        attackPath: "https://attack.mitre.org/techniques/T1048/",
        attackPathText: "Exfiltration Over Alternative Protocol",
        sampleLogId: "aws-malicious-ip-connections-logs"
    },
    
    // Network Suspicious Changes
    {
        name: "Network - Suspicious Changes to AWS Network Resources",
        description: "Detects unexpected modifications to VPC, security groups, or network ACLs that could indicate network-based attacks",
        severity: "medium",
        lastDetected: "2025-05-15T14:45:22.651Z",
        detectionCount: 8,
        mitreTactics: [
            { tactic: "Initial Access (TA0001)", technique: "T1659 - Content Injection" },
            { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" },
            { tactic: "Initial Access (TA0001)", technique: "T1133 - External Remote Services" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Network - Suspicious Changes to AWS Network Resources.kql",
        queryModalId: "network-suspicious-changes-kql",
        attackPath: "https://attack.mitre.org/techniques/T1190/",
        attackPathText: "Exploit Public-Facing Application",
        sampleLogId: "aws-network-suspicious-changes-logs"
    },
    
    // Operations Changes to AWS Configurations
    {
        name: "Operations - Changes to AWS Configurations",
        description: "Identifies potentially high-risk changes to AWS account configurations and security settings",
        severity: "high",
        lastDetected: "2025-05-15T14:55:22.651Z",
        detectionCount: 8,
        mitreTactics: [
            { tactic: "Defense Evasion (TA0005)", technique: "T1578.005 - Modify Cloud Compute Infrastructure: Modify Cloud Compute Configurations" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Operations - Changes to AWS Configurations.kql",
        queryModalId: "operations-config-changes-kql",
        attackPath: "https://attack.mitre.org/techniques/T1578/005/",
        attackPathText: "Modify Cloud Compute Infrastructure: Modify Cloud Compute Configurations",
        sampleLogId: "aws-config-changes-logs"
    },
    
    // Security CloudTrail Tamper Detection
    {
        name: "Security - CloudTrail tamper detection",
        description: "Detects attempts to disable, delete, or modify CloudTrail logs to evade detection",
        severity: "high",
        lastDetected: "2025-05-15T14:55:32.651Z",
        detectionCount: 7,
        mitreTactics: [
            { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Impair Defenses: Disable Cloud Logs" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Security - CloudTrail tamper detection.kql",
        queryModalId: "security-cloudtrail-tamper-kql",
        attackPath: "https://attack.mitre.org/techniques/T1562/008/",
        attackPathText: "Impair Defenses: Disable Cloud Logs",
        sampleLogId: "aws-cloudtrail-tamper-logs"
    },
    
    // Security Enhanced GuardDuty
    {
        name: "Security - Enhanced GuardDuty",
        description: "Correlates and enhances GuardDuty findings with additional context for improved threat detection",
        severity: "high",
        lastDetected: "2025-05-15T15:05:42.651Z",
        detectionCount: 11,
        mitreTactics: [
            { tactic: "Initial Access (TA0001)", technique: "T1190 - Exploit Public-Facing Application" },
            { tactic: "Persistence (TA0003)", technique: "T1098 - Account Manipulation" },
            { tactic: "Command and Control (TA0011)", technique: "T1071.001 - Application Layer Protocol: Web Protocols" }
        ],
        dataSource: "AWS GuardDuty",
        queryFile: "ATT4CKQL - AWS - Security - Enhanced GuardDuty.kql",
        queryModalId: "security-enhanced-guardduty-kql",
        attackPath: "https://attack.mitre.org/techniques/T1190/",
        attackPathText: "Exploit Public-Facing Application",
        sampleLogId: "aws-enhanced-guardduty-logs"
    },
    
    // Security Unauthorized API Calls
    {
        name: "Security - Unauthorized API Calls",
        description: "Identifies API calls made with insufficient permissions or from unexpected sources indicating potential compromise",
        severity: "medium",
        lastDetected: "2025-05-15T15:15:52.651Z",
        detectionCount: 14,
        mitreTactics: [
            { tactic: "Discovery (TA0007)", technique: "T1580 - Cloud Infrastructure Discovery" },
            { tactic: "Initial Access (TA0001)", technique: "T1078.004 - Valid Accounts: Cloud Accounts" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Security - Unauthorized API Calls.kql",
        queryModalId: "security-unauthorized-api-kql",
        attackPath: "https://attack.mitre.org/techniques/T1580/",
        attackPathText: "Cloud Infrastructure Discovery",
        sampleLogId: "aws-unauthorized-api-calls-logs"
    }
];

// =====================================
// CORE UTILITY FUNCTIONS (FROM AWS-SCRIPT.JS)
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
    }
};

// =====================================
// QUERY COUNTER MODULE (FROM MAIN.JS - EXACT)
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
// THEME MANAGEMENT (FROM MAIN.JS - EXACT)
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
// DETECTION RULES RENDERING (FROM TABLE.JS - EXACT)
// =====================================

/**
 * Create MITRE tactics display fragment
 */
function createMitreTacticsFragment(mitreTactics) {
    const fragment = document.createDocumentFragment();
    
    mitreTactics.forEach((item, index) => {
        const tacticElement = document.createElement('div');
        tacticElement.className = 'mitre-tactic';
        tacticElement.textContent = item.tactic;
        
        fragment.appendChild(tacticElement);
        
        const techniqueElement = document.createElement('div');
        techniqueElement.className = 'mitre-technique';
        techniqueElement.textContent = item.technique;
        fragment.appendChild(techniqueElement);
        
        // Add spacing if not the last item
        if (index < mitreTactics.length - 1) {
            const spacer = document.createElement('div');
            spacer.style.marginBottom = '8px';
            fragment.appendChild(spacer);
        }
    });
    
    return fragment;
}

/**
 * Format timestamp for Azure-style display
 */
function formatTimestamp(timestamp) {
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

/**
 * Renders the detection rules table with Azure styling (FROM TABLE.JS - EXACT)
 */
function renderDetectionRules() {
    const tableBody = document.getElementById('detection-rules-table-body');
    
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }
    
    // Clear any existing content
    tableBody.innerHTML = '';
    
    detectionRules.forEach(rule => {
        // Calculate rowspan based on number of MITRE tactics (minimum 1)
        const rowspan = Math.max(1, rule.mitreTactics.length);
        
        // First row with main detection information
        const firstRow = document.createElement('tr');
        firstRow.className = 'detection-row';
        
        // Detection Name (with rowspan and enhanced styling)
        const nameCell = document.createElement('td');
        nameCell.setAttribute('rowspan', rowspan);
        nameCell.className = 'detection-name-cell';
        
        const nameContainer = document.createElement('div');
        nameContainer.innerHTML = `
            <div class="detection-title">
                <span class="severity-indicator severity-${rule.severity}"></span>
                <strong>${rule.name}</strong>
            </div>
            <div class="detection-meta">
                <span class="detection-timestamp">Last: ${formatTimestamp(rule.lastDetected)}</span>
                <span class="detection-count">${rule.detectionCount} results</span>
            </div>
        `;
        nameCell.appendChild(nameContainer);
        firstRow.appendChild(nameCell);
        
        // Description (with rowspan)
        const descriptionCell = document.createElement('td');
        descriptionCell.setAttribute('rowspan', rowspan);
        descriptionCell.className = 'description-cell';
        descriptionCell.textContent = rule.description;
        firstRow.appendChild(descriptionCell);
        
        // First MITRE Tactic/Technique
        const firstTacticCell = document.createElement('td');
        firstTacticCell.className = 'mitre-tactic-cell';
        
        const firstTacticElement = document.createElement('div');
        firstTacticElement.className = 'mitre-tactic';
        firstTacticElement.textContent = rule.mitreTactics[0].tactic;
        firstTacticCell.appendChild(firstTacticElement);
        
        const firstTechniqueElement = document.createElement('div');
        firstTechniqueElement.className = 'mitre-technique';
        firstTechniqueElement.textContent = rule.mitreTactics[0].technique;
        firstTacticCell.appendChild(firstTechniqueElement);
        
        firstRow.appendChild(firstTacticCell);
        
        // Data Source (with rowspan)
        const dataSourceCell = document.createElement('td');
        dataSourceCell.setAttribute('rowspan', rowspan);
        dataSourceCell.className = 'data-source-cell';
        dataSourceCell.textContent = rule.dataSource;
        firstRow.appendChild(dataSourceCell);
        
        // Query Link (with rowspan and enhanced button)
        const queryLinkCell = document.createElement('td');
        queryLinkCell.setAttribute('rowspan', rowspan);
        queryLinkCell.className = 'action-cell';
        const queryButton = document.createElement('button');
        queryButton.className = 'view-query-btn';
        queryButton.innerHTML = `📄 View Query`;
        queryButton.setAttribute('onclick', `openQueryModal('${rule.queryModalId}', '${rule.queryFile}')`);
        queryLinkCell.appendChild(queryButton);
        firstRow.appendChild(queryLinkCell);
        
        // Attack Path Reference (with rowspan and enhanced link)
        const attackPathCell = document.createElement('td');
        attackPathCell.setAttribute('rowspan', rowspan);
        attackPathCell.className = 'action-cell';
        const attackPathLink = document.createElement('a');
        attackPathLink.href = rule.attackPath;
        attackPathLink.textContent = rule.attackPathText;
        attackPathLink.target = '_blank';
        attackPathLink.className = 'attack-path-link';
        attackPathCell.appendChild(attackPathLink);
        firstRow.appendChild(attackPathCell);
        
        // Sample Logs (with rowspan and enhanced button)
        const sampleLogsCell = document.createElement('td');
        sampleLogsCell.setAttribute('rowspan', rowspan);
        sampleLogsCell.className = 'action-cell';
        const sampleLogsButton = document.createElement('button');
        sampleLogsButton.className = 'view-logs-btn sample-btn';
        sampleLogsButton.innerHTML = `📊 Sample Logs`;
        sampleLogsButton.setAttribute('onclick', `openExternalModal('${rule.sampleLogId}', 'logs')`);
        sampleLogsCell.appendChild(sampleLogsButton);
        firstRow.appendChild(sampleLogsCell);
        
        // Add the first row to the table body
        tableBody.appendChild(firstRow);
        
        // Add additional rows for remaining MITRE tactics (if any)
        if (rule.mitreTactics && rule.mitreTactics.length > 1) {
            for (let i = 1; i < rule.mitreTactics.length; i++) {
                const additionalRow = document.createElement('tr');
                additionalRow.className = 'mitre-additional-row';
                
                const tacticCell = document.createElement('td');
                tacticCell.className = 'mitre-tactic-cell';
                
                const tacticElement = document.createElement('div');
                tacticElement.className = 'mitre-tactic';
                tacticElement.textContent = rule.mitreTactics[i].tactic;
                tacticCell.appendChild(tacticElement);
                
                const techniqueElement = document.createElement('div');
                techniqueElement.className = 'mitre-technique';
                techniqueElement.textContent = rule.mitreTactics[i].technique;
                tacticCell.appendChild(techniqueElement);
                
                additionalRow.appendChild(tacticCell);
                tableBody.appendChild(additionalRow);
            }
        }
    });
    
    // Update results count
    updateResultsCount(detectionRules.length);
    
    console.log(`Detection rules table rendered with ${detectionRules.length} rules in Azure style.`);
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
    const resultCountElement = document.getElementById('results-count');
    if (resultCountElement) {
        resultCountElement.textContent = `${count} result${count !== 1 ? 's' : ''}`;
    }
}

// =====================================
// MODAL FUNCTIONS (FROM AWS-SCRIPT.JS - EXACT)
// =====================================

// Helper function to get the correct path with baseurl
function getBasePath(path) {
    return ATT4CKQL.utils.getBasePath(path);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return ATT4CKQL.utils.escapeHtml(unsafe);
}

// Function to load modal content from Jekyll-served files (FROM AWS-SCRIPT.JS - EXACT)
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

// Function to fetch explanation content from local Jekyll files (FROM AWS-SCRIPT.JS - EXACT)
async function fetchExplanationContent(modalId) {
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
        
        const explanationPath = getBasePath(`/Amazon Web Services/explained/${explanationId}-kqlexplained.html`);
        const response = await fetch(explanationPath);
        
        if (!response.ok) {
            return '<div id="explanation-section"><h3>Explanation</h3><p>Explanation content not available.</p></div>';
        }
        
        const content = await response.text();
        return `<div id="explanation-section" class="query-explanation">${content}</div>`;
    } catch (error) {
        return '<div id="explanation-section"><h3>Explanation</h3><p>Failed to load explanation.</p></div>';
    }
}

// Function to process and display query content with explanation (FROM AWS-SCRIPT.JS - EXACT)
async function processQueryContent(modalId, queryContent, fileName) {
    const modalElement = document.getElementById(modalId);
    
    // Store the query content for copying
    window[`${modalId}_content`] = queryContent;
    
    // Fetch the explanation content
    const explanationContent = await fetchExplanationContent(modalId);
    
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
                        <pre class="kql-query"><code>${escapeHtml(queryContent)}</code></pre>
                    </div>
                </div>
                ${explanationContent}
            </div>
        </div>
    `;
}

// Function to fetch KQL query from Jekyll-served files (FROM AWS-SCRIPT.JS - EXACT)
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
        await processQueryContent(modalId, cleanedQuery, fileName);
        
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

// Function to copy query to clipboard (FROM AWS-SCRIPT.JS - EXACT)
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

// Function to scroll to explanation section (FROM AWS-SCRIPT.JS - EXACT)
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

// Function to initialize detection table
function initializeDetectionTable() {
    const platform = ATT4CKQL.utils.getCurrentPlatform();
    if (platform) {
        console.log('Initializing detection table for platform:', platform);
        setTimeout(() => {
            renderDetectionRules();
        }, 100);
    }
}

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
                closeModal(event.target.id);
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
    if (platform) {
        ATT4CKQL.utils.log(`Detected platform: ${platform}`);
    }
    
    this.utils.log('ATT4CKQL initialization complete');
};

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
    
    // Initialize detection table if on platform page
    setTimeout(() => {
        if (document.getElementById('detection-rules-table-body')) {
            console.log('Initializing Azure-style detection rules table...');
            renderDetectionRules();
        }
    }, 100);
});

// Expose ATT4CKQL globally for debugging and external access
window.ATT4CKQL = ATT4CKQL;