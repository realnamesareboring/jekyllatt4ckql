# Import the Active Directory module
Import-Module ActiveDirectory

# Define the domain controller and credentials
$domainController = "dc01.logs4loot.com"
$credential = Get-Credential

# Create a new user
$newuser = New-ADUser -Name "60secstolive" `
           -AccountPassword (ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force) `
           -Enabled $true `
           -GivenName "60" `
           -Surname "secs" `
           -SamAccountName "60secstolive" `
           -UserPrincipalName "60secstolive@logs4loot.com" `
           -PasswordNeverExpires $true `
           -Passthru

Set-ADUser -Identity $newuser.SamAccountName -PasswordNeverExpires $true

Write-Host "User created successfully and will self destruct in 1 minute."

# Wait for 10 minutes (600 seconds)
Start-Sleep -Seconds 60

# Delete the user
Remove-ADUser -Identity $newuser.SamAccountName -Confirm:$false

Write-Host "User deleted successfully after 1 minute."
