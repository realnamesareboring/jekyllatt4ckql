# ATT4CKQL

## Project Overview

This project aims to develop a comprehensive suite of KQL queries and PowerShell scripts designed to simulate attack activities in alignment with MITRE ATT&CK framework TTPs, thereby validating detection capabilities.

## Key Components

- **KQL Queries**: Queries that range from multiple technologies (e.g., Microsoft Active Directory, EntraID, Amazon Web Services, etc.)
- **PowerShell Scripts**: Simulated activity that generates logs for validation.
- **Validation Steps**: To ensure the KQL queries are accurate and effective.

### Validation Steps:

1. **Run the Query**: Execute the query in the Log Analytics workspace.
2. **Check Results**: Verify that the query returns the expected login events.
3. **Data Source Verification**: Ensure that the `SigninLogs` table is receiving data from Entra ID.
4. **Performance Testing**: Check the execution time and optimize if necessary.
5. **Simulate Events**: Generate test login events and verify that they are captured by the query.


<!--
## Validation Steps for KQL Queries

To ensure that the KQL queries work as intended, follow these validation steps:

### Initial Query Testing

1. **Run the Query**: Execute the KQL query in the Azure Monitor or Microsoft Sentinel environment.
2. **Check Results**: Verify that the query returns the expected results. Look for any anomalies or unexpected data.

### Data Source Verification

1. **Verify Data Sources**: Ensure that the data sources referenced in the query are correctly configured and actively sending data.
2. **Check Data Freshness**: Confirm that the data is up-to-date and relevant to the query.

### Performance Testing

1. **Evaluate Query Performance**: Check the query execution time and resource usage. Optimize the query if it takes too long to execute or consumes excessive resources.
2. **Load Testing**: Test the query under different load conditions to ensure it performs well under various scenarios.

### Cross-Technology Validation

1. **Active Directory**: Validate queries related to domain controllers and user authentication.
2. **Entra ID**: Test queries for tracking MFA modifications and other Entra ID-related events.
3. **Cloud Resources**: Ensure queries for monitoring cloud resources (e.g., Azure VMs, storage accounts) return accurate and relevant data.

### Alert and Rule Validation

1. **Simulate Events**: Generate test events to trigger the alerts and rules defined by the KQL queries.
2. **Verify Alerts**: Ensure that the alerts are triggered correctly and that the notifications are sent as expected.
3. **Review Logs**: Check the logs to confirm that the events are logged accurately and that the queries are capturing the correct data.

### Continuous Monitoring and Improvement

1. **Regular Reviews**: Periodically review and update the KQL queries to adapt to new threats and changes in the environment.
2. **Feedback Loop**: Collect feedback from users and stakeholders to identify areas for improvement and make necessary adjustments.
-->

# Example KQL Query Validation

Here’s an example of how to validate a KQL query for tracking user logins in Entra ID:

```kql
SigninLogs
| where ResultType == 0
| summarize count() by UserPrincipalName, bin(TimeGenerated, 1h)
| order by count_ desc
```

# Security Solutions TTP Matrix

| Tactic                | Technique                          | Active Directory | Solution A  | 
|-----------------------|------------------------------------|------------------|-------------|
| Initial Access        | Phishing                           | ✅               | ✅         | 
| Execution             | PowerShell                         | ✅               | ✅         | 
| Persistence           | Account Manipulation               | ✅               | ❌         | 
| Privilege Escalation  | Credential Dumping                 | ✅               | ✅         | 
| Defense Evasion       | Obfuscated Files or Information    | ✅               | ✅         | 
| Credential Access     | Brute Force                        | ✅               | ✅         | 
| Discovery             | Network Service Scanning           | ✅               | ✅         | 
| Lateral Movement      | Remote Services                    | ✅               | ✅         | 
| Collection            | Data from Information Repositories | ✅               | ✅         | 
| Exfiltration          | Exfiltration Over Web Service      | ✅               | ✅         | 
| Impact                | Data Destruction                   | ✅               | ✅         | 

## Legend
- ✅: Supported
- ❌: Not Supported