# Microsoft

# ColdChain Solution

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/0.png)

### Table of Contents 


<!--ts-->
 - [1.0 Introduction](#10-introduction)
     - [1.1 The Internet of Things](#11-the-internet-of-things)
     - [1.2 Cold Chain an Overview](#12-cold-chain-an-overview)
     - [1.3 The Cold Chain-Core Components](#13-the-cold-chain-core-components)
     - [1.4 The Workflow](#14-the-workflow)
- [2.0 Core Structure](#20-core-structure)
    - [2.1 Core Architecture Components ](#21-core-architecture-components)
    - [2.2 Solution Architecture](#22-solution-architecture)
    - [2.3 Basic Architecture](#23-basic-architecture)
    - [2.4 Standard Architecture](#24-standard-architecture)
    - [2.5 Premium Architecture](#25-premium-architecture)
- [3.0 Azure Components and their Functionality](#30-azure-components-and-their-functionality)
    - [3.1 IoT Hub](#31-iot-hub)
    - [3.2 Web Application](#32-web-application)
    - [3.3 Azure Function App](#33-azure-function-app)
    - [3.4 Azure Active Directory](#34-azure-active-directory)
    - [3.5 Cosmos DB](#35-cosmos-db)
    - [3.6 OMS Log analytics](#36-oms-log-analytics)
    - [3.7 Application Insights](#37-application-insights)
    - [3.8 Storage Account](#38-storage-account)
    - [3.9 SQL Database](#39-sql-database)
    - [3.10 Automation Account](#310-automation-account)
    - [3.11 Availability Set](#311-availability-set)
    - [3.12 Stream Analytics Job](#312-stream-analytics-job)
    - [3.13 Virtual Machine](#313-virtual-machine)
    - [3.14 Traffic Manager](#314-traffic-manager)
    - [3.15 Quorum Blockchain](#315-quorum-blockchain )
- [4.0 Solution Types and Cost Mechanism](#40-solution-types-and-cost-mechanism)
    - [4.1 Solutions and Associated Costs](#41-solutions-and-associated-costs)
    - [4.2 Basic](#42-basic)
    - [4.3 Standard](#43-standard)
    - [4.4 Premium](#44-premium)
    - [4.5 Cost Comparison](#45-cost-comparison)
    - [4.6 In terms of features](#46-in-terms-of-features)
    - [4.7 Dollar Impact](#47-dollar-impact)
    - [4.8 Estimated Monthly Cost for each Solution](#48-estimated-monthly-cost-for-each-solution)
 - [5.0 Further References](#50-further-references)
    - [5.1 Deployment Guide](#51-deployment-guide)
    - [5.2 Admin Guide](#52-admin-guide)
    - [5.3 User Guided](#53-user-guide)  
 <!--te--> 
    
    
## 1.0 Introduction

Cold Chain management solution for Pharma addresses the challenges and concerns of the pharmaceutical companies, by providing near real-time tracking of the temperature sensitive consignments in a transparent and immutable manner throughout the supply chain, by combining IoT and Blockchain. The solution provides actionable insights for all the stakeholders through real time data capture, comprehensive analytics and immutable access with increased granularity (product, box, carton, or pallet level), thus helping in achieving business transformation and reaping the associated benefits.

### 1.1 The Internet of Things 

The Internet of Things (IoT) has created a buzz in the marketplace in the recent years. The IOT brings with it a concept of connecting any device to the internet and other connected devices to the network. **ColdChain solution are the major concern for the companies today and safeguarding them becomes an utmost necessary**.

IOT becomes a pivotal component which helps to have safer cities, homes and businesses; IOT enables both the private and public organizations to monitor facilities on a real-time basis. The IoT brings with it the secure connections of devices such as cameras, IP cameras, sensors to the smartphones to mention a few here. The combination of the connected devices would enable IoT solutions to *“gather data, analyze the data and create an action”* which enables to perform a task in near real time. 

### 1.2 Cold Chain an Overview

Cold Chain management solution for Pharma addresses the challenges and concerns of the pharmaceutical companies, by providing near real-time tracking of the temperature sensitive consignments in a transparent and immutable manner throughout the supply chain, by combining IoT and Blockchain. The solution provides actionable insights for all the stakeholders through real time data capture, comprehensive analytics and immutable access with increased granularity (carton or package level), thus helping in achieving business transformation and reaping the associated benefits.  

### 1.3 The Cold Chain-Core Components

**IoT Gateway Devices** 

   An Internet of Things (IoT) gateway is a physical device or software program that serves as the connection point between the cloud    and controllers, sensors and intelligent devices.  

   All data moving to the cloud, or vice versa, goes through the gateway, which can be either a dedicated hardware appliance or software program. An IoT gateway may also be referred to as an intelligent gateway or a control tier. 

   Considering technical specifications, implementation, vendor motivation, and cost parameters RIGADO –CASCADE 500 gateway is used in  the Cold Chain Solution. 

**Function App** 

   Azure Function Apps uses the Azure App Service infrastructure. A function app is the container that hosts the execution of individual functions. When you create a function app in the App Service hosting plan, your function app can use all the features of App Service. 

**Blockchain Service** 

   The Blockchain services on Azure shall be leveraged to bring in the features of immutability and transparency of the transactions, events and alerts generated by the IoT sensors –which include capturing the shipment details at origin, updating the shipment details at handoff points, updating the shipment details with events and alerts generated by the IoT solution. 

   Quorum EEA Single Member Blockchain is used in the Cold-Chain solution. 

   Quorum is an Ethereum based DLT (Distributed Ledger Technology). The objective behind this to provide a permissioned implementation of Ethereum which supports transactions and contract privacy. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/1.png)

 ### 1.4 The Workflow 

 ![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/1-1.png)
 
 ## 2.0 Core Structure
 
 ![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/2.png)
 
 ### 2.1 Core Architecture Components:
 
* IoT Hub 

* Stream Analytics 

* Cosmos DB 

* SQL Database 

* Web App 

* Azure Functions 

* Backend VM 

* Blockchain Services

**Note: Please refer to section 3.0 for more details about the above components**

### 2.2 Solution Architecture

The core solution provided by the System Integration (SI) Partner is hardened with **Security, High-Availability (HA) & Disaster Recovery (DR)** and **monitoring** using the cross-cutting application needs, which are based on the key IoT Architecture Blueprint. 

The core solution is automated for single-click deployment using Azure Resource Manager (ARM) template to reduce the time of deployment from weeks-to-days.

**The IoT Solution hardening focuses on the following five IoT Architecture Pillars (AAP)**

* **Security**: Security is critical to the success of the entire lifecycle of an application from design to deployment 

* **High Availability and Disaster Recovery (HA/DR)**: Availability is usually measured as a percentage of uptime and focuses on ensuring an IoT system is always available, including from failures resulting from disasters. The technology used in IoT subsystems has different failover and cross-region support characteristics. For IoT applications this can result in requiring hosting of duplicate services and duplicating application data across regions depending on acceptable failover downtime and data loss. 

* **Resiliency**: The ability of the system to withstand failures and continue to function. 

* **Scalability**: The flexibility of a system to grow with increased workload 

* **Management**: Covers the operational and deployment processes that keeps an application running in production. Logging and monitoring for IoT application are critical determining system uptime and troubleshooting. The solution uses Azure Operations Management Suite (OMS) and App Insights for operations monitoring, logging, and troubleshooting. 

### 2.3 Basic Architecture 

Basic solution will have core components, in addition this solution also consists monitoring components like Application Insights and OMS Log Analytics.

* Application Insights provide monitoring for Web API. 

* OMS Log Analytics provide monitoring for IoT Hub, Stream Analytics, Cosmos DB, SQL Database. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/3.png)

* 1-Web App 

* 1-IoT Hub 

* 1-Stream Analytics 

* 1-Cosmos DB 

* 1-API Management 

* 1-Backend VM 

* 1-SQL Database 

* 1-Azure Functions Rest API 

* 1-Log Analytics 

* 1-Application Insight

* Blockchain Services 

### 2.4 Standard Architecture 

The standard solution is implemented by adding the High Availability and Disaster Recovery (HA & DR) features along with monitoring components like Application Insights and OMS Log Analytics to the Core solution. 

Standard Architecture diagram contains two regions 

* Primary Region (Deployment) 

* Secondary Region (Redeployment) 

The below diagram depicts the data flow between Azure Components in standard solution. 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/4.png)

Standard Architecture comprises of following components: 

* 2-Web App 

* 1-IoT Hub 

* 2-Stream Analytics 

* 3-Traffic Manager 

* 1-API Management (optional) 

* 2-Function Apps 

* 2-Backend VM               

* 1-SQL Database 

* 1-Cosmos DB 

* 2-Application Insight 

* 2-Log Analytics

* BlockChain Services

**Note: Please refer to section 3.0 for more details about the above components** 

The Azure components highlighted with a Tints of Cosmos background are provisioned using ARM template, whenever there is disaster at the primary region, that deploys the ARM template on a designated secondary region (Excluding Cosmos DB, SQL Database) ​ 

Cosmos DB is running on both Primary & Secondary (with Geo Replication enabled). Event Hub is running on both Primary & Secondary (with Geo Replication enabled with manual fail-over) ​. All the web app enabled with Auto scale feature​. The Front-end Web App is added under Traffic to provided High availability. 

The main use of this solution is whenever disaster occurs the re-deployment components will deploy in another region which reduces the down time of the solution. 

### 2.5 Premium Architecture 

The premium solution is implemented like Standard solution by adding the High Availability and Disaster Recovery (HA & DR) along with monitoring components like Application Insights and OMS Log Analytics to the Core solution. But the only difference between Standard and Premium is all the components get deployed at once including the re-deployment components. 

Premium Architecture comprises of two regions 

* Primary Region 

* Secondary Region 

All the components get deployed at once in the premium architecture. The diagram below depicts the data flow between the Azure components in premium solution 

![alt text](https://github.com/sysgain/PJ-TITAN-SECURE-COLD-CHAIN/blob/dev/Documentation/images/5.png)

Premium Architecture comprises of following components:  

* 2-Web App 

* 1-IoT Hub 

* 2-Stream Analytics 

* 3-Traffic Manager 

* 1-API Management (optional) 

* 2-Function Rest API 

* 2-Backend VM 

* 1-SQL Database 

* 1-Cosmos DB 

* 2-Application Insight 

* 2-Log Analytics

* BlockChain Services

**Note: Please refer to section 3.0 for more details about the above components** 

In this type of solution all resources including re-deployment components will be deployed. This type of solution reduces downtime of solution when region is down. In this solution there is redeployment approach which reduces downtime of the solution.

## 3.0 Azure Components and their Functionality 

This section will give a brief explanation of Azure component used in the solution and their functionality. 

### 3.1 IoT Hub 

**Introduction** 

Azure IoT Hub is a fully managed service which enables millions of IoT devices and solutions so that the entire system can have a bidirectional communication among each other. This communication between the devices are highly scalable and reliable and more importantly secured. 

The IoT Hub allows for multi device-to-cloud and cloud-to-device hyper scale messaging, which absorbs data from millions of devices to make the seamless business communications happen.  

Before you can communicate with IoT Hub from a gateway you must create an IoT Hub instance in your Azure subscription and then provision your device in your IoT Hub. Some samples in this repository require that you have a usable IoT Hub instance. 

The Azure IoT Hub offers several services for connecting IoT devices with Azure services, processing incoming messages or sending messages to the devices. From a device perspective, the functionalities of the Azure IoT Hub enable simple and safe connection of IoT devices with Azure services by facilitating bidirectional communication between the devices and the Azure IoT Hub. 

**Implementation** 

IoT Hub is the core component of any IoT solution. Let us try to understand how the IoT Hub is used in the solution. 

The temperature, humidity and location data from the Beacons (sensors) is captured in a gateway and sent to the Azure IoT Hub, which provides secure data transmission and collection framework and device management capabilities. 

### 3.2 Web Application  

**Introduction** 

A Web application (Web app) is an application program that is stored on a remote server and delivered over the Internet through a browser interface. 

Azure Web Apps enables you to build and host web applications in the programming language of your choice without managing infrastructure. It offers auto-scaling and high availability, supports both Windows and Linux, and enables automated deployments from GitHub, Visual Studio Team Services, or any Git repo. 

Web Apps not only adds the power of Microsoft Azure to your application, such as security, load balancing, auto scaling, and automated management. You can also take advantage of its DevOps capabilities, such as continuous deployment from VSTS, GitHub, Docker Hub, and other sources, package management, staging environments, custom domain, and SSL certificates. 

**Implementation**  

This solution contains one web app which is used for all the admin operations. Using this web app admin can create, monitor and track the shipments at a pallet, carton, box and a unit level. The web app allows to monitor the near real-time humidity, temperature, shock & vibration and tamper status of the various artifacts in the shipment. 

### 3.3 Azure Function App 

**Introduction** 

Azure Functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Java, or PHP. Pay only for the time your code runs and trust Azure to scale as needed. Azure Functions lets you develop serverless applications on Microsoft Azure. 

**Implementation** 

Azure Function App is the core component for all the backend operations. The function App contains Azure functions, these functions are used for exposing the APIs to external entities to fetch the data from cold path storage (Azure SQL) for further analytics. 

Azure Functions are used to fetch the data from the Azure Cosmos DB and aggregate the data and expose REST APIs for the visualization components to consume. 

### 3.4 Azure Active Directory 

**Introduction** 

Microsoft Azure Active Directory (Azure AD) is a cloud service that provides administrators with the ability to manage end user identities and access privileges. The service gives administrators the freedom to choose which information will stay in the cloud, who can manage or use the information, what services or applications can access the information and which end users can have access. 

**Implementation** 

Azure Active directory is used to authenticate users to login to Web Application. Azure active Directory enables secure authentications to web application 

### 3.5 Cosmos DB   

**Introduction** 

Azure Cosmos DB is a Microsoft cloud database that supports multiple ways of storing and processing data. As such, it is classified as a multi-model database. In multi-model databases, various database engines are natively supported and accessible via common APIs. 

**Implementation** 

The data from the stream analytics engine is passed on to the Azure Cosmos DB for hot path storage. The hot path storage helps in quick retrieval of data for the purposes of visualizing important events and alerts. 

Data from the Azure Cosmos DB are fetched, aggregated and expose REST APIs for the visualization components to consume. 

### 3.6 OMS Log analytics 

**Introduction** 

The Microsoft Operations Management Suite (OMS), previously known as Azure Operational Insights, is a software as a service platform that allows an administrator to manage on-premises and cloud IT assets from one console. 

Microsoft OMS handles log analytics, IT automation, backup and recovery, and security and compliance tasks. Log analytics will collect and store your data from various log sources and allow you to query over them using a custom query language. 

**Implementation** 

In this solution OMS is used for getting logs for each component like web app, CosmosDB, event hub, Azure SQL DB etc. 

### 3.7 Application Insights 

**Introduction** 

Application Insights is an extensible Application Performance Management (APM) service for web developers on multiple platforms. Use it to monitor live web application. It will automatically detect performance anomalies. It includes powerful analytics tools to help diagnose issues and to understand what users do with web application. 

Application Insights monitor below: 

Request rates, response times, and failure rates 

Dependency rates, response times, and failure rates 

Exceptions  

Page views and load performance 

AJAX calls 

User and session counts 

Performance counters 

Host diagnostics from Docker or Azure 

Diagnostic trace logs 

Custom events and metrics 

**Implementation** 

Application Insights to provide monitoring for Web Application. Application Insights store the logs of the Web API which will be helpful to trace the working of web API. 

### 3.8 Storage Account 

**Introduction** 

Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers a massively scalable object store for data objects, a file system service for the cloud, a messaging store for reliable messaging, and a NoSQL store. 

**Implementation** 

In this solution Storage account is used to store the documents (Invoice Document, Item List ..etc) uploaded in the web app for a particular shipment. The meta data of these documents is stored in the Blockchain for immutability. 

### 3.9 SQL Database 

**Introduction** 

Azure SQL Database is a relational database-as-a service using the Microsoft SQL Server Engine. SQL Database is a high-performance, reliable, and secure database you can use to build data-driven applications and websites in the programming language of your choice, without needing to manage infrastructure. 

**Implementation** 

The data from the stream analytics engine is also passed on to the Azure SQL DB for cold path storage. Azure functions fetch the data from SQL DB for further analytics. 

### 3.10 Automation Account 

**Introduction** 

Azure Automation delivers a cloud-based automation and configuration service that provides consistent management across your Azure and non-Azure environments. It consists of process automation, update management, and configuration features. Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. 

**Implementation** 

In this solution the Automation Account is used for creating the database and collections in Azure Cosmos DB. 

### 3.11 Availability Set 

**Introduction** 

An Availability Set is a logical grouping capability for isolating Virtual Machine (VM) resources from each other when they're deployed. Azure makes sure that the VMs you place within an Availability Set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or software failure happens, only a subset of your VMs are impacted and your overall solution stays operational. Availability Sets are essential for building reliable cloud solutions. 

**Implementation** 

Availability set for backend VM and Block chain VMs are used for Hight Availability of the VMs in the Cold-Chain Solution. 

### 3.12 Stream Analytics Job 

**Introduction** 

Azure Stream Analytics is an event-processing engine that allows you to examine high volumes of data streaming from devices. Incoming data can be from devices, sensors, web sites, social media feeds, applications, and more. It also supports extracting information from data streams, identifying patterns, and relationships. You can then use these patterns to trigger other actions downstream, such as create alerts, feed information to a reporting tool, or store it for later use. 

**Implementation** 

The data received in the Azure IoT Hub is then fed in to the Azure Stream analytics engine, which provides inline analytics capabilities. Stream analytics process the raw data received at the IoT hub and send it to the Cosmos DB and SQL Database. 

### 3.13 Virtual Machine (VM) 

**Introduction** 

Microsoft Azure is a growing collection of integrated public cloud services including analytics, virtual machines, databases, mobile, networking, storage, and web—ideal for hosting your solutions. Microsoft Azure provides a scalable computing platform that allows you to only pay for what you use, when you want it - without having to invest in on-premises hardware. Azure is ready when you are to scale your solutions up and out to whatever scale you require to service the needs of your clients. 

**Implementation** 

In this solution VMs are used for both Backend VM and Blockchain, In Backend VM three Cron jobs are running one is for Receive and parse GPS data, second job is to execute various stored procedures for every two minutes and the third one is for Inserting alerts into the Blockchain. 

### 3.14 Traffic Manager 

**Introduction** 

Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute traffic optimally to services across global Azure regions, while providing high availability and responsiveness. 

Traffic Manager uses DNS to direct client requests to the most appropriate service endpoint based on a traffic-routing method and the health of the endpoints. An endpoint is any Internet-facing service hosted inside or outside of Azure. Traffic Manager provides a range of traffic-routing methods and endpoint monitoring options to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region. 

**Implementation** 

Traffic manager is used in this solution to provide high availability for the web app, function app and Backend VM. 

### 3.15 Quorum Blockchain 

**Blockchain**

A blockchain is, in the simplest of terms, a time-stamped series of immutable record of data that is managed by cluster of computers not owned by any single entity. Each of these blocks of data (i.e. block) are secured and bound to each other using cryptographic principles (i.e. chain). 

**Quorum Blockchain**

Quorum is an Ethereum based DLT (Distributed Ledger Technology). The objective behind this to provide a permissioned implementation of Ethereum which supports transactions and contract privacy. 

The functioning of Quorum is like Ethereum but with a few differences. Here is how the Quorum is different from Ethereum blockchain:  

* Network and peer permissions management 

* Enhanced transaction and contract privacy 

* Voting-based consensus mechanisms 

* Better performance 

**Implementation** 

The Blockchain services on Azure shall be leveraged to bring in the features of immutability and transparency of the transactions, events and alerts generated by the IoT sensors –which include capturing the shipment details at origin, updating the shipment details at handoff points, updating the shipment details with events and alerts generated by the IoT solution. 


## 4.0 Solution Types and Cost Mechanism

Tiers help the customer to choose to deploy Azure resources with minimal cost for regular use or maximum cost for production/enterprise use. The Cold-Chain automated solution have 3 pricing tiers named Basic, Standard and Premium based on type of resources used in the deployment. Generally, for testing or POCs the customer can choose Basic pricing tier and for production/ enterprise grade solutions he can choose Standard/Premium tier.

### 4.1 Solutions and Associated Costs

The solutions are created considering users requirements & have cost effective measures. Users have control on what type of Azure resources can be deployed with respect to Stock Keeping Unit (SKU) or pricing tiers. 

These options would enable the users to choose, which Azure resources to be deployed with minimal SKU and production SKU. 

The cost models per solutions are explained in further sections:

### 4.2 Basic

The Basic solution requires minimum Azure components with minimal available SKU’s] This Solution provides (Core + Security + Monitoring) features such as security, application Insights & OMS Log Analytics.

*	The estimated Monthly Azure cost is: $ **334.05**

*	The estimated **Optional Monthly** Azure cost is: $ **382.08**

**Note**: Refer below table for the optional component list & Features

**Pricing Model for Basic Solution:**

Prices are calculated by Considering Location as **West US2** and Pricing Model as “**PAYG**”.

| **Resource Name**           | **Size**       | **Resource costing model**    | **Azure Cost/month**                                                                                                                                 
| -------------              | -------------       | --------------------      | -------------------                                                                                                                           
| **Application Insights**       | Basic, 1GB * $2.30 First 5GB free per month   | PAYG         | $2.30  
| **Function App**   | The first 400,000 GB/s of execution and 1,000,000 executions are free.     | PAYG    | $0.00
| **App Service**   | B1: (1 Core(s), 1.75 GB RAM, 10 GB Storage) x 730 Hours; Linux OS    | PAYG    | $36.50  
| **IoT Hub**        | Free: 500 devices, 8,000 msgs/day, $00.00/mo., 1 Units      | PAYG                 | $00.00    
| **Azure SQL Database**      | Single Database, DTU Purchase Model, Standard Tier, S1: 20 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours, 5 GB Retention       | PAYG                        | $29.43
| **Storage Account**        | Block Blob Storage, LRS Redundancy, General Purpose V1, 100 GB Capacity, 100 storage transactions       | PAYG   | $2.44   
| **Azure Cosmos DB**       | 2 GB storage, 4 x100 RUs           | PAYG          | $23.86  
| **Log Analytics**   | First 5GB of data storage is free. Per GB(Standalone). After finishing 5GB, $2.30 per GB   | PAYG  | $2.30  
| **Automation Account**   | 500 minutes of process automation and 5 nodes are free each month. Logs stored are billed at Log Analytics rates.   | PAYG  | $0.00
| **Azure Stream Analytics**   | Standard Streaming Unit, 1 Units * US$ 80.30    | PAYG  | $80.30
| **Ubuntu VM**   | D2sV3: 2 vCPU(s), 8GB RAM, 16GB Temporary storage, 4-data disks   | PAYG  | $70.13
| **Quorum Single Member Blockchain**   | D1V2, Category: General Purpose, Core:1 RAM:3.5GB Disk Space:50GB SSD + Load Balancer(Basic)   | BYOL  | $86.79
| **(Optional) API Management**   | Tire: Developer, 1 Units = 48.03   | PAYG  | $48.03
|        |         |    **Optional Total Cost/Month**     | **$382.08**
|        |         |    **Total Cost/Month**     | **$334.05** 


### 4.3 Standard

The standard solution provides (Core + Security + Monitoring + Hardening) features such as security, application Insights, OMS Log Analytics, High Availability & Disaster recovery. The details on components used in this section is listed in the table given below

Prices are calculated by Location as **West US2** and Pricing Model as “**PAYG**”.

* The Estimated Monthly Azure cost is: **$ 709.09**

* The Estimated **Optional Monthly** Azure cost is: **$ 757.12**

**Note**: Refer below table for the optional component list & Features

**Pricing Model for Standard Solution**:

Prices are calculated by Location as **West US2** and Pricing Model as “**PAYG**”.

| **Resource Name**           | **Size**       | **Resource costing model**    | **Azure Cost/month**                                                                                                                                 
| -------------              | -------------       | --------------------      | -------------------                                                                                                                           
| **Application Insights**       | Basic, 1GB * $2.30 First 5GB free per month   | PAYG         | $2.30  
| **Function App**   | The first 400,000 GB/s of execution and 1,000,000 executions are free.     | PAYG    | $0.00
| **App Service**   | Standard S1: (1 Core(s), 1.75 GB RAM, 50 GB Storage) x 730 Hours; Linux OS     | PAYG    | $69.35  
| **IoT Hub**        | Standard S1: Unlimited devices, 4,00,000 msgs/day, $25.00/mo., 1 Units       | PAYG                 | $25.00    
| **Azure SQL Database**      | Single Database, DTU Purchase Model, Standard Tier, S4: 200 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours, 5 GB Retention        | PAYG                        | $294.37
| **Storage Account**        | Block Blob Storage, LRS Redundancy, General Purpose V1, 100 GB Capacity, 100 storage transactions       | PAYG   | $4.84   
| **Azure Cosmos DB**       | 2 GB storage, 4 x100 RUs           | PAYG          | $23.86  
| **Log Analytics**   | First 5GB of data storage is free. Per GB(Standalone). After finishing 5GB, $2.30 per GB   | PAYG  | $2.30  
| **Automation Account**   | 500 minutes of process automation and 5 nodes are free each month. Logs stored are billed at Log Analytics rates.   | PAYG  | $0.00
| **Azure Stream Analytics**   | Standard Streaming Unit, 1 Units * US$ 80.30    | PAYG  | $80.30
| **Ubuntu VM**   | D2sV3: 2 vCPU(s), 8GB RAM, 16GB Temporary storage, 4-data disks   | PAYG  | $70.13
| **Quorum Single Member Blockchain**   | D1V2, Category: General Purpose, Core:1 RAM:3.5GB Disk Space:50GB SSD + Load Balancer(Basic)   | BYOL  | $129.94
| **Traffic Manager**   | 3* (0 million DNS queries/mo. 1 Azure endpoint(s), 0 Fast Azure endpoint(s), 1 External endpoint(s), 0 Fast External endpoint(s), 0 million(s) of user measurements, 0 million(s) of data points processed).      | PAYG  | $2.70
| **(Optional) API Management**   | Tire: Developer, 1 Units = 48.03   | PAYG  | $48.03
|        |         |    **Optional Total Cost/Month**     | **$757.12**
|        |         |    **Total Cost/Month**     | **$709.09**

### 4.4 Premium 

This solution also provides (Core + Monitoring +Hardening), the difference between Standard & Premium solution is under Premium - Both the regions can be deployed at same time, and however this is not possible under standard solution. The details on components used in this solution are listed in Section:

The Estimated Monthly Azure cost is: **$ 1319.74**

The Estimated **Optional Monthly** Azure cost is: **$ 1367.77**

**Pricing Model for Premium Solution**:

Prices are calculated by Considering Location as **West US2** and Pricing Model as “**PAYG**”.

 **Resource Name**           | **Size**       | **Resource costing model**    | **Azure Cost/month**                                                                                                                                 
| -------------              | -------------       | --------------------      | -------------------                                                                                                                           
| **Application Insights**       | Basic, 1GB * $2.30 First 5GB free per month   | PAYG         | $2.30  
| **Function App**   | 2 * (The first 400,000 GB/s of execution and 1,000,000 executions are free.)     | PAYG    | $0.00
| **App Service**   | 2 * (Standard S1: (1 Core(s), 1.75 GB RAM, 50 GB Storage) x 730 Hours; Linux OS)     | PAYG    | $138.70  
| **IoT Hub**        | Standard S1: Unlimited devices, 4,00,000 msgs/day, $25.00/mo., 1 Units       | PAYG                 | $25.00    
| **Azure SQL Database**      | 2 * (Single Database, DTU Purchase Model, Standard Tier, S4: 200 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours, 5 GB Retention)       | PAYG                        | $588.74
| **Storage Account**        | Block Blob Storage, LRS Redundancy, General Purpose V1, 100 GB Capacity, 100 storage transactions       | PAYG   | $4.84   
| **Azure Cosmos DB**       | 2 * (2 GB storage, 4 x100 RUs)           | PAYG          | $47.72  
| **Log Analytics**   | First 5GB of data storage is free. Per GB(Standalone). After finishing 5GB, $2.30 per GB   | PAYG  | $2.30  
| **Automation Account**   | 500 minutes of process automation and 5 nodes are free each month. Logs stored are billed at Log Analytics rates.   | PAYG  | $0.00
| **Azure Stream Analytics**   | 2 * (Standard Streaming Unit, 1 Units * US$ 80.30)    | PAYG  | $160.60
| **Ubuntu VM**   | 2 * (D2sV3: 2 vCPU(s), 8GB RAM, 16GB Temporary storage, 4-data disks)   | PAYG  | $142.84
| **Quorum Single Member Blockchain**   | D1V2, Category: General Purpose, Core:1 RAM:3.5GB Disk Space:50GB SSD    | BYOL  | $204.00
| **Traffic Manager**   | 3* (0 million DNS queries/mo. 1 Azure endpoint(s), 0 Fast Azure endpoint(s), 1 External endpoint(s), 0 Fast External endpoint(s), 0 million(s) of user measurements, 0 million(s) of data points processed).      | PAYG  | $2.70
| **(Optional) API Management**   | Tire: Developer, 1 Units = 48.03   | PAYG  | $48.03
|        |         |    **Optional Total Cost/Month**     | **$1367.77**
|        |         |    **Total Cost/Month**     | **$1319.74**

### 4.5 Cost Comparison 

In this section we will be comparing the cost for all the solution provided in terms of Features &dollar $ Impact:

### 4.6 In terms of features

The below table explain the distinctive features available across solution types.

2 Dollar Impact:

The below Table explains the $ impact for the solutions by resources.


| **Resource Name**           | **Parameter**         | **Basic**                  | **Standard**            | **Premium**                                                                                                                 
| -------------               | -------------         | --------------------       | ------------            | ----------    
| App Service Plan            | SKU                   | B1                         | S1                      | S1
|                             | Cores                 | 1 core                     | 1 core                  | 1 core
|                             | RAM                   | 1.75 GB                    | 1.75 GB                 | 1.75 GB
|                             | Storage               | 10 GB                      | 50 GB                   | 50 GB 
|                             | OS                    | Linux OS                 | Linux OS              | Linux OS
| Traffic Manager             | DNS Queries           |                            | 0 million/month         | 0 million/month
|                             | Azure Endpoints       |                            | 1 Endpoints             | 1 Endpoints
|                             | Fast Interval HealthChecks Add-on (Azure)  |            | 1 Endpoints             | 1 Endpoints
|                             | External Endpoints    |                            | 1 Endpoints             | 1 Endpoints
|                             | Fast Interval Health Checks Add-on (External)      |                    | 0 Endpoints     | 0 Endpoints
|                             | Real User Measurements    |                        | 0 million measurements  | 0 million measurements
|                             | Traffic View          |                            | 0 million data points processed     | 0 million data points processed
| IoT Hub                     | SKU                   | Free                         | S1                      | S1
|                             | Devices               | 500 Devices          | Unlimited Devices       | Unlimited Devices
|                             | Messages              | 8,000 msgs/day          | 4,00,000 msgs/day       | 4,00,000 msgs/day
| Function App                  | Memory Size             | 400000 GB/s                 | 400000 GB/s               | 400000 GB/s
|                             | Requests               | 0 Execution count            | 0 Execution count         | 0 Execution count 
| Automation Account            | Nodes        | 500 minutes of process automation and 5 nodes are free each month         | 500 minutes of process automation and 5 nodes are free each month             | 500 minutes of process automation and 5 nodes are free each month
| Stream Analytics Job                | Standard Streaming Unit             | 1 Units           | 1 Units           | 1 Units 
| SQL Database                | Type             | Single Database           | Single Database           | Single Database
|                             | Back Up Storage Tire             | LRS           | LRS           | LRS
|                             | Purchase Model             | DTU           | DTU           | DTU
|                             | Service Tire             | Standard           | Standard           | Standard
|                             | Performance Level             | 1-Database, S1: 20 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours           | 1-Database, S1: 20 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours           | 1-Database, S1: 20 DTUs, 250 GB included storage per DB, 1 Database(s) x 730 Hours
|                             | Storage             | 250 GB           | 250 GB           | 250 GB
|                             | Long Term Retention             | 5 GB           | 5 GB           | 5 GB
| Storage                     | Purchase model         | Block Blob Storage      | Block Blob Storage    | Block Blob Storage
|                             | REDUNDANCY            | LRS                        | GRS                     | GRS
|                             | Capacity              | 100 GB                     | 100 GB                  | 100 GB
|                             | STORAGE ACCOUNT TYPE      | General Purpose V1          | General Purpose V1       | General Purpose V1
|                             | Capacity      | 100 GB          | 100 GB       | 100 GB
|                     | Storage transactions       | 100 Transaction units         | 100 Transaction units      | 100 Transaction units 
| Azure Cosmos DB             | SKU                   | Standard                   | Standard               |Standard 
|                             | Storage               | 2 Storage                 | 2 Storage             | 2 Storage 
|                             | Purchase model        | 4 * 100 RU/sec             | 4 * 100 RU/sec         |4 * 100 RU/sec
| Azure Active Directory   | Stored users          | 50000 users                | 50000 users             | 50000 users
|                             | Authentications       | 50000 Authentications      | 50000 Authentications   | 50000 Authentications
|                             | Multi-Factor Authentications            | 0 Authentications         | 0 Authentications             | 0 Authentications
| Log Analytics               | Data Retention        | 6 GB, 5 GB of data is included for free.            | 6 GB, 5 GB of data is included for free.              | 6 GB, 5 GB of data is included for free.
| Application Insights        | Logs collected        | 6 GB, 5 GB of data is included for free.            | 6 GB, 5 GB of data is included for free.              | 6 GB, 5 GB of data is included for free.
| Ubuntu VM                     | REGION         | West US2      | West US2    | West US2
|                      | VM Size         | D2sV3      | D2sV3    | D2sV3
|                      | OPERATING SYSTEM         | Linux       | Linux     | Linux 
|                      | TYPE         | Ubuntu      | Ubuntu    | Ubuntu
|                      | TIER         | Standard      | Standard    | Standard
|                      | Storage transactions         | 100 Transaction units       | 100 Transaction units     | 100 Transaction units 
| Quorum Single Member Blockchain             | VM Size                  | D1_v2                 | D1_v2                   | D1_v2
|                      | OFFERING                  | Standard                     | Standard                | Standard
|                      | Family                | General purpose                 | General purpose                   | General purpose
|                      | VCPUS                   | 1                     | 1                       | 1
|                      | RAM                       | 3.5                  | 3.5            | 3.5
|                      | Data Disks            | 4              | 4              | 4
|                      | IOPSL              | 4 * 500           | 4 * 500          | 4 * 500
|                      | Temporary Storage              | 50 GB            | 50 GB          | 50 GB
| API Management            | Tier              | Developer            | Developer          | Developer


### 4.7 Dollar Impact: 

The below Table explains the $ impact for the solutions by resources.

| **Resource Name**           | **Basic**                  | **Standard**                 | **Premium**                                                                                                                
| -------------              | ------------------         | --------------------                       | ------------ 
| **Application Insights**                  | $2.30          | $2.30          | $2.30
| **Function App**                      | $0.00          | $0.00	          | $0.00
| **App Service**                   | $36.50          | $69.35	          | $138.70
| **IoT Hub**                      | $0.00           | $25.00	          | $25.00
| **Azure SQL Database**          | $29.43	         | $294.37	          | $588.74
| **Storage**           | $2.44	         | $4.84	          | $4.84
| **Azure Cosmos DB**              | $23.86	         | $23.86	          | $47.72
| **Log Analytics**              | $2.30	         | $2.30	          | $2.30
| **Automation Account**   | $0.00	         | $0.00	          | $0.00
| **Azure Stream Analytics**                | $80.30	         | $80.30	          | $160.60
| **Ubuntu VM**         | $70.13	         | $70.13	          | $142.84
| **Quorum Single Member Blockchain**              | $86.79	         | $129.94          | $204.00
| **Traffic Manager**              | NA	         | $2.70           | $2.70
| **(Optional) API Management**              | $48.03	         | $48.03           | $48.03

### 4.8 Estimated Monthly Cost for each Solution:

| **Resource Name**           | **Basic**                    | **Standard**                 | **Premium**                                                                                                                
| -------------              | ------------------------       | --------------------      | ------------ 
| **Estimated monthly cost**            | **$ 334.05**            | **$ 709.09**  	             | **$ 1319.74**
| **Optional Estimated monthly cost**            | **$ 382.08**            | **$ 757.12**  	             | **$ 1367.77**

## 5.0 Further References

### 5.1 Deployment Guide

To Deploy the Cold-Chain solution please refer **Deployment Guide**. 

### 5.2 Admin Guide

**Admin Guide** explains about how to manage Azure resources, how to perform HA & DR strategies and validate components once the solution deployed Successfully. 

### 5.3 User Guide

To find how to use the Cold-chain solution once deployed successfully in Azure portal refer **User Guide** 
