# T1110 - Brute Force

## Overview
- **Name of KQL query**: T1110 - Brute Force
- **Name of MITRE ATT&CK TTP**: [T1110 - Brute Force](https://attack.mitre.org/techniques/T1110/)
- **Detection source**: Active Directory
- **Detection table required**: SecurityEvents

## Description of Query and Goals
This KQL query is designed to detect mass account lockouts within a short time frame in an Active Directory environment. The goal is to identify potential brute force attacks or misconfigurations that result in multiple account lockouts, which could indicate a security incident or operational issue.

## Proof of Concept
(Here will be provided a tool to simulate activity)

## KQL Query
```kql
//TT1110
let threshold = 20;
let ReasontoSubStatus = datatable(SubStatus: string, Reason: string) [
    "0xc000005e", "There are currently no logon servers available to service the logon request.",
    "0xc0000064", "User logon with misspelled or bad user account",
    "0xc000006a", "User logon with misspelled or bad password",
    "0xc000006d", "Bad user name or password",
    "0xc000006e", "Unknown user name or bad password",
    "0xc000006f", "User logon outside authorized hours",
    "0xc0000070", "User logon from unauthorized workstation",
    "0xc0000071", "User logon with expired password",
    "0xc0000072", "User logon to account disabled by administrator",
    "0xc00000dc", "Indicates the Sam Server was in the wrong state to perform the desired operation",
    "0xc0000133", "Clocks between DC and other computer too far out of sync",
    "0xc000015b", "The user has not been granted the requested logon type (aka logon right) at this machine",
    "0xc000018c", "The logon request failed because the trust relationship between the primary domain and the trusted domain failed",
    "0xc0000192", "An attempt was made to logon, but the Netlogon service was not started",
    "0xc0000193", "User logon with expired account",
    "0xc0000224", "User is required to change password at next logon",
    "0xc0000225", "Evidently a bug in Windows and not a risk",
    "0xc0000234", "User logon with account locked",
    "0xc00002ee", "Failure Reason: An Error occurred during Logon",
    "0xc0000413", "Logon Failure: The machine you are logging onto is protected by an authentication firewall. The specified account is not allowed to authenticate to the machine"
];
SecurityEvent
| where EventID == 4625
| where AccountType =~ "User"
| where SubStatus == '0xc0000064' //and Account !in ('\\', '-\\-')
| extend SubStatus = tolower(SubStatus)
| lookup kind=leftouter ReasontoSubStatus on SubStatus
| extend Reason = coalesce(Reason, strcat('Unknown reason substatus: ', SubStatus))
| summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), FailedLogonCount = count() by bin(TimeGenerated, 10m), EventID, Computer, Account, TargetAccount, TargetUserName, TargetDomainName, LogonType, LogonTypeName, LogonProcessName, Status, SubStatus, Reason, SourceComputerId, WorkstationName, IpAddress
| where FailedLogonCount >= threshold
| project FirstAttempt = StartTime, LastAttempt = EndTime, EventID, FailedLogonCount, TargetAccount, Status, SubStatus, Reason, Source = WorkstationName, SourceIP = IpAddress, Destination = Computer
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
