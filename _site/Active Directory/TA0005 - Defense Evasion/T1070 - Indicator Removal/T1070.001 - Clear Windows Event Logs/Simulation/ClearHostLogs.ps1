# Define the domain controller and the logs to clear
$domainController = "DC01.logs4loot.com"
$logsToClear = @("Application", "System", "Security")

# Prompt for credentials
$credential = Get-Credential

# Function to clear event logs
function Clear-EventLogs {
    param (
        [string]$computerName,
        [string[]]$logNames,
        [pscredential]$credential
    )
    foreach ($logName in $logNames) {
        try {
            Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock {
                param ($logName)
                Clear-EventLog -LogName $logName -Confirm:$false
            } -ArgumentList $logName
            Write-Host "Cleared $logName log on $computerName"
        } catch {
            Write-Host "Failed to clear $logName log on ${computerName}: $_"
        }
    }
}

# Clear the logs on the specified domain controller
Clear-EventLogs -computerName $domainController -logNames $logsToClear -credential $credential
