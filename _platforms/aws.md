---
layout: platform
title: "AWS Detection Rules with MITRE ATT&CK Mapping"
permalink: /platforms/aws/
---

<h1>AWS Detection Rules with MITRE ATT&CK Mapping</h1>

<table>
    <thead>
        <tr>
            <th>Detection Name</th>
            <th>Description</th>
            <th>MITRE Tactics & Techniques</th>
            <th>Data Source</th>
            <th>Query Link</th>
            <th>Attack Path Reference</th>
            <th>Sample Logs</th>
        </tr>
    </thead>
    <tbody id="detection-rules-table-body">
        <tr>
            <td colspan="7" class="loading-indicator">Loading detection rules...</td>
        </tr>
    </tbody>
</table>

<!-- Modal containers - COMPLETE SET -->
<div id="modal-containers">
    <!-- EC2 Related Modals -->
    <div id="imdsv1-logstest" class="modal"></div> 
    <div id="aws-imdsv1-kql" class="modal"></div>
    <div id="ec2-suspicious-deployment-logs" class="modal"></div>
    <div id="ec2-suspicious-deployment-kql" class="modal"></div>
    <div id="ec2-password-data-retrieved-logs" class="modal"></div>
    <div id="ec2-password-kql" class="modal"></div>
    <div id="snapshot-exfiltration-logs" class="modal"></div>
    <div id="snapshot-exfil-kql" class="modal"></div>

    <!-- S3 Related Modals -->
    <div id="s3-bucket-modification-logs" class="modal"></div>
    <div id="s3-modification-kql" class="modal"></div>
    <div id="s3-buckets-untrusted-network-logs" class="modal"></div>
    <div id="s3-untrusted-access-kql" class="modal"></div>
    
    <!-- IAM Related Modals -->
    <div id="iam-access-keys-created-deleted-logs" class="modal"></div>
    <div id="iam-keys-created-deleted-kql" class="modal"></div>
    <div id="iam-cloud-user-creation-logs" class="modal"></div>
    <div id="iam-user-creation-kql" class="modal"></div>
    <div id="iam-console-login-no-mfa-logs" class="modal"></div>
    <div id="iam-login-no-mfa-kql" class="modal"></div>
    
    <!-- Network Related Modals -->
    <div id="aws-malicious-ip-connections-logs" class="modal"></div>
    <div id="network-malicious-ips-kql" class="modal"></div>
    <div id="aws-network-suspicious-changes-logs" class="modal"></div>
    <div id="network-suspicious-changes-kql" class="modal"></div>
    
    <!-- Other AWS Service Modals -->
    <div id="aws-config-changes-logs" class="modal"></div>
    <div id="operations-config-changes-kql" class="modal"></div>
    <div id="aws-cloudtrail-tamper-logs" class="modal"></div>
    <div id="security-cloudtrail-tamper-kql" class="modal"></div>
    <div id="aws-enhanced-guardduty-logs" class="modal"></div>
    <div id="security-enhanced-guardduty-kql" class="modal"></div>
    <div id="aws-unauthorized-api-calls-logs" class="modal"></div>
    <div id="security-unauthorized-api-kql" class="modal"></div>
</div>