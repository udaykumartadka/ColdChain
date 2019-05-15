workflow  container{
    param(
       
        [Parameter(Mandatory=$true)]
        [string]
        $tenantId,

        [Parameter(Mandatory=$true)]
        [string]
        $clientId,

        [Parameter(Mandatory=$true)]
        [string]
        $clientSecret,

        [Parameter(Mandatory=$true)]
        [string]
        $deviceManagementUri,
        
        [Parameter(Mandatory=$true)]
        [string]
        $azureAccountName,

        [Parameter(Mandatory=$true)]
        [string]
        $azurePassword,

        [Parameter(Mandatory=$true)]
        [string]
        $cosmosDBAccountKey,

        [Parameter(Mandatory=$true)]
        [string]
        $cosmosDbAccountName,
        
        [Parameter(Mandatory=$true)]
        [string]
        $cosmosDbName,

        [Parameter(Mandatory=$true)]
        [string]
        $objectId
    )

    InlineScript{
    
        $tenantId = $Using:tenantId
        $clientId = $Using:clientId
        $clientSecret = $Using:clientSecret
        $deviceManagementUri = $Using:deviceManagementUri
        $azureAccountName = $Using:azureAccountName
        $azurePassword = $Using:azurePassword
        $cosmosDBAccountKey = $Using:cosmosDBAccountKey
        $cosmosDbAccountName = $Using:cosmosDbAccountName
        $cosmosDbName = $Using:cosmosDbName
        $objectId = $Using:objectId

    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned  -Force
    $password = ConvertTo-SecureString $azurePassword -AsPlainText -Force
    $psCred = New-Object System.Management.Automation.PSCredential($azureAccountName, $password)
    start-Sleep -s 20
    Login-AzureRmAccount -TenantId $tenantId -Credential $psCred 
    start-Sleep -s 20

    $primaryKey = ConvertTo-SecureString -String $cosmosDBAccountKey -AsPlainText -Force
    $cosmosDbContext = New-CosmosDbContext -Account $cosmosDbAccountName -Database $cosmosDbName -Key $primaryKey
    start-Sleep -s 20

    # Create CosmosDB
    New-CosmosDbDatabase -Context $cosmosDbContext -Id $cosmosDbName
    start-Sleep -s 30

    # Create CosmosDB Collections
    New-CosmosDbCollection -Context $cosmosDbContext -Id 'TitanAlertCollection'  -OfferThroughput 400
    start-Sleep -s 20
    New-CosmosDbCollection -Context $cosmosDbContext -Id 'TitanTelemetryCollection' -OfferThroughput 1000
    start-Sleep -s 20
    New-CosmosDbCollection -Context $cosmosDbContext -Id 'TitanHeartBeatCollection' -OfferThroughput 400
    start-Sleep -s 30

    #Update Azure AD applications reply urls
    Connect-AzureAd -TenantId $tenantId -Credential $psCred -InformationAction Ignore
    $replyURLList = @($deviceManagementUri);  
    Write-Host '', 'Configuring and setting the Azure AD reply URLs' -ForegroundColor Green
    Set-AzureADApplication -ObjectId $objectId -ReplyUrls $replyURLList -Verbose
}
}