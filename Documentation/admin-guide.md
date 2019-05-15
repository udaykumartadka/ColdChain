# Microsoft

# ColdChain Solution

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a0.png)

**Contents**

<!--ts--> 
 - [1. Introduction](#1-introduction)
 - [2. Accessing the Web Application](#2-accessing-the-web-application)
  - [3. Security](#3-security)
    - [3.1. Storage Security](#31-storage-security)
         - [3.1.1. Secure Transfer Required](#311-secure-transfer-required)
         - [3.1.2. Advanced Threat Protection](#312-advanced-threat-protection)
         - [3.1.3. Shared Access Key](#313-shared-access-key)
         - [3.1.4. Encryption](#314-encryption)
    - [3.2. SQL Database Security](#32-sql-database-security)
         - [3.2.1. Advanced data security](#321-advanced-data-security)
         - [3.2.2. Azure SQL Database data discovery and classification](#322-azure-sql-database-data-discovery-and-classification)
         - [3.2.3. Auditing](#323-auditing)
         - [3.2.4. Transparent data encryption for SQL Database and Data Warehouse](#324-transparent-data-encryption-for-sql-database-and-data-warehouse)
         - [3.2.5. SQL Database dynamic data masking](#325-sql-database-dynamic-data-masking)
 - [4. Monitoring Component](#4-monitoring-component)
   - [4.1. Application Insights](#41-application-insights)
   - [4.2. OMS Log Analytics](#42-oms-log-analytics)
 - [5. Hardening Components](#5-hardening-components)
   - [5.1. Application HA](#51-application-ha)
 - [6. Performing DR Strategies](#6-performing-dr-strategies)
   - [6.1. Standard Solution Type](#61-standard-solution-type)
      - [6.1.1. Accessing the web application](#611-accessing-the-web-application)
      - [6.1.2. Performing Failovers](#612-performing-failovers)
      - [6.1.3. Re-Deploy the Region-2 ARM Temple](#613-re-deploy-the-region-2-arm-temple)
      - [6.1.4. Verifying the Web Application](#614-verifying-the-web-application)
   - [6.2. Premium Solution Type](#62-premium-solution-type)
      - [6.2.1. Accessing the web application](#621-accessing-the-web-application)
      - [6.2.2. Premium Solution Application HA](#622-premium-solution-application-ha) 
      - [6.2.3. Performing DR Strategies](#623-performing-dr-strategies)
 <!--te-->

## 1. Introduction

This Document explains how to use the Cold-chain solution. In addition to the user document, this provides verifying data in resources, updating SKUs, enabling security steps for the resources and performing DR activities for Standard and Premium solutions.

**Note**: This document assumes that the solution is already deployed through ARM template using the **Deployment Guide**.

## 2. Accessing the Web Application

**Note**: Refer the **User Guide Document** to interact with Cold Chain Solution. You can user the User Guide Document to create, monitor and track the shipments at a pallet, carton, box and a unit level. The Cold Chain Solution allows to monitor the near real-time humidity, temperature, shock & vibration and tamper status of the various artifacts in the shipment.

## 3.	Security

### 3.1.	Storage Security

#### 3.1.1.	Secure Transfer Required

The **Secure transfer required** option enhances the security of your storage account by only allowing requests to the account from secure connections. For example, when you're calling REST APIs to access your storage account, you must connect by using HTTPS. "Secure transfer required" rejects requests that use HTTP.

In storage account overview click on configuration enabled the secure transfer required and click on save. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A01.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A02.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A03.png)

#### 3.1.2.	Advanced Threat Protection

Azure Storage Advanced Threat Protection detects anomalies in account activity and notifies you of potentially harmful attempts to access your account. This layer of protection allows you to address threats without the need to be a security expert or manage security monitoring systems. 

In storage account overview click on advanced treat protection select on and click on save. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A04.png)

#### 3.1.3.	Shared Access Key

A shared access signature provides delegated access to resources in your storage account. With a SAS, you can grant clients access to resources in your storage account, without sharing your account keys. This is the key point of using shared access signatures in your applications--a SAS is a secure way to share your storage resources without compromising your account keys.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A05.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A06.png)

#### 3.1.4.	Encryption

One way that the Azure storage platform protects your data is via Storage Service Encryption (SSE), which encrypts your data when writing it to storage, and decrypts your data when retrieving it. The encryption and decryption is automatic, transparent, and uses 256-bit AES encryption, one of the strongest block ciphers available. 

On the Settings blade for the storage account, click Encryption. Select the Use your own key option.

You can specify your key either as a URI, or by selecting the key from a key vault. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A07.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A08.png)

* Choose the Select from Key Vault option.

* Choose the key vault containing the key you want to use. 

* Choose the key from the key vault. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A09.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A010.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A011.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A012.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A013.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A014.png)


### 3.2.	SQL Database Security

#### 3.2.1.	Advanced data security

Advanced data security (ADS) provides a set of advanced SQL security capabilities, including data discovery & classification, vulnerability assessment, and threat detection.

**vulnerability assessment**

* It helps to Assess, track, and improve the security of SQL databases, in Azure and on-prem.

**Configure vulnerability assessment:**

1.	Click on the Advanced Security and to enable ADS for all databases on the database server or managed instance, click **Enable Advanced Data Security on the server.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A015.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A016.png)

2.	Click on the Vulnerability Assessment

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A017.png)

3.	To start using vulnerability assessment, you need to configure a storage account where scan results are saved. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A018.png)

4.	Select or create a storage account for saving scan results. You can also turn on periodic recurring scans to configure vulnerability assessment to run automatic scans once per week. A scan result summary is sent to the email address(es) you provide.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A019.png)

5.	Threat protection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A020.png)

If we configured vulnerability assessment and Threat protection, now we can go and check Scan.

**Click on the Scan and View the report**

  * The report presents an overview of your security state: how many issues were found and their respective severities. Results include warnings on deviations from best practices and a snapshot of your security-related settings, such as database principals and roles and their associated permissions.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A021.png)

Analyze the results and resolve issues

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A022.png)

**Set your baseline**

Once you have established your baseline security state, VA only reports on deviations from the baseline and you can focus your attention on the relevant issues.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A023.png)

#### 3.2.2.	Azure SQL Database data discovery & classification

* Discovering and classifying your most sensitive data (business, financial, healthcare, personally identifiable data.

* The Overview tab includes a summary of the current classification state of the database, including a detailed list of all classified columns, which you can also filter to view only specific schema parts, information types and labels. If you haven’t yet classified any columns.

1.	Navigate to Advanced Data Security under the Security heading in your Azure SQL Database pane. Click to enable advanced data security, and then click on the Data discovery & classification (preview) card.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A024.png)

2.	The **Overview tab** includes a summary of the current classification state of the database, including a detailed list of all classified columns, which you can also filter to view only specific schema parts, information types and labels.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A025.png)

3.	To begin classifying your data, click on the **Classification tab** at the top of the window.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A026.png)

4.	You can also **manually classify** columns as an alternative, or in addition, to the recommendation-based classification:

* Click on **Add classification** in the top menu of the window. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A027.png)

#### 3.2.3.	Auditing

Audit logs helps monitor data and keep track of potential security breaches or internal misuses of information. 

**Set up auditing for your database**

1.	Navigate to **Auditing** under the Security heading in your SQL database/server pane.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A028.png)

2.	Switch auditing ON and You now have multiple options for configuring where audit logs will be written.

*	You now have multiple options for configuring where audit logs will be written. You can write logs to an Azure storage account, to a Log Analytics workspace for consumption by Log Analytics, or to event hub for consumption using event hub. You can configure any combination of these options, and audit logs will be written to each.
If you prefer to enable auditing on the Server level, switch **Auditing** to **OFF**.

   (Or)

If you prefer to enable auditing on the database level, switch **Auditing** to **ON**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A029.png)

3.	Fill all the details and click Save.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A030.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A031.png)

4.	Clicking on **Open in OMS** at the top of the **Audit records** page will open the Logs view in Log Analytics, where you can customize the time range and the search query.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A032.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A033.png)

#### 3.2.4.	Transparent data encryption for SQL Database and Data Warehouse

*	Transparent data encryption (TDE) helps protect Azure SQL Database, Azure SQL Managed Instance, and Azure Data Warehouse against the threat of malicious activity.

*	It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

*	Transparent data encryption encrypts the storage of an entire database by using a symmetric key called the database encryption key.

*	This database encryption key is protected by the transparent data encryption protector.

*	The protector is either a service-managed certificate (service-managed transparent data encryption) or an asymmetric key stored in Azure Key Vault (Bring Your Own Key). 

1.	You turn transparent data encryption on and off on the database level. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A034.png)

2.	You set the transparent data encryption master key, also known as the transparent data encryption protector, on the server level. 

*	To use transparent data encryption with Bring Your Own Key support and protect your databases with a key from Key Vault, open the transparent data encryption settings under your server.

#### 3.2.5.	SQL Database dynamic data masking

Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to designate how much of the sensitive data to reveal with minimal impact on the application layer. It’s a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed.

**Examples**

| **Masking Function**           | **Masking Logic**       
| -------------              | -------------                                                                                                                              
| **Credit card**       | Masking method, which exposes the last four digits of the designated fields and adds a constant string as a prefix in the form of a credit card.  XXXX-XXXX-XXXX-1234  
| **Email**            | Masking method, which exposes the first letter and replaces the domain with XXX.com using a constant string prefix in the form of an email address.   aXX@XXXX.com


![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A035.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/A036.png)



## 4. Monitoring Component

### 4.1. Application Insights

1.	Go to **Azure Portal -> Resource Group -> Web App**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a1.png)

2.	Here click on the **Application Insight**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a2.png)

3.	Click on **Turn on site extension** for **Web App** and **Function App**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a3.png)

4.	Select following in the **application insight** and click **Apply** button it will navigating to the popup window. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a4.png)

5.	Click **Yes**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a5.png)

6.	Go to **Resource group** and click on **application insight**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a6.png)

**Performance**

7.	On **Overview** page, Summary details are displayed as shown in the following figure.
    
8.	Click **Performance** on the left side of the page as shown below. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a7.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a8.png)

9.	Click on **Dropdown list** and select **Request time** in the following screenshot.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a9.png)

10.	After click on that **Request time**, it will open a new tab with some default queries & chart for the same. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a10.png)

11.	Click on **Request** it will open a new tab with request and response operations. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a11.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a12.png)

12.	Click **Chart** icon it should be display default queries & chart. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a13.png)

13.	Click on **Failure** on the left side of the page as shown below.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a14.png)

14.	Click on **View in Analytics** and select any of the analytics. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a15.png)

15.	After click on **Request Count**, it will open a new tab with some default queries & chart

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a16.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a17.png)

**Metric preview**

16.	Then select **metric explorer** from the left menu. 

17.	Here you need to select the resource from the drop-down list, select the metric what you want to give and select the aggregation as per requirement. 

18.	Here we can see the graph after specifying our need. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a18.png)

**Application Map**

19.	Application Map helps you spot performance bottlenecks or failure hotspots across all components distributed application. 

20.	After click on **application map** you can see the screen like below. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a19.png)

21.	When you click on **ccfunapp07gm** it will open popup window in right side and click on **Investigate Performance** button. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a20.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a21.png)

22.	To check the **logs**, click on the chart of which you want to see the logs then you will get the logs of each request as shown in below figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a22.png)


**Live Metrics Stream**

23. Click on **Live Metric Stream** to view the incoming requests, outgoing requests, overall health and servers of web application and function app.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a23.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a24.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a25.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a26.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a27.png)

### 4.2. OMS Log Analytics 

1.	Open **Azure Portal -> Resource Group** -> Click the **OMS Workspace** in resource group to view OMS Overview Section. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a28.png)

2.	Click **Azure Resources** on left side menu to view available Azure Resources.  

3.	Select your **Subscription** and **Resource Group** name from the dropdown list. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a29.png)


4.	Click on **Logs** in the left side menu it will open log **search box**.

5.	Copy **Resource group name** and past it in the **search box** and we write the **Kusto query language** and click **Run** button, it should show the Resource group Telemetry data.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a30.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a31.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a32.png)

6.	Here you can check the **resource group** information is displayed below the page as shown in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a33.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a34.png)
  

7.	Copy **IoT Hub resource group** name and paste it in the search box with **Kusto query language** and click **Run**. 

8.	Here you can see the **IoT hub resource Telemetry information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a35.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a36.png)

9.	Here you can see the **IoT hub resource information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a37.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a38.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a39.png)

10.	Copy **Cosmos DB** resource group name and paste it in the **search box** with **Kusto query language** and click **Run**. 

11.	Here you can see the **Cosmos DB resource Telemetry information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a40.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a41.png)

12.	Here you can see the **Cosmos DB resource information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a42.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a43.png)

13.	Copy **SQL DB resource group** name and paste it in the search box with **Kusto query language** and click **Run**.

14.	Here you can see the **SQL DB resource Telemetry information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a44.png)

15.	Here you can see the **SQL DB resource information** is displayed below the page as show in the following figure.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a45.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a46.png)

## 5. Hardening Components  

### 5.1. Application HA

**Note:  The following steps applicable for the Premium Solutions**

1.	Go to **Resource Group** -> Click on **Web App**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a42.PNG)

2.	Click on **Stop button** to stop the web application.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a48.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a49.png)

3.	Go to **resource group** and click on **traffic manager** then you can see the primary web app is stopped.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a50.png)

4.	Copy the **traffic manager URL** and check the use case flow.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a51.png)

5.	Go back to the **resource group** and click on **Function App**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a52.PNG)

6.	In the overview page click on **Stop** the **Function App**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a53.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a54.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a55.png)

7.	Go to **Resource Group** -> Click on **Stream Analytics**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a56.PNG)

8.	Click on **Stop the Stream Analytics**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a57.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a58.png)

## 6. Performing DR Strategies

### 6.1. Standard Solution Type


In this scenario, there is again a primary and a secondary Azure region. All the traffic goes to the active deployment on the primary region. The secondary region is better prepared for disaster recovery because the database is running on both regions. 

Only the primary region has a deployed cloud service application. Both regions are synchronized with the contents of the database. When a disaster occurs, there are fewer activation requirements. You redeploy Azure resources in the secondary region.

Redeployment approach, you should have already stored the service packages. However, you don’t incur most of the overhead that database restore operation requires, because the database is ready and running.  This saves a significant amount of time, making this an affordable DR pattern.

Standard Solution requires redeployment of Azure resources in secondary region when the primary region is down.
When user chooses Standard Solution type below Azure resources will be deployed 

*	Web Apps

*	Function App 

*	Application insights

*	Azure Cosmos DB

*	IoT Hub

*	Storage Account 

*	Document DB

*	SQL Server

*	Log analytics

*	Azure Active Directory

*	Automation Account

*	Stream Analytics 

*	TMT-VM 

*	API Management

When Primary region is down, and user needs to redeploy Azure resources to new region. Once redeployment gets completed below resources will get deployed.

*	Web App

*	Function App

*	Stream Analytics

*	API Management

*	TMT-DR

*Refer 4.1 and 4.2 Section in Deployment Guide for Standard Solution Deployment.


#### 6.1.1. Accessing the web application

1.	Go to **Resource Group** -> Click on **Traffic Manager** from the below resources

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a59.PNG)

2.	Copy the **DNS name** and open it in browser.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a60.png)

3.	Now you can see the landing page of **Web Application**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a61.png)

After opening the web application, you can verify the application flow (use case) like Device Onboarding, Shipment Creation, Reports. Once you done verifying the flow perform the following DR strategies.

**Note:  The following steps are for Standard and Premium Solution**

#### 6.1.2. Performing Failovers 

###### 6.1.2.1.	Performing ASR Blockchain Machines Failover

1.	You need to go to the resource group for **Site Recovery Vault** which you have created as part of “**Performing Azure Site Recovery (ASR) for Block Chain Virtual Machines (VMs)**” in **Deployment Guide** in section 5.2.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr15.png)

2.	Click on the **Site Recovery Vault(cc-standard-vault)** which you have created before

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr16.png)

3.	Click on **Replicated** Items

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr17.png)

4.	Once you click on the **Replicated Items**, it will show all the replicated VMs. You can click on the each VM which you want to Failover once the status is “**Protected**”

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr18.png)

5.	Once the Source Region fails (to simulate this, you can stop the Blockchain VMs in the primary Region (OR) you can simply change the endpoint in the Blockchain Traffic Manager to point to the Secondary/failover region LoadBalancer Public IP), You need to do the Failover to bring up the replicated VMs by clicking the **Failover** as shown below after clicking each VM individually.

**Note**: 1. You need to perform this step for all the Replicated VMs. 

**Note**: 2. Before performing Failover, you can do a Test Failover to verify that everything is working or not.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr19.png)

**Note**: You will get a warning as shown below in case if you do Failover without performing Test Failover. You can select the check box and click on Ok.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr20.png)

6.	Choose the **default values** and click on **OK**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr21.png)

7.	Then “**Failover**” starts as shown below. It will take some time to perform the **Failover**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr22.png)

8.	Once the Failover completes you can see a new notification which says “**Successfully completed the operation**” as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr23.png)

9.	Go to the **resource group** with the post fix as “**asr**” as shown below. (as you choose the default values, a resource group will be created with the source resource group name ending with “-asr”).

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr24.png)

10.	You see a **new VM** is created in the **resource group** as **source VM** as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr25.png)

11.	Repeat the Failover step for all the VMs, you can see all VMs in the “-asr” resource group as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr26.png)


12.	Once the Failover completes, then deploy the template in the “-asr” resource group (**coldchain-standard-solution-asr**) from the following link which deploys the Load balancer and NSG for the Blockchain setup.

https://storageccqia.blob.core.windows.net/cc-iot/cold-chain-2304/cold-chain-costing-latest/nested/asr-temp.json

13.	In Azure portal go to **Template deployment-> Custom deployment-> Edit template** 

Copy the template from the above URL and paste in the Edit Template text box as shown below 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr27.png)

14.	After filling all the details like Load Balancer Name, Dns Host Name, publicIPAddressName and Location. Click on **Purchase**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr28.png)

15.	Once the deployment is successful, go to the resource group and configure the **Backend pools** and **Inbound NAT rules** as shown below

16.	Click on the **LoadBalancerBackend1**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr29.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr30.png)

17.	Click on **Inbound NAT rules**, then click on **Natssh0**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr31.png)

18.	Then select the **Target virtual machine** and **Network IP configuration** then click on **Save**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr32.png)

19.	Repeat this for all the other Nat rules **Natssh1, Natssh2** and **Natssh3**

20.	After updating the NAT rules **SSH** to all the VMs and run the **start-private-blockchain.sh** script.
And run the following command in another session (right click on the top section of putty and select **Duplicate session** then enter the credentials)

**sudo geth attach ipc:/home/gethadmin/.ethereum/geth.ipc**

21.	Use load balancer IP with port 3000 to 3003 to **SSH** to all the four VMs and run the script as shown below

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr34.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr35.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr36.png)

As shown above **SSH** to all other machines and run the scripts mentioned above.

**Note**:  If you are not able login into the VMs with the credentials set for your VMs in the source resource group (primary region), you need to reset the credentials using the Azure portal as shown below.

22.	Go to the “-asr” resource group click on the VM and then scroll down under the Overview until you find **Reset password**, then click on the Reset password. Enter the username as “gethadmin”

23.	then enter the new password and confirm password then click on **Update** as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr33.png)

24.	After running the scripts in all four VMs you need to make the Blockchain setup is up running in the secondary location i.e in ASR setup use the Load Balancer IP and open the Blockchain admin site as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr37.png)

If you get the correct **Peer Count** and the **Latest Block Number**, then your Blockchain setup is up and running.

**NOTE:** Now you have the failover Blockchain setup is up and running, you need to update the endpoint in the Blockchain Traffic Manager which was pointing to the primary region Blockchain setup, to points to the failover/secondary region Blockchain setup.

25.	Go to the source resource group and click on the Blockchain **Traffic Manager**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr38.png)

26.	Click on the **Endpoints** and the endpoint.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr39.png)

27.	It opens the configured the endpoint, click on **Delete** to delete the previous endpoint.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr40.png)

28.	 Click on **Endpoints** and click on **Add**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr41.png)

29.	Enter Azure Endpoint as **Type, Name** can be any meaning full string, “Public IP address” as **Target Resource type**, select the Load Balancer Public IP address which you have created in the “-asr” resource group as **Target Resource**, 1 as **Priority** as shown below and click on Ok.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr42.png)

30.	 You can find the newly added endpoint as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/asr43.png)

Now the Traffic Manager points to the secondary region Blockchain setup.

##### 6.1.2.2.	IoT Hub manual failover

Follow the below steps for doing the **IoT Hub manual failover**.

1. Go to **Resource Group** -> Click on **IoT Hub**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a62.PNG)

2. Go to **Manual Failover** in the left side menu.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a63.png)

3. Click on **Initiate Failover**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a64.png)

4. It will open a new window in right side menu, enter **Alias name** and click **Ok** button.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a65.png)
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a66.png)

5. Here you can see the manual failover from **East US 2 to Central US** is in progress.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a67.png)
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a68.png)

6. Here you can see the failover IoT Hub to the **Secondary Location Central US**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a69.png)
    
##### 6.1.2.3.	Cosmos DB Manual Failover

Follow the below steps for doing the **Cosmos DB manual failover**.

1. Go to **Resource Group** -> Click on **Cosmos DB** resource.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a70.png)

2. Click on **Replicate data globally** in the left side menu.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a71.png)

3. Click on **Manual Failover**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a72.png)

4. It will open a new window and select the **read reasons**, click **check box** and click on **Ok** button.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a73.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a74.png)

5. After manual failover is done, you can see the write region as **Central US** and read regions as **East US 2**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a75.png)
    
##### 6.1.2.4.	SQL Server Failover

Follow the below steps for doing the **SQL Server failover**.

1. Go to **Resource Group** -> Click on **SQL Server** resource.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a76.png)

2. Click on **Failover group** in the left side menu and click on the **failover group**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a77.png)


3. Click on **Failover** to failover group to failover.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a78.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a79.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a80.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a81.png)

4. Here you can see the secondary resource as **primary role**.    

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a82.png)

#### 6.1.3. Re-Deploy the Region-2 ARM Temple

1.	Go to the **GitHub** and select **re-deploy.json** file from **master branch**. Copy the re-deploy.json template.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a83.png)

2.	Click on **Add** in existing Resource Group.

 ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/d13-1.PNG)
    
![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/d13-2.PNG)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/d14.png)

4.    The **Edit template** page is displayed as shown in the following figure.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/d15.png) 

5.    **Replace / paste** the template and click **Save** button.

   ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a87.png)
    
  
  ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a88.png)
    
   ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a89.png)
    
   ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a90.png)
    
   ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a91.png)

#### 6.1.4. Verifying the Web Application 

1.	Go to **Resource Group** -> Click on **first Traffic Manager** from the below resources. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a59.PNG)

2.	Copy the **Traffic Manager URL** and open it in browser.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/admin92.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a93.png)

3.	Enter **Azure AD Authorized User Credentials**. 

User ID: *******@sysgain.com  

Password: ******************  

After successful validation by the **Azure AD**, based on the user role the web app will redirect you to **Admin Page** 
  
  ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/view.png)

4.	Click on **document icon** in the **shipment tab**, it will expand a section where you can upload your documents. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a94.png)

5.	Click on **Choose Files Button** which will open a window for you to select the file.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a95.png)

6.	Once the file is uploaded, you will see **File Uploaded Successfully** message as below.  

7.	The next step is to upload document information to the **Blockchain**. For this, select the Document Type from the drop-down list.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a96.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a97.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a98.png)

8.	Click on **Upload to Blockchain** button which will upload the document information in the **Blockchain**. After successful upload, you will see a response as below.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a99.png)

9.	When you click the **View Document Button**, a section gets expanded below the ribbon where you will be able to see a table which contains a list of documents against the respective shipment. The expanded section is highlighted in the below image.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a100.png)

10.	When you click on view icon button you will be able to view the document in the new tab or it will get downloaded if the file extension is other than **.pdf**

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a101.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a102.png)

11.	To check if the status of the shipment is updated or not, click on **shipment ID** of the ribbon as shown below.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a103.png)

12.	This will open the dashboard of that respective shipment where you can check the status value under **Shipping Details** Sections as shown below.  

13.	To check whether the record of shipment status is recorded in **Blockchain** or not, you can simply check the **Blockchain Transactions** sections under the **Shipping Details** sections where all the transaction made to the **Blockchain** are shown in chronological order.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a104.png)
    

14.	Click on the **transaction hash** which will show the **transaction details** in a modal as below.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a105.png)

15.	The **Tracker Tab** will be rendered which will show the last known location of the shipment. The view of this tab is shown above. When you click on the marker, a pop-up will be display next to the marker that will show **shipment details** and incidents.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a106.png)


16.	The **Status Tab** will show a list of objects along with their **Object ID, Beacon ID**, the object it is associated with, **Temperature, Humidity, Shock and Vibration Alerts, and count of incidents**.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a107.png)


17.	The **Devices Tab** will consist of a list of association of beacons and objects with **Gateways**. The connectivity status of the devices will also be shown in this list.  

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a108.png)

18.	The **Incidents Tab** consists of a list of all the alerts that has occurred over the course of monitoring the shipment. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a109.png)

19.	This tab shows all the alerts that are stored in **Blockchain**. All the information regarding the alert will be shown in this tab along with **Alert Starting Time and Alert Ending Time**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a110.png)

20.	Here you can see the whatever you added Beacons and Sensor data. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a111.png)

21.	Here you check the Device twin connected or not. 

**NOTE**:  If the data is not coming to web app you can verify the following components to troubleshoot the issue. 

22.	Go to **Resource Group** -> Click on **IoT hub**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a62.PNG)

23.	Click on **IoT devices** in the left side menu.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a113.png)

24.	Click on **Device ID**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a114.png)

25.	Click on **Device twin**, here you can see the Status of the device.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a115.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a116.png)

26.	And check the **Message count** is increasing or not.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a117.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a118.png)

27.	Go back to the **Resource Group** -> Click on **Cosmos DB**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a119.png)


28.	Click on **Data Explorer** in the left side menu.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a120.png)

29.	Here you can check the latest transaction message/document.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a121.png)

30.	Go to **Resource Group** -> Click on **Stream analytic**

   ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a56.PNG)

31.	Here you can see the increasing **Input Events and Output Events**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a123.png)
    
    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a124.png)


32.	Go back to **Resource Group** -> Click on **SQL database**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a125.png)

33.	Click on **Query editor** in the left side menu.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a126.png)

34.	Enter the following credentials to open the **SQL database**.

**Credentials**:

Login: sqluser

Password: Password@1234

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a127.png)

35.	Here you can see the latest stored record.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a128.png)

### 6.2. Premium Solution Type

#### 6.2.1. Accessing the web application

1.	Go to **Resource Group** -> Click on **Traffic Manager** from the below resources

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a59.PNG)

2.	Copy the **DNS name** and open it in browser. 

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a130.png)

3.	Now you can see the landing page of **Web Application**.

    ![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/a131.png)

After opening the web application, you can verify the application flow(use case) like Device Onboarding, Shipment Creation, Reports

#### 6.2.2. Premium Solution Application HA

To perform HA when the **primary region fails**, we need to use **secondary region** (DR) components from the **same resource group** where all DR components were deployed as part of the **Premium solution** as discussed in **section 4.1**.

#### 6.2.3. Performing DR Strategies 

Perform the IoT Hub, Cosmos DB, Azure SQL DB and Stream Analytics failovers as discussed in section **5.1.2** and Verify the application flow as discussed in section **5.1.4**
