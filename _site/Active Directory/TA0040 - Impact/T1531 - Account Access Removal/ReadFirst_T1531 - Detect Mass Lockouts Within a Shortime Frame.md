# T1531 - Detect Mass Lockouts Within a Short Time Frame

## Overview
- **Name of KQL query**: T1531 - Detect Mass Lockouts Within a Short Time Frame
- **Name of MITRE ATT&CK TTP**: [T1531 - Account Lockout](https://attack.mitre.org/techniques/T1531/)
- **Detection source**: Active Directory
- **Detection table required**: SecurityEvents

## Description of Query and Goals
This KQL query is designed to detect mass account lockouts within a short time frame in an Active Directory environment. The goal is to identify potential brute force attacks or misconfigurations that result in multiple account lockouts, which could indicate a security incident or operational issue.

## Proof of Concept
(Here will be provided a tool to simulate activity)

## KQL Query
```kql
let LockoutDetails = SecurityEvent
//| where TimeGenerated >= ago(20m)
| where EventID == "4740" and Activity == "4740 - A user account was locked out."
| extend SourceHost = TargetDomainName
| extend DestinationHost = Computer
| summarize LockoutCount = count() by TimeGenerated, EventID, TargetUserName, SourceHost, DestinationHost
| where LockoutCount < 10
| project TimeGenerated, EventID, TargetUserName, SourceHost, DestinationHost;
let TotalLockouts = SecurityEvent
//| where TimeGenerated >= ago(20m)
| where EventID == "4740" and Activity == "4740 - A user account was locked out."
| summarize TotalLockoutCount = count();
union LockoutDetails, TotalLockouts
```

## Expected output

| TimeGenerated [UTC]      | EventID  | TargetUserName | Computer Name  | Domain                     |
|--------------------------|----------|----------------|----------------|----------------------------|
| 9/27/2024, 1:57:10.214 PM| 4740     | LockMeOut5     | WINDEV2311EVAL | DC01.logs4loot.com         |
| 9/27/2024, 1:57:09.143 PM| 4740     | LockMeOut4     | WINDEV2311EVAL | DC01.logs4loot.com         |
| 9/27/2024, 1:57:08.043 PM| 4740     | LockMeOut3     | WINDEV2311EVAL | DC01.logs4loot.com         |
| 9/27/2024, 1:57:06.289 PM| 4740     | LockMeOut2     | WINDEV2311EVAL | DC01.logs4loot.com         |
| 9/27/2024, 1:57:04.575 PM| 4740     | LockMeOut1     | WINDEV2311EVAL | DC01.logs4loot.com         |
| 9/26/2024, 9:17:17.075 PM| 4740     | MSmith         | WINDEV2311EVAL | DC01.logs4loot.com         |

# Step by Step Breakdown of the Query

## LockoutDetails
This part of the query filters the `SecurityEvent` table for events where the `EventID` is “4740” and the activity indicates a user account lockout. It then extends the data to include the source and destination hosts and summarizes the lockout count by various fields.

**Purpose:** To gather detailed information about each lockout event.

**Things to look out for:** Ensure the `EventID` and `Activity` fields are correctly specified to capture the relevant lockout events.

## TotalLockouts
This part of the query also filters the `SecurityEvent` table for the same `EventID` and activity but summarizes the total count of lockouts.

**Purpose:** To get an overall count of lockout events within the specified time frame.

**Things to look out for:** Make sure the time frame is appropriately set to capture the desired period of activity.

## Union
The final part of the query combines the detailed lockout information with the total lockout count.

**Purpose:** To provide a comprehensive view of both individual lockout events and the total number of lockouts.

**Things to look out for:** Verify that the union operation correctly merges the datasets without duplicating or omitting any data.

---

This query helps in identifying patterns of account lockouts that could indicate potential security threats or operational issues, enabling timely investigation and response.
