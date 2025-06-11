/**
 * table.js - Dynamically populates the AWS detection rules table with Azure styling
 * For use with MITRE ATT&CK mapped AWS detection rules
 */

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
        description: "Detects when Windows password data is retrieved from EC2 instances, which may indicate credential theft",
        severity: "medium",
        lastDetected: "2025-05-15T14:23:45.123Z",
        detectionCount: 5,
        mitreTactics: [
            { tactic: "Credential Access (TA0006)", technique: "T1555.006 - Credentials from Password Stores: Cloud Secrets Management Stores" }
        ],
        dataSource: "AWS EC2",
        queryFile: "ATT4CKQL - AWS - EC2 - Password Data Retrieved.kql",
        queryModalId: "ec2-password-kql",
        attackPath: "https://stratus-red-team.cloud/attack-techniques/AWS/aws.credential-access.ec2-get-password-data/",
        attackPathText: "stratus-red-team: Retrieve EC2 Password Data",
        sampleLogId: "ec2-password-data-retrieved-logs"
    },
    
    // AMI/EBS/RDS Snapshot Exfiltration
    {
        name: "AMI/EBS/RDS Snapshot Exfiltration Detected",
        description: "Identifies when snapshots are shared with unauthorized AWS accounts, indicating potential data exfiltration",
        severity: "high",
        lastDetected: "2025-05-15T10:15:27.331Z",
        detectionCount: 5,
        mitreTactics: [
            { tactic: "Exfiltration (TA0010)", technique: "T1537.001 - Transfer Data to Cloud Account: Cloud Storage Object" },
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage" },
            { tactic: "Defense Evasion (TA0005)", technique: "T1578.002 - Modify Cloud Compute Infrastructure: Create Snapshot" },
            { tactic: "Initial Access/Persistence (TA0001/TA0003)", technique: "T1078.004 - Cloud Accounts" }
        ],
        dataSource: "AWS EBS",
        queryFile: "ATT4CKQL - AWS - EC2 - Snapshot Exfiltration Detected.kql",
        queryModalId: "snapshot-exfil-kql",
        attackPath: "https://stratus-red-team.cloud/attack-techniques/AWS/",
        attackPathText: "stratus-red-team: Exfiltration",
        sampleLogId: "snapshot-exfiltration-logs"
    },
    
    // S3 Bucket Modification
    {
        name: "S3 Bucket has been created/accessed/deleted",
        description: "Identifies S3 bucket operations from untrusted networks that could indicate unauthorized access",
        severity: "medium",
        lastDetected: "2025-05-15T14:53:45.123Z",
        detectionCount: 6,
        mitreTactics: [
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage" },
            { tactic: "Execution (TA0002)", technique: "T1537 - Transfer Data to Cloud Account" }
        ],
        dataSource: "AWS S3",
        queryFile: "ATT4CKQL - AWS - S3 - Bucket modification detected.kql",
        queryModalId: "s3-modification-kql",
        attackPath: "https://stratus-red-team.cloud/attack-techniques/AWS/aws.execution.ec2-launch-unusual-instances/",
        attackPathText: "stratus-red-team: Launch Unusual EC2 instances",
        sampleLogId: "s3-bucket-modification-logs"
    },
    
    // S3 Bucket Accessed from Untrusted Network
    {
        name: "S3 Bucket accessed from an untrusted network",
        description: "Identifies S3 bucket operations from known malicious IP addresses and untrusted networks",
        severity: "high",
        lastDetected: "2025-05-15T14:57:32.123Z",
        detectionCount: 7,
        mitreTactics: [
            { tactic: "Exfiltration (TA0010)", technique: "T1619 - Cloud Storage Object Discovery" },
            { tactic: "Collection (TA0009)", technique: "T1530 - Data from Cloud Storage" },
            { tactic: "Impact (TA0040)", technique: "T1485 - Data Destruction" },
            { tactic: "Exfiltration (TA0010)", technique: "T1537 - Transfer Data to Cloud Account" }
        ],
        dataSource: "AWS S3",
        queryFile: "ATT4CKQL - AWS - S3 - Buckets accessed from untrusted network.kql",
        queryModalId: "s3-untrusted-access-kql",
        attackPath: "https://www.intigriti.com/researchers/blog/hacking-tools/hacking-misconfigured-aws-s3-buckets-a-complete-guide",
        attackPathText: "intigriti: Hacking misconfigured AWS S3 buckets: A complete guide",
        sampleLogId: "s3-buckets-untrusted-network-logs"
    },
    
    // IAM Access Keys Created and Deleted
    {
        name: "IAM - Access keys created and deleted within short time frame",
        description: "Detects when IAM access keys are created and quickly deleted, suggesting possible credential theft or attacker covering tracks",
        severity: "high",
        lastDetected: "2025-05-15T14:45:22.123Z",
        detectionCount: 5,
        mitreTactics: [
            { tactic: "Persistence, Privilege Escalation (TA0003, TA0004)", technique: "T1098.001 - Account Manipulation: Additional Cloud Credentials" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Access keys created and deleted within short time frame.kql",
        queryModalId: "iam-keys-created-deleted-kql",
        attackPath: "https://attack.mitre.org/techniques/T1098/001/",
        attackPathText: "Account Manipulation: Additional Cloud Credentials",
        sampleLogId: "iam-access-keys-created-deleted-logs"
    },
    
    // IAM Cloud User Account Creation
    {
        name: "IAM - Cloud User Account Creation",
        description: "Detects the creation of new IAM users, which could indicate persistence establishment in the environment",
        severity: "medium",
        lastDetected: "2025-05-15T14:55:12.743Z",
        detectionCount: 6,
        mitreTactics: [
            { tactic: "Persistence (TA0003)", technique: "T1136.003 - Create Account: Cloud Account" },
            { tactic: "Discovery (TA0007)", technique: "T1069.003 - Permission Groups Discovery: Cloud Groups" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Cloud User Account Creation.kql",
        queryModalId: "iam-user-creation-kql",
        attackPath: "https://attack.mitre.org/techniques/T1136/003/",
        attackPathText: "Create Account: Cloud Account",
        sampleLogId: "iam-cloud-user-creation-logs"
    },
    
    // IAM Management Console Login No MFA
    {
        name: "IAM - Management Console successful login with no MFA",
        description: "Detects when users log in to the AWS Management Console without multi-factor authentication",
        severity: "medium",
        lastDetected: "2025-05-15T14:32:17.652Z",
        detectionCount: 7,
        mitreTactics: [
            { tactic: "Credential Access, Defense Evasion, Persistence (TA0006, TA0005, TA0003)", technique: "T1556.006 - Modify Authentication Process: Multi-Factor Authentication" }
        ],
        dataSource: "AWS IAM",
        queryFile: "ATT4CKQL - AWS - IAM - Management Console successful login with no MFA.kql",
        queryModalId: "iam-login-no-mfa-kql",
        attackPath: "https://attack.mitre.org/techniques/T1556/006/",
        attackPathText: "Modify Authentication Process: Multi-Factor Authentication",
        sampleLogId: "iam-console-login-no-mfa-logs"
    },
    
    // Network Connection to Malicious IPs
    {
        name: "Network - Connection to malicious IPs and Domains",
        description: "Identifies AWS resources communicating with known malicious IP addresses or domains",
        severity: "high",
        lastDetected: "2025-05-15T14:23:17.652Z",
        detectionCount: 7,
        mitreTactics: [
            { tactic: "Discovery (TA0007)", technique: "T1526 - Cloud Service Discovery" },
            { tactic: "Lateral Movement (TA0008)", technique: "T1021.007 - Remote Services: Cloud Services" },
            { tactic: "Exfiltration (TA0010)", technique: "T1048 - Exfiltration Over Alternative Protocol" }
        ],
        dataSource: "AWS VPC Flow Logs",
        queryFile: "ATT4CKQL - AWS - Network - Connection to malicious IPs and Domains.kql",
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
            { tactic: "Defense Evasion (TA0005)", technique: "T1562.008 - Impair Defenses: Disable or Modify Cloud Logs" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Security - CloudTrail tamper detection.kql",
        queryModalId: "security-cloudtrail-tamper-kql",
        attackPath: "https://attack.mitre.org/techniques/T1562/008/",
        attackPathText: "Impair Defenses: Disable or Modify Cloud Logs",
        sampleLogId: "aws-cloudtrail-tamper-logs"
    },
    
    // Security Enhanced GuardDuty
    {
        name: "Security - Enhanced GuardDuty",
        description: "Augments Amazon GuardDuty findings with additional context and severity adjustments",
        severity: "medium",
        lastDetected: "2025-05-15T14:55:32.651Z",
        detectionCount: 8,
        mitreTactics: [
            { tactic: "Discovery (TA0007)", technique: "T1526 - Cloud Service Discovery" }
        ],
        dataSource: "AWS GuardDuty",
        queryFile: "ATT4CKQL - AWS - Security - Enhanced GuardDuty.kql",
        queryModalId: "security-enhanced-guardduty-kql",
        attackPath: "https://attack.mitre.org/techniques/T1526/",
        attackPathText: "Cloud Service Discovery",
        sampleLogId: "aws-enhanced-guardduty-logs"
    },
    
    // Security Unauthorized API Calls
    {
        name: "Security - Unauthorized API Calls",
        description: "Detects unauthorized or suspicious API calls that could indicate compromised credentials or insider threats",
        severity: "high",
        lastDetected: "2025-05-15T14:52:22.651Z",
        detectionCount: 8,
        mitreTactics: [
            { tactic: "Execution (TA0002)", technique: "T1059.009 - Command and Scripting Interpreter: Cloud API" }
        ],
        dataSource: "AWS CloudTrail",
        queryFile: "ATT4CKQL - AWS - Security - Unauthorized API Calls.kql",
        queryModalId: "security-unauthorized-api-kql",
        attackPath: "https://attack.mitre.org/techniques/T1059/009/",
        attackPathText: "Command and Scripting Interpreter: Cloud API",
        sampleLogId: "aws-unauthorized-api-calls-logs"
    }
];

/**
 * Renders the MITRE ATT&CK tactics and techniques for a detection rule
 * @param {Array} mitreTactics - Array of tactic and technique objects
 * @returns {DocumentFragment} - Document fragment with formatted tactics and techniques
 */
function renderMitreTactics(mitreTactics) {
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
 * Renders the detection rules table with Azure styling
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
        descriptionCell.className = 'detection-description';
        descriptionCell.textContent = rule.description;
        firstRow.appendChild(descriptionCell);
        
        // MITRE Tactics & Techniques (first tactic only in first row)
        const firstTacticCell = document.createElement('td');
        firstTacticCell.className = 'mitre-tactic-cell';
        if (rule.mitreTactics && rule.mitreTactics.length > 0) {
            const tacticElement = document.createElement('div');
            tacticElement.className = 'mitre-tactic';
            tacticElement.textContent = rule.mitreTactics[0].tactic;
            firstTacticCell.appendChild(tacticElement);
            
            const techniqueElement = document.createElement('div');
            techniqueElement.className = 'mitre-technique';
            techniqueElement.textContent = rule.mitreTactics[0].technique;
            firstTacticCell.appendChild(techniqueElement);
        }
        firstRow.appendChild(firstTacticCell);
        
        // Data Source (with rowspan and enhanced styling)
        const dataSourceCell = document.createElement('td');
        dataSourceCell.setAttribute('rowspan', rowspan);
        dataSourceCell.className = 'data-source-cell';
        dataSourceCell.innerHTML = `<span class="data-source-tag">${rule.dataSource}</span>`;
        firstRow.appendChild(dataSourceCell);
        
        // Query Link (with rowspan and enhanced button)
        const queryLinkCell = document.createElement('td');
        queryLinkCell.setAttribute('rowspan', rowspan);
        queryLinkCell.className = 'action-cell';
        const queryButton = document.createElement('button');
        queryButton.className = 'view-logs-btn query-btn';
        queryButton.innerHTML = `🔍 View Query`;
        queryButton.setAttribute('onclick', `openQueryModal('${rule.queryModalId}', '${rule.queryFile}')`);
        queryLinkCell.appendChild(queryButton);
        firstRow.appendChild(queryLinkCell);
        
        // Attack Path Reference (with rowspan and enhanced styling)
        const attackPathCell = document.createElement('td');
        attackPathCell.setAttribute('rowspan', rowspan);
        attackPathCell.className = 'attack-path-cell';
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

// Initialize the table when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Azure-style detection rules table...');
    
    // Add a small delay to ensure all styles are loaded
    setTimeout(() => {
        renderDetectionRules();
    }, 100);
});