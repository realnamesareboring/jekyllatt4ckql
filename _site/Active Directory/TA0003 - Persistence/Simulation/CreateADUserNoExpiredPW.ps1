# Import the Active Directory module
Import-Module ActiveDirectory

# Define the domain controller and credentials
$domainController = "dc01.logs4loot.com"
$credential = Get-Credential

# Create a new user
$newuser = New-ADUser -Name "Badguylives" `
           -AccountPassword (ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force) `
           -Enabled $true `
           -GivenName "Bad" `
           -Surname "Guy" `
           -SamAccountName "bguy" `
           -UserPrincipalName "bguy@logs4loot.com" `
           -PasswordNeverExpires $true `
           -Passthru

Set-ADUser -Identity $newuser.SamAccountName -PasswordNeverExpires $true

Write-Host "User created successfully with account set to never expire."
