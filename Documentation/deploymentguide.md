# Microsoft

# ColdChain Solution

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de0.png)

### Table of Contents 

- [1. Deployment Guide](#1-deployment-guide)
- [2. Prerequisites for Deploying ARM Templatee](#2-prerequisites-for-deploying-arm-template)
    - [2.1 Integrating Applications with Azure Active Directory ](#21-integrating-applications-with-azure-active-directory)
      - [2.1.1. To Register a new Application using the Azure Portal](#211-to-register-a-new-application-using-the-azure-portal)
      - [2.1.2. To add Application Credentials or Permissions to Access Web APIs](#212-to-add-application-credentials-or-permissions-to-access-web-apis)
      - [2.1.3 To get Tenant ID](#213-to-get-tenant-id)
      - [2.1.4 To get application ID and Authentication Key](#214-to-get-application-id-and-authentication-Key)
      - [2.1.5 Creating Session ID](#215-creating-session-id)
- [3. ARM Template Input Parameters](#3-arm-template-input-parameters)
- [4. ARM Template Deployment](#4-ARM-template-deployment)
    - [4.1 ARM Template Deployment Using Azure Portal](#41-arm-template-deployment-using-azure-portal)
      - [4.1.1 Inputs](#411-inputs)
      - [4.1.2 Outputs](#412-outputs)
    - [4.2. ARM Template Deployment Using Azure CLI](#42-arm-template-deployment-using-azure-CLI)
      - [4.2.1 Outputs](#421-outputs)
 - [5. Post Deployment Steps](#5-post-deployment-steps)
    - [5.1 Deploying smart contract and getting the Contract Address](#51-deploying-smart-contract-and-getting-the-contract-address)
       - [5.1.1 Running Blockchain servic in TMT-VM](#511-running-blockchain-servic-in-tmt-vm)
    - [5.2 Performing Azure Site Recovery for Block Chain Virtual Machines](#52-performing-azure-site-recovery-for-block-chain-virtual-machines)
    - [5.3 Importing Function App into the API Management ](#53-importing-function-app-into-the-API-management )
    - [5.4 Building the Web App code](#54-building-the-web-app-code)
    - [5.5 Connecting Devices to the solution](#55-connecting-devices-to-the-solution)
      - [5.5.1 TMT-250 Device Configuration](#551-TMT-250-device-configuration)
      - [5.5.2 Connecting Rigado](#552-connecting-rigado)
      - [5.5.3 Connecting Beacons](#553-connecting-beacons)
 - [6. Device Configuration](#6-device-configuration)
    - [6.1 Build and Deploy Snap to Gateway](#61-build-and-deploy-snap-to-gateway)
      - [6.1.1 Snap Building](#611-snap-building)
    - [6.2 Uploading the snap to Gateway](#62-uploading-the-snap-to-gateway)
    - [6.3 Verifying the device configurations](#63-verifying-the-device-configurations)
    
    
    
    
    
    
    
## 1. Deployment Guide

This document explains about how to deploy Cold Chain solution using ARM template. You can deploy the ARM template in the following two ways:
- **Using Azure portal** 
- **Using Azure CLI**

This document explains about input parameters, output parameters and points to be noted while deploying ARM template.

## 2. Prerequisites for Deploying ARM Template

### 2.1. Integrating Applications with Azure Active Directory
    
Any application that wants to use the capabilities of Azure AD must first be registered in an Azure AD tenant. This registration process involves giving Azure AD details about your application, such as the URL where it’s located, the URL to send replies after a user is authenticated, the URI that identifies the app, and so on. 
    
#### 2.1.1. To Register a new Application using the Azure Portal 

1.	Sign in to the **Azure portal.**
2.	In the left-hand navigation pane, click the **Azure Active Directory(symbol)** service, click **App registrations,** and click **+ New application registration.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d1.png)

3. When the **Create** page appears, enter your application's registration information:
  - **Name**: Enter the application name
  - **Application type:**
      * Select "Web app / API" for client applications and resource/API applications that are installed on a secure server. This setting is used for OAuth confidential web clients and public user-agent-based clients. The same application can also expose both a client and resource/API.
  - **Sign-On URL:** For "Web app / API" applications, provide the base URL of your app. For example, **https://localhost** might be the URL for a web app running on your local machine. Users would use this URL to sign in to a web client application.
  
4.When finished, click **Create.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d2.png)

#### 2.1.2. To add Application Credentials or Permissions to Access Web APIs

1. Click the **Azure Active Directory** service, click **App registrations,** and then find/click the application you want to configure.
2. You are taken to the application's main registration page, which opens the **Settings** page of the application. To add a secret key for your web application's credentials:
3. Click the **Keys** section on the **Settings** page.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d3.png)

4. Add a description for your key and Select duration, click **Save**. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d4.png)   
    
5. The right-most column will contain the key value, after you save the configuration changes. **Be sure to copy the key** for use in your client application code, as it is not accessible once you leave this page.  

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d4-1.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d5.png)

#### 2.1.3. To get Tenant ID

1. Select **Azure Active Directory.**
2.	To get the tenant ID, select for your **Azure AD Properties tenant** and **Copy** the **Directory ID**. This value is your **tenant ID.**
3. **Note down** the Copied **Directory ID** which is highlighted in the below figure, this will be used while deploying the **ARM template.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d6.png)

#### 2.1.4. To get application ID and Authentication Key

1. From **App registrations** in **Azure Active Directory, select** your **application.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d7.png)

2. **Copy** the **Application ID** and **object ID.** The application ID value is referred as the **client ID.**
3. **Note down** the Copied **Application ID** and **object ID** which is highlighted in the below figure, this will be used while deploying the **ARM template.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d8.png)

#### 2.1.5. Creating Session ID

1.	Use the below **URL to generate GUID.**

<https://www.guidgenerator.com/>

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d9.png)

2. Click **Generate some GUIDs!** This will generate **GUID** in Results box. 
    
3.	**Copy** and **Note down** the generated GUID which is highlighted in the below figure, this will be used while deploying the **ARM template.**  

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d10.png)

## 3. ARM Template Input Parameters
    
 In the parameters section of the template, specify the values as inputs when deploying the ARM Template. These parameter values enable you to customize the deployment by providing values that are tailored for your environment (such as dev, Staging and production).
 
 
|   **Parameter name**    |    **Description**                               |    **Allowed Values**    |     **Default Values**   |      
|-------------------------|--------------------------------------------------|------------------------- |--------------------------- |   
| **solution type**       | provide the name of the solution                 | ColdChain                | ColdChain                  |
| **DeploymentType**      | Provide the deployment type of your solution     | Basic or Standard or Premium | Basic-Solution         |
| **apiManagement**       | Select YES/NO if you choose deployment type as Standard(or) Premium SolutionSelect YES/NO to deploy Api Management Service to provide security to function App.It also cost effective| YES or NO      |            |
| **location**            | Choose the location where resources to be deployed(The list of below regions are Geo-Paid regions)| EastUS2, CentralUS, WestUS2, WestCentralUS, CanadaCentral,        CanadaEast, AustraliaEast, AustraliaSouthEast, CentralIndia, SouthIndia, EastAsia, SouthEastAsia, JapanWest, JapanEast, KoreaCentral, KoreaSouth, UKSouth, UKWest| eastus2 |   
| **oms-region**          | Choose location for OMS Log Analytics            | australiasoutheast, canadacentral, centralindia, eastus,japaneast, southeastasia, uksouth, westeurope| eastus  |                                                                    
| **appInsightsLocation** | specify the region for application insights      |eastus, northeurope, southcentralus, southeastasia, westeurope, westus2| westus2 |                                                                                                           
|**sqlAdministratorLogin**| Provide the user name for the SQL server,please make a note of Username this will be used further.|| sqluser|      
| **sqlAdministratorLoginPassword** | Provide the password for the SQL server, make a note of the Password this will be used further.|  | Password@1234 |                                      
|   **Tenant Id**        | Tenant Id of the created Azure active directory application. |   |   acxxx5-a7xxx-4ca7-87eb-c5xxxxxd38    |
|   **Client Id**   | Application ID of the created Azure active directory application. For information,see <(https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory -integrating-applications)> in the Microsoft documentation.  |   | xxxxx-a79a-xxxx-87eb-c5exxxxxd38  |                      
| **Client Secret** | Client Secret of the created Azure active directory application. For instructions, see (https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create- service-principal-portal#get-application-id-and-authentication-key)  in the Microsoft documentation. |  |  xxxxx-xxx-4xx7-8xxb-xxxxxxxxxd38 |                              
|   **Object Id**       | Object Id of the created Azure active directory application.  |  | xxxxx-3774-455-244-xxxxxxxxx         |
|**Azure Account Name** |  azure portal login username.                                 |  | username@sysgain.com                 |
| **Azure Password**    | azure portal login password.                                  |  |    Passxxx123                        |
|**accountSaasProperties**| Here we need to provide the immediate day/time gap between the deployment  start and completion time in the place of signed Expiry || {"signedServices":"bfqt","signedPermission":"rwdlacup","signedExpiry": "2019-02-02T00:00:00Z","signedProtocol":"https","signedResourceTypes":"sco"} |                                    
| **Session Id**        |Provide the guid prefix for the runbook job to be created. Generate using https://www.guidgenerator.com/online-guid-generator.aspx)   |  | 3791180c-24c5-4290-8459-a454feee90ab |
|  **cosmosdbModuleUri** |Please use the cosmosdb module which placed under /code folder byplacing it in any public storage | | Provide the url where the code is stored  |                                  
| **azureAdPreviewModuleUri**|please provide the Azure AD Preview module which placed under /code folder by placing it in any public storage   |  | Provide the url where the code is stored |                                 
|   **functionAppUrl**    |  Please use function app build file url here which is in public storage || Provide the url where the code is stored|
|  **webAppBuildfileUrl** |  Please use web app build file url here which is in public storage || Provide the url where the code is stored     |
| **sqldbbacpacUrl**      |Please use the sql bacpac file which placed under /scripts folder by placing it in any public storage|  | Provide the url where the code is stored|
|   **namePrefix**        | String used as a base for naming resources (6 alphanumeric characters or less).A unique hash is prepended to the string for some resources, while resource-specific information is appended    | |ccbc |
|  **authType**           |  Authorization type for SSH access to VMs    | | password        |
|  **adminUsername**      | Administrator username of each deployed VM (alphanumeric characters only) |        | gethadmin       |
|  **adminPassword**      |  Administrator password for each deployed VM                         |             | Password@1234   |
|  **adminSSHKey**        |  SSH RSA public key file as a string                                 |             | password        |
|  **restrictAccess**     |  If 1, use specified IP address/subnet to restrict access to all endpoints.If 0, access is open to any IP address || 0|
|  **ipAddressOrSubnet**  |  If restrictAccess is set to 1, specify an individual IP address or IP subnet/address range here from where access to all endpoints will be alloweduthorization type for SSH access to VMs |     |    |
|  **numBlockMakers**     |       Number of mining nodes to create for each consortium member         |               1 or 2 | 1 |
|  **numVoters**          |       Number of mining nodes to create for each consortium member         |                      | 1 |
|  **numObservers**       |       Number of mining nodes to create for each consortium member         |                      | 1 |
|  **storagePerformance** |      Storage performance level for virtual machines                       |                | Standard|
|  **vmSize**             |  Size of the virtual machine used for mining nodes                       |         |  Standard_D1_v2  |
|  **consortiumMemberId** |  In a multi-member setup, each member should have a unique value to ensure they can connect |  | 0    |
| **ethereumAccountPsswd**|  Password used to secure the Ethereum accounts that will be generated    |         | Password@1234    |
|  **passphrase**         |  Password used to generate the private keys associated with the Ethereum accounts that are generated.Consider a password with sufficient randomness to ensure a strong private key |               | Password@1234        |
|  **ethereumNetworkID**  |  Private Ethereum network ID to which to connect (max 9-digit number)   |           | 10101010     |
|  **baseUrl**          |  The base URL for dependent assets||Provide your block chain repository base url to download the block chain services|


ipAddressOrSubnet and adminSSHKey both are the Optional cases.    
    
## 4. ARM Template Deployment 

Azure Resource Manager allows you to provision your applications using a declarative template. In a single template, you can deploy multiple services along with their dependencies. The template consists of JSON and expressions that you can use to construct values for your deployment. You use the same template to repeatedly deploy your application during every stage of the application lifecycle.
Resource Manager provides a consistent management layer to perform tasks through Azure PowerShell, Azure CLI, Azure portal, REST API, and client SDKs.
Resource manager provides the following features:
-	Deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.
-	Repeatedly deploy your solution through the development lifecycle and your resources are deployed in a consistent state.
-	Manage your infrastructure through declarative templates rather than scripts.
-	Define the dependencies between resources so they're deployed in the correct order.
-	Apply access control to all services in your resource group because Role-Based Access Control (RBAC) is natively integrated into the management platform.
-	Apply tags to resources to logically organize all the resources in your subscription.

### 4.1. ARM Template Deployment Using Azure Portal

1.	Click the below **Git hub** repo URL.
2.	Select from **branch** as shown in the following figure.
3.	Select **Raw** from the top right corner.
   
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d11.png) 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d12.png)

4. **Copy** the raw template and **paste** in your **Azure Portal** for template deployment.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d13.png)
    
**To deploy a template for Azure Resource Manager, follow the below steps.**
1.	Go to **Azure portal.**
2.	Navigate to **Create a resource (+)**, search for **Template deployment.**
3.	Click **Create** button and click **Build your own Template in the editor** as shown in the following figure.
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d13-1.PNG)
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d13-2.PNG)
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d14.png)

4.	The **Edit template** page is displayed as shown in the following figure.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d15.png) 

5.	**Replace / paste** the template and click **Save** button.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d16.png)

6. The **Custom deployment** page is displayed as shown in the following figure. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d17.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d18.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d19.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d20.png)

#### 4.1.1. Inputs

These parameter values enable you to customize the deployment by providing values. These parameters allow to choose the solution type, region and AD Application details. 

**Parameters for Basic Solution:**

If you want to deploy the **Basic Solution** you must enter the values for the parameters mentioned in the **section3**.

For **basic solution,** enter the parameters as shown below. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/1.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/2.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/3.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/4.PNG)

**Parameters for Standard Solution**

If you want to deploy the **standard solution** you must enter the below parameters as shown in the screens.

For **standard solution,** select new values for **numBlockMakers as 2, apiManagement as YES/NO** and keep the default values for other parameters. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/5.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/6.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/7.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/8.PNG)

**Parameters for Premium solution:**

If you want to deploy the **Premium solution** you must enter the below parameters as shown in the screens.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/9.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/10.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/11.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/12.PNG)

Once all the parameters are entered, check in the **terms and conditions** check box and click **Purchase.**

After the successful deployment of the ARM template, the following **resources** are created in a **Resource Group.**

1.	App Service
-	Function App
-	WebApp
2.	App Service Plan
-	App service plan
-	Consumption Plan
3.	Application Insights
4.	Automation Account
5.	Availability Set
6.	Azure Cosmos DB Account
7.	IoT Hub
8.	Load Balancer
9.	Log Analytics Workspace
10.	Network Interface
11.	Network Security Group
12.	Public Ip Address
13.	RUN Book
14.	OMS Solution
-	Azure sql analytics
-	Azure WebApp analytics
15.	SQL Database
16.	SQL Server
17.	Storage Account
18.	Stream Analytics Job
19.	Virtual Machine
20.	Virtual Network
21. Quorum Blockchain setup

The above resources are deployed for **Basic Solution.**

Once the solution is deployed successfully, navigate to the **resource group** to view the list of resources that are created as shown below.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d33.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d34.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d35.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d36.png)

#### 4.1.2. Outputs
Go to **Resource Group** -> Click **Deployments** then click on **Microsoft.Template** after that click on **Outputs**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d37.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d38.png)

### 4.2. ARM Template Deployment Using Azure CLI

**Azure CLI** is used to deploy your resources to **Azure**. The Resource Manager template you deploy, can either be a local file on your machine, or an external file that is in a repository like GitHub.  

**Azure Cloud Shell** is an interactive, browser-accessible shell for managing Azure resources. Cloud Shell enables access to a browser-based command-line experience built with Azure management tasks in mind.

Deployment can proceed within the **Azure Portal** via **Azure Cloud Shell.** 
Customize maintemplate.parameters.json file 

1.	Log in to **Azure portal.** 
2.	Open the **prompt.** 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d39.png)


3.	Select **Bash (Linux) environment** as shown in the following figure. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d40.png)


4.	Select **Confirm** button.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d41.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d43.png)
  
5.	Copy maintemplate.json and maintemplate.parameters.json to your **Cloud Shell** before updating the parameters. 
6.	Create **maintemplate.json** using the following command. 

**$ vim maintemplate.json**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d44.png)
    
7.	Paste your **maintemplate.json** in editor as shown below and save the file.     
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d45.png)
       
8.	Create **maintemplate.parameters.json** using the following command. 

**$ vim maintemplate.parameters.json**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d46.png)
  
 9. Paste your **maintemplate.parameters.json** in editor. 
 
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d47.png)
       
 10. Update the following parameters in **maintemplate.parameters.json** file 
 
solution type

DeploymentType

apiManagement

location

oms-region

appinsightsLocation

sqlAdministratorLogin

sqlAdministratorLoginPassword

Tenant Id

Client Id

Client Secret

Object Id

Azure Account Name

Azure Password

**AccountSaasProperties:** Make sure to provide the signed expiry value is more than the current deployment time. (ex: a day more than the deployment date or minimum of 3 hrs. gap between the deployment provisioning and success)

Session Id

cosmosdbModuleUri

azureAdPreviewModuleUri

functionAppUrl

webAppBuildfileUrl

sqldbbacpacUr

namePrefix

authType

adminUsername

adminPassword

adminSSHKey

restrictAccess

ipAddressOrSubnet

numBlockMakers

numVoters

numObservers

storagePerformance

vmSize

consortiumMemberId

ethereumAccountPsswd

passphrase

ethereumNetworkID

baseUrl

**Description**: To create a resource group, use **az group create** command, 

It uses the name parameter to specify the name for resource group (-n) and location parameter to specify the location (-l).

**Syntax: az** group create -n "resource group name" -l "location"
   
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d48.png)
 
11.	Execute the Template Deployment 
12.	Use the **az group deployment create** command to deploy the ARM template

**Description:** To deploy the ARM Template, you require two files: 

**maintemplate.json** – contains the resource & its dependency resources to be provisioned from the ARM template

**maintemplate.parameters.jso**n –contains the input values that are required to provision respective SKU & Others details.

Syntax:  az group deployment create --template-file './<main-template.json filename>' --parameters '@./<main-template.parameters.json filename>' -g < provide resource group name that created in previous section> -n deploy >> <provide the outputs filename>
    
Ex: az group deployment create --template-file './maintemplate.json' --parameters '@./maintemplate.parameters.json' -g snsbasicsolution -n deploy >> outputs.txt
 
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d49.png)

13.	Deployment may take between 15-20 minutes depending on deployment size. 
14.	After successful deployment you can see the deployment outputs as follows.

#### 4.2.1. Outputs
 
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d50.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d38.png)
       
## 5. Post Deployment Steps

Associating **NAT rule** of port **8545** to the **BM0 Machine**

1. Click on **Load Balancer** resource and click on **Inbound NAT rules** in left side.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de10.PNG)

2. Click on **NatBM0_RPC_Port** rules

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de11.PNG)

3. Click on Dropdown **Target virtual machine** to **BMO** and **Network IP configuration** to **BM0** and click **Save**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de12.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de13.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de14.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/de15.PNG)

### 5.1. Deploying smart contract and getting the Contract Address

1.	Go back to the **Load Balancer** and copy IP Address and port: **3000** paste it in to the putty.

**NOTE**: If deployment type is **Standard (OR) Premium** you have to use **Blockchain traffic manager URL** along with port **3000** to SSH into the **BM0 VM**.
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d51.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d52.png)
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d53.png)    
    
Click **Yes** to continue.    
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d54.png)    
    
Login ID: **gethadmin**

Password: **Password@1234**
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d55.png)    
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d56.png)  

1.	Run the following command in **BM0** to download the **script(smart-script.sh)** to deploy the smart contract

$wget https://storageccqia.blob.core.windows.net/cc-iot/arm-ha/scripts/smart-script.sh

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d57.png)

2.	Run the following command to change the permissions of the file **smart-script.sh**

$ sudo chmod 777 smart-script.sh 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d58.png)    
    
3.	Run the script by using below command 

$ ./smart-script.sh http://52.247.204.66:8545  https://storageccqia.blob.core.windows.net/cc-iot/arm-ha/scripts/contract.sol   https://storageccqia.blob.core.windows.net/cc-iot/arm-ha/scripts/smart_contratct.js

NOTE: The IP address used in the RPC URL will change for every deployment. So use the updated IP address to use in RPC URL. The IP address for forming RPC URL is taken from the LoadBalancer IP address if the solution type is Basic. If the solution type Standard (OR) Premium you need to use the Blockchain Traffic Manager URL  

Rpc Url: $1
Contractsol: $2
smart_contract_js: $3
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d59.png)    
    
4. Contract address displayed on the screen, make a note of the contract address for future reference.   
    
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60.png)

#### 5.1.1 Running Blockchain servic in TMT-VM

After the contract deployment you have to perform the following steps to run the block chain cron job service in tmt-vm.

For that you have to provide the following values from the output section of the ARM and provide it to the following script url.

Refer output section from the ARM deployment **4.2.1**

1. Blockchain IP or FQDN: :**"2.175.243.187"** (or you can provide the RPC URL with FQDN as well **ex**: test1htih.westus2.cloudapp.azure.com)

2. Password : **"Password@1234"** (ethereumAccountPsswd)

3. ContractAddress : **"0xd761de896114f745e5ef789532523ff9ab3cf553"**

4. Gas Limit: 40000000

5. Login into the **TMT-VM** using **Putty**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-1.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-3.PNG)

Login ID: **gethadmin**

Password: **Password@1234**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-5.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-6.PNG)


6. Run the following command: 

    **wget "https://storageccqia.blob.core.windows.net/cc-iot/cold-chain-2304/cold-chain-costing-latest/scripts/blockchain-service.sh"**

    **cat blockchain-service.sh | tr -d '\r' > blockchain-service.sh1 | mv blockchain-service.sh1 blockchain-service.sh**

    **sudo chmod 777 blockchain-service.sh**

    ./blockchain-service.sh &lt;Blockchain IP&gt; &lt;Password&gt; &lt;contractAddress&gt; &lt;Gas Limit&gt;

**Ex**: ./blockchain-service.sh "52.175.243.187" "Password@1234" "0xd761de896114f745e5ef789532523ff9ab3cf553" "4000000"

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-7.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d60-8.PNG)
    
### 5.2 Performing Azure Site Recovery for Block Chain Virtual Machines

**Note: This step is performed only for the Standard and Premium Solution deployments.**
1.	In Azure portal search for “site recovery”  as shown below and click on **Recovery Services Vaults.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr1.png)

2.	Click on + **Add**.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr2.png)

3.	Enter the required details and click on **Create**. 
Select **Location**(East US2) value which is different from the resources Location(Blockchain VMs ).
**Note:** In this case, Blockchain VMs are deployed in West US2 so you can choose Location as East US2

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr3.png)

4.	Click on the **Resource Group(cc-standard-asr)** which have created above , then click on the **site recovey vault(cc-standard-vault)** you have created above. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr4.png)

5.	Click on **Site Receovery** and then click on **Prepare Infrastructure**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr5.png)

6.	Click on **OK**  after selecting the values as shown below.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr6.png)

7.	Click on **Ok** 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr7.png)

8.	Click on **Step1: Replicate Application**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr8.png)

9.	Enter the required details as shown below and click on **OK.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr9.png)

10.	Select the virtual machine which you want to replicate, in this case you need to select Blockchain VMs Only and click on **OK**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr10.png)

11.	In the next screen keep all the values to default and then click **Create tagrget resources.**

**NOTE:** If you want,  you can customize the values by clikcing the Customize link

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr11.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr12.png)

12.	Click on **Enable Replication.** It will create the required resources as shown below.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr13.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr14.png)

13.	Click on the **Resource Group(cc-standard-asr)** which you have created as part of ASR as shown below.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr15.png)

14.	Click on the **Site Recovery Vault(cc-standard-vault)** which you have created before

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr16.png)

15.	Click on **Replicated Items**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr17.png)

16.	Once you click on Replicated Items, it will show all the replicated VMs. If the Status is “**Protected**” then you can do Failover/ Test Failover otherwise you need to wait until the status becomes “**Protected**”.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/asr18.png)

**NOTE:**  The Failover steps can be performed once the primary region fails as discussed in 

**Admin Guide in section 5.1.2.1**

### 5.3 Importing Function App into the API Management 

If the option for the parameter **apiManagement** is **YES**, then you must perform the below steps to import the all the functions(operations) of a **function app** into the **API Management**. 

1. Go to **resource group** [Symbol] select **API Management.** 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api1.PNG)

2. Select **API’s** under **API Management** in the left-hand side.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api2.PNG)

3. Click on the **API** which is named as like function app name.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api3.PNG)

4. Click on the … icon to import the function app.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api4.PNG)

5. Click on **browse tab** to select the function app that we want to import.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api5.PNG)

6. Now click on **configure required settings** to choose your function app.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api6.PNG)

7. Now choose the **function app** of your resource group and click on **select**. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api7.PNG)

8. After few seconds **all the operations of the function app** will load and then click on **select.** 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api9.PNG)

9. Click on **Import.** 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api10.PNG)

10. After some time all the operations in a function app will load into the API Management. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api11.PNG)

11. Now click on **products** under API Management in the left-hand side and then click on starter.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api12.PNG)

12. Click on **settings** and then **uncheck** the **required subscription** option then **save**. 

Follow the below screens to uncheck the required subscription option. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api13.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api14.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api15.PNG)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/api16.PNG)



### 5.4 Building the Web App code 

Follow the below steps to build web application UI code to point to the deployed resources 

1.	Open the **ProjectTitanUICode** from **UI WebApp** folder from the **PJ-TITAN-SECURE-COLD-CHAIN** folder. 

 **Note:** Clone the cold-chain repository to your local system and perform the below steps

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d61.png)

2. Open the **src** folder from **ProjectTitanUICode** folder.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d62.png)

3.	Open environment folder and update the values of **environment.prod** file.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d63.png)

4.	Update the values **API_Endpoint, SAS_Token,blobAccessUrl,storageUrl, client_id,web3_password,contractAddress,HttpProvider,gasLimit and BingApiKey**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d64.png)

5. You can take all the resource values from the ARM template output section                                         
                                           
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d128.png) 

6.	You can get all the values from the Azure portal as shown below and use the same contract address which you have copied in the earlier step (**5.1. Deploying smart contract and getting the Contract Address**)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d65.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d66.png)

7.Click on **Storage Account -> Shared access signature.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d67.png)

8. Click on **Generate SAS and connection string** button. Copy the **SAS token** and **Blob Access URL** and update into **environment.prod.ts** file.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d68.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d69.png)

**Create Bing Map API**

1.	In Azure portal click on Create a resource.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b1.png)

2.	Search for “bing maps” as show below and click on Bing Maps API for Enterprise.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b2.png)

3.	Click on Create.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b3.png)

4.	Fill all the required details as shown below and click on Create.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b4.png)

5.	Go the resource group and Click on Bing map resource 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b5.png)

6.	Click on the Key Management and copy the masterkey this value you need to use for BingApiKey

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/b6.png)

 Here you can updated the details:
 
![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d70.png)

**NOTE1**: If you choose api Managemnet option as **YES** for the deployment then you have to provide the api management test url under the API_Endpoint of the environment.prod.ts file.

**NOTE2**:If you chosse deployment type as **standarad(or)premium** with api MAnagemnt as NO option then you have to provide the below URL's under the following variables.

1.API_Endpoint : <"http://cctrafficmng-fun4ji7q.trafficmanager.net">

2.HttpProvider: <"http://cctrafficmng-bc4ji7q.trafficmanager.net:8545">

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d127.png)

9. After updating the **environment.prod.ts** click on open **Node.js command prompt** window and go to the ProjectTitanUICode location i.e. you web application code location as shown in the following screenshots.

**NOTE:** make sure that you have latest **node modules installed** and you have **Angular CLI** installed on your local machine

Command: **npm install -g @angular/cli**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d71.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d72.png)

10. Here we can **install npm**

Command: **npm install**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d73.png)

11.	Run the following command to build the code 

Command: **ng build –prod**

Note: Before running the above command make sure that you have installed Angular CLI.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d74.png)

12. After successful build, you will get the folder called **dist**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d75.png)

13.	Open **AngularFrontEnd** from the **dist folder,** add the web.config(download it from here ) to the **AngularFrontEnd** and select all the files then zip them. 

**Note**: Download the Web.config file from the repository

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d76.png)

14.	Open kudu tool to upload the built web application code to the web app. You can open the Kudu tool by adding the scm in the web App URL as shown below 

Ex: <https://webapikowgh.scm.azurewebsites.net)>

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d77.png)

15.	Click on **Tools** dropdown list and click **Zip Push Deploy** to push the zipped web app code as shown below.

**Note:** Remove the existing files before you push new code. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d78.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d79.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d80.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d81.png)

### 5.5 Connecting Devices to the solution

#### 5.5.1. TMT-250 Device Configuration

To setup the Teltanica TMT-250 device follow the steps mentioned below.

**Inserting micro SIM card and connecting the battery to TMT250**

1.	Unscrew **4 screws** counter clockwise.
2.	Remove the **cover.**
3.	Insert **Micro-SIM** card as shown. Make sure that **Micro-SIM card cut-off corner** is pointing forward to slot.
4.	Connect the **battery** as shown to the device.
5.	Attach device cover back and screw in all **4 screws.**
6.	Device is **ready** to be used.

**PC Connection**

Connecting the **TMT-250 device** with your local system

Connect device to computer using **Magnetic USB cable** or **Blue-tooth** connection:

1.	Using **Magnetic USB cable**

    You will need to install USB drivers 
    Below is the link to download your TeltonikaCOMDriver.zip to install the USB driver.
    <https://teltonika.lt/downloads/en/fmb120/TeltonikaCOMDriver.zip>

2. Using **Blue-tooth**

    TMT250 Blue-tooth is enabled by default. Turn on **Blue-tooth** on your PC, then select **Add Blue-tooth or another device > Blue-      tooth.** Choose your device named – **“TMT250_last_7_imei_digits”,** without **LE** in the end. Enter default password **5555,**        press **Connect** and then select **Done.**

   Click on **Add Bluetooth** or another devices option to add the teltanika.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d82.png)

Click on **Bluetooth.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d83.png)

Choose your **teltanika device ID without LE.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d84.png)

Provide the Default **password** as 5555 and click on **connect.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d85.png)

After paired click on **Done.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d86.png)

3. You are now ready to use the device on your computer.

**Configurator**

Below is the link to download the latest TMT250 **Configurator** version.
<https://wiki.teltonika.lt/wiki/images/f/f5/FMB.Configurator_v0.16.1.17313_C.004.zip>

After downloading, Extract the .zip file and double click on the **configurator.exe** to open the TMT-250 Application.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d87.png)

Now the application will appear as below.

Click on the **Device icon** to connect the device.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d88.png)

After connection to Configurator **Status window** will be displayed

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d89.png)

After the application opens you can see the pop up of parameters loaded success.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d90.png)

Now go to **GPRS property** on the left-hand side and set the below properties.

**1.APN** (it should be cellular network) if it is AIRTEL then you need to provide the below APN. Based on the cellular you have provide specified domain.

**2.Domain:** Provide your TMT-VM **public IPAddress.**

**NOTE**: If the deployed solution type is **standard or Premium** you must provide the **traffic manager** DNS name under the Domain field.

**Ex: “cctrafficmng-tmtjct7q.trafficmanager.net”** 

**3.Port:** Set the port as **21684.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d91.png)

After providing all the details click on **save to device** tab on the top.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d92.png)

Go to **Status GSM Info**
Here you can see the full information like the **Number of records sent, SIM State, GPRS Status and Socket Information.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d93.png)

For more information regarding configuration of **TMT-250** please follow the below link.
https://wiki.teltonika.lt/view/TMT250_First_Start

#### 5.5.2. Connecting Rigado
1.	Connect **LAN cable** to the **Rigado** and switch on it.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d94.png)

#### 5.5.3 Connecting Beacons

1.  Switch on the **Beacons (Sensor)** and keep it within the range of **Rigado.**

    Note: If Beacon will show **Red light,** it is in **ON** state otherwise **OFF** state

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d95.png)

Press **ON** the **beacon 3 times,** at that time if it shows **Red light,** it is in **ON** state otherwise it shows **Green light,** it is in **OFF** state.

## 6. Device Configuration

### 6.1. Build and Deploy Snap to Gateway

Below listed are the steps to be followed to build and deploy snap to Rigado Cascade-500 IoT Gateway.

**a. Development Host** - This computer or virtual machine should have Ubuntu 16.04 LTS and will be used to edit source files, test scripts, and interact with the snapcraft CLI. It may have any architecture (amd64, x86, etc). This device must have an HCI0 interface with BLE enabled.

**b. Build Host** - NodeJS snaps are not cross-compilable, so this build computer must have an armhf processor architecture and have enough resources to build the snap. The Raspberry Pi 3 is recommended because it has the armhf architecture, and can run the Ubuntu Core OS (which simplifies the build process). 

**I. Setting up the Development Host**

1.	Install Node.js (>=6.11.4).

2.	Install required libraries with the following command:

    **$ sudo apt update**

    **$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev g++ python2.7 git build-essential curl libssl-dev npm**

3.	Download the project (codebase of Gateway) to your development host and navigate to the project and enter the following command:

    **$ npm install**

4.	This will install all the dependencies which are required for the project mentioned in package.json file.

#### 6.1.1. Snap Building:

1.	For now, the Node.js plugin for snapcraft doesn’t support a cross-platform build. Raspberry Pi is required for building the snap. For installation of Raspberry Pi follow the steps mentioned in the link <https://docs.rigado.com/en/latest/creating-apps/prereqs.html#developer-prereqs-rpi.>

2. Once Raspberry Pi is set up, login by using the following command:

$ ssh abc@175.21.10.9 [IP address of the RaspberryPi]

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d97.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d98.png)

3. Copy the project folder from your local to Raspberry Pi

   **$ scp -r user@175.21.10.4:/home/user/Project-Titan/.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d99.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d100.png)

4. Install Classic

   **$ sudo snap install --beta --devmode classic**
   
5.	Once Classic is installed, switch to classic mode by entering the following command:

   **$ cd Gateway Source Code**
   
   **$ sudo classic**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d101.png)

6. In Classic mode, install snapcraft:

      **$ sudo apt update**
      
      **$ sudo apt install snapcraft build-essential git**
      
7.	Once snapcraft is installed [in classic mode] navigate to the project folder, where the snapcraft.yaml file is present, change the version number to the higher number than the one present in the file.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d102.png)

**NOTE:** if you’re building the snap multiple times make sure that the version should be updated to the next number in **snapcraft.yaml** file. Ex: If version is 1.9.10 make it as 1.9.11 for the next build.

8. You should change the **function App Url(API_endpoint)** and **IoT Hub connection string(IoT Hub name) url** in **Config.json** file for before building the snap.

**Note**: You can take the URL from the output section of ARM template.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d129.PNG)

**Note**: If the Deployment type is Standard or Premium, you have to provide Traffic Manager URL

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d96.png)

**Note**: If you want to re-build the snap you need to delete the following folders

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d96-1.png)

To build the snap, enter the following command

**$ sudo snapcraft**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d104.png)

9. Once the snap is built, it will create an abc_test_1.0.1_**armhf.snap** file. Copy this snap from the build host [i.e Raspberry Pi] to development host [i.e. Ubuntu 16.04 machine] using the following command:

**$ scp abc_test_1.0.1_armhf.snap** <user@175.21.10.4:/home/user/>

This will copy the snap to Local at the path mentioned.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d105.png)

### 6.2. Uploading the snap to Gateway

1.	Switch to Development host and login to <https://app.rigado.com/.>

2.	Navigate to Apps page and click on create app and enter a unique name for the app and upload the snap as your first revision. 

    **Create new App**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d106.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d107.png)

Application created successfully

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d108.png)

Create Bundle for the specific Application.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d109.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d110.png)

Bundle created successfully and add tag to that bundle

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d111.png)

Select an App and add app to that Bundle then save it.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d112.png)

Navigate to created App and upload the Snap by following the below steps.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d113.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d114.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d115.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d116.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d117.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d118.png)

**Note: The name of the app must be same as the name mentioned in snapcraft.yaml of the project**

3.	When it’s done uploading, a modal will ask you if you want to release the app revision to a channel. Select the edge channel and click the RELEASE button.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d119.png)

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d120.png)

### 6.3. Verifying the device configurations
1.	Go to **Azure Portal.**
2.	Click on the **Resource Group** and Navigate to the **IoT Hub resource**.

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d121.png)

3.	Click on the **IoT Hub** and Navigate to the **IoT Hub Overview**, here you can see the **IoT Hub Message count.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d122.png)

4. Click on the **IoT devices** in **IoT Hub,** here you can see the **Gateway Device Id.**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d123.png)

5. Click on the **Gateway**  

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d124.png)

6. Click on the **Device twin**

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d125.png)

7.	Once all the above configurations are correct you can see the device status as connected as shown below

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/d126.png)






































   
    
    
    
   
    
