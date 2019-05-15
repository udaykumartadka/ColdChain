# Microsoft

# ColdChain Solution

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u0.png)

### Contents
 
 - [1. Introduction to User Guide](#1-introduction-to-user-guide)
 - [2. Accessing the Web Application](#2-accessing-the-web-application)
   - [2.1 User Management ](#21-user-management)
     - [2.1.1 Adding of User and assigning role](#211-adding-of-user-and-assigning-role)
     - [2.1.2 Editing or Updating User Role](#212-editing-or-updating-user-role)
     - [2.1.3 Deleting a User](#213-deleting-a-user)
   - [2.2 Device Management](#22-device-management)
      - [2.2.1 Gateway and Tracker Onboarding](#221-gateway-and-tracker-onboarding)
      - [2.2.2 Off boarding or Removing Onboarded Gateway and Tracker](#222-off-boarding-or-removing-onboarded-gateway-and-tracker)
 - [3. Shipment Management](#3-shipment-management)
   - [3.1 Create Shipment](#31-create-shipment)
   - [3.2 Mapping Beacons to Objects](#32-mapping-beacons-to-objects)
      - [3.2.1 Adding a Mapping](#321-adding-a-mapping)
      - [3.2.2 Create Association among Objects](#322-create-association-among-objects)
      - [3.2.3 Assigning Gateways and Tracker](#323-assigning-gateways-and-tracker)
      - [3.2.4 Uploading and Viewing Documents](#324-uploading-and-viewing-documents)
   - [3.3 Updating Shipment Status](#33-updating-shipment-status)
      - [3.3.1 Deactivating Shipment](#331-deactivating-shipment)
   - [3.4 Dashboard](#34-dashboard)
      - [3.4.1 Dashboard Summary](#341-dashboard-summary)
      - [3.4.2 Specific Shipment Dashboard](#342-specific-shipment-dashboard) 
    - [3.5 Report](#35-report)
    
    
    
    
    
    
## 1. Introduction to User Guide

Cold Chain management solution for Pharma addresses the challenges and concerns of the pharmaceutical companies, by providing near real-time tracking of the temperature sensitive consignments in a transparent and immutable manner throughout the supply chain, by combining IoT and Blockchain. The solution provides actionable insights for all the stakeholders through real time data capture, comprehensive analytics and immutable access with increased granularity (product, box, carton, or pallet level), thus helping in achieving business transformation and reaping the associated benefits. 
This quick start guide describes how to interact with the Cold Chain Portal. This portal has a provision to create, monitor and track the shipments at a pallet, carton, box and a unit level. The portal allows to monitor the near real-time humidity, temperature, shock & vibration and tamper status of the various artifacts in the shipment. The immutability of transactions from portal is achieved by Blockchain.

## 2. Accessing the Web Application

Once the solution is deployed successfully, navigate to the Resource Group and select the created resource group to view the list of resources that are created in the Resource Group as shown in the following figure.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u1.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u2.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u3.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u4.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u5.png)

1.	Go to **Resource Group** -> Click on **Web App** from the below resources.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u6.png)

2. Copy the **Web App URL** and open it in the browser.

**Note**: If it is Standard or Premium, you need to copy the **Traffic Manager URL(websiteURLHA)** and open it

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u7.png)

3. Before entering the Web App URL, you can remove the **https**. Please enter <http://webapigw6ej.azurewebsites.net> you will be redirected to Azure AD Authentication page.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u8.png)

4.	Enter Azure AD Authorized User Credentials.

   User ID: *******@SecureColdChain.com**
 
   Password: ******************
 
After successful validation by the Azure AD, based on the user role the web app will redirect you to Admin Page if the user role is Admin, else it will redirect to Dashboard page hiding the Admin Tab for anyone to access.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u9.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u10.png)

5.	The administrator will have full access to the system. Below mentioned are the main roles for an administrator. 
    * User Management
    * Device management 
    * Shipment Management

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u11.png)

### 2.1 User Management:

1.	Click on the User Management tab to create users. In user management admin can perform following actions.
     * Adding User 
     * Editing/Updating User 
     *	Deleting User

#### 2.1.1 Adding of User and assigning role

1.	Click on the **user** tab to create users.
  
![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u12.png)

2.	In right side of the user management page click **+** to create a user. When you click on the **+** symbol, a pop up will open which looks like the image shown below: 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u13.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u14.png)

3.	Click on Full Username, list of all the user who are included in the Active Directory Group, the **Email** field gets auto populated and you assign the role by clicking in the **Role** field where in you can select any role from the drop-down list and assign it to the user by clicking on the **Save** Button.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u15.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u16.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u17.png)

4.	After saving the User Management tab, you will get a pop-up window **Added User** and the user will be seen in the list of active users.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u18.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u19.png)

#### 2.1.2 Editing or Updating User Role

1.	When you click on the **role** column against any user, you will be able to see a drop-down list consisting of different roles as seen in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u20.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u21.png)

2.	After selecting the role from the list, you need to click on **right green** button seen in the last column of the table. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u22.png)

3.	The user role will be updated, and you will get a response as under.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u23.png)

4.	You can now check the **user role** against the user in the active user list which will be changed to the new role that you have assigned.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u24.png)

#### 2.1.3 Deleting a User

1.	Click on **delete symbol** as seen in the last column of the table.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u25.png)

2.	You will get a response as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u26.png)

3.	The user will be removed from the active user’s list table as seen below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u27.png)

### 2.2 Device Management

#### 2.2.1 Gateway and Tracker Onboarding

 1.	In **Device Management** tab, the user to on-board **gateways** and **trackers** on to the system by clicking in the **+ Add Device** Button in right side of the page

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u28.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u29.png)

2.	After clicking on that **Add Device** button a popup box will open asking you to add **Mac ID** and select the type of **Device** from a drop-down list. Once you have filled the required information, click on the **Add button** which will store the device information in the database.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u30.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u31.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u32.png)

3.	Once the device type like **Gateway** and **Tracker** is successfully added to the database, you will get a popup window to response as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u33.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u34.png)

4.	Here you can see the **added Gateway** and **Tracker**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u35.png)

#### 2.2.2 Off boarding or Removing Onboarded Gateway and Tracker

1.	Click on **Remove** icon to remove the corresponding device you want to off-board.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u36.png)

2.	Once you click on the **delete device button** highlighted in the image above, you will get a response as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u37.png)

3.	The Gateway with Mac-Id **C031061830-00527** will now be removed from the **Onboarded device** list as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u38.png)

## 3. Shipment Management

The web application allows the admin to create and manage the shipments. The web application will allow the admin to map the beacons with product, box, carton and pallet that will be used during the transport. After that, the web application will allow the admin to create association between objects which will help while monitoring the sensor data during the transport.  After the association among the objects is created, the admin will have assign gateways and trackers to each pallet. Each of this process will be discussed in this section.

### 3.1 Create Shipment

1.	Click on **Shipment tab** under **Admin page**, here you can **create a shipment** and **Associate**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u39.png)

2.	To create a new **Shipment**, you need to click on the + on the top right corner above the **shipment List**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u40.png)

3.	Once you click on the **+ symbol**, a popup box opens for you to add the required information about the shipment such as **Shipment ID, Purchase Order, Logistics Partner, Source, Destination** and **list of products**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u41.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u42.png)

4.	Once you click on **Create button** you will get a popup window **Consignment successfully** added to **Blockchain**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u43.png)

5.	Once you **created shipment**, click on **refresh** symbol and you can see the **added shipment**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u44.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u45.png)

**Note**: The next step is to **Map Beacons** to the **object** and assigning **Tracker** and **Gateway** to each of the **pallets** present in the **shipment**.

### 3.2 Mapping Beacons to Objects

The web application provides an interface for the admin to map each beacon sensor with an object (ex. Product, Box, Carton, Pallet). These mapping data is required to monitor the sensor data during the transit of the shipment. This mapping will help in monitoring the sensor data at multiple level (Product level, Box Level, Carton Level and Pallet Level).

1.	In the **Shipment** tab click on the **Associate** button shipment.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u46.png)

#### 3.2.1 Adding a Mapping

1.	You can see a **green Map button** on the top left corner above the table and a drop-down list below it in the above image. Click on **Map button** you see a new row is added in the table where minimum and maximum threshold values will be automatically populated based on the storage class you have selected. These values are also editable.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u47.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u48.png)

2.	To map a beacon to an object, you need to add the **Beacon Id** of the **Beacon Sensor**, the **Object ID** of the object you want to map the beacon, the type of the Object and the **Content** of the object as below
3.	Once you have filled all the related information, click on the **right green symbol** in the table. This will save the mapping information in the database.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u49.png)

4.	It will open the popup window to add the database.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u50.png)

5.	We have added multiple **Beacons** to the database as shown in below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u51.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u52.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u53.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u54.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u55.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u56.png)

#### 3.2.2 Create Association among Objects

Once the beacons are mapped with the object, the next step is to create association among the objects. This association will help us in defining hierarchy among the objects in a shipment.

1.	Once you have clicked on the **Next button** after mapping your beacons and objects.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u57.png)

2.	Simply **drag** and **drop** the labels from the **left section** to **right section** of the page. This definition of hierarchy is needed to know till which level we are monitoring the sensor data.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u58.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u59.png)

3.	After defining the hierarchy, click on the **Next button** to **Associate objects**. The following page will appear.

4.	We have the 4-level of hierarchy **Box -> Product.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u60.png)

5.	You need to add **object id** of **box against** the box field and **product against** of the **product** in the product field and **press enter**. This will add the product id in the below text area in the form of a label as seen below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u61.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u62.png)

6.	Once you have added **product id** and **box id**, click on the **Associate button**. This will save the association in database

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u63.png)

7.	You will be able to see this association under the **Association** section of the page.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u64.png)

8.	You can add **multiple Products** this way.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u65.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u66.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u67.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u68.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u69.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u70.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u71.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u72.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u73.png)

6.	You will be able to see an **association summary** as below. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u74.png)

#### 3.2.3 Assigning Gateways and Tracker

Click on the **+ button** on the top right corner, a row will get added where you need to enter **Pallet’s Object ID, Gateway's** and **Tracker’s** serial numbers and click on **create** button.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u75.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u76.png)

After the **Gateway** and **Tracker** is successfully assigned to the **Pallet**, you will see a response like **Gateway is assigned**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u77.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u78.png)

Here you can see the added number of **gateways, trackers** and **beacons.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u79.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u80.png)

#### 3.2.4 Uploading and Viewing Documents

##### 3.2.4.1 Uploading Documents

Click on **document icon** in the **shipment tab**, it will expand a section where you can upload your **documents**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u81.png)

Click on **Choose Files Button** which will open a window for you to select the file.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u82.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u83.png)

Once the file is uploaded, you will see **File Uploaded Successfully** message as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u84.png)

The next step is to upload document information to the **Blockchain**. For this, select the **Document Type** from the drop-down list.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u85.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u86.png)

Click on **Upload to Blockchain** button which will upload the document information in the **Blockchain**. After successful uploaded, you will see a response as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u87.png)

##### 3.2.4.2 Viewing Documents

When you click the V**iew Document Button**, a section gets expanded below the ribbon where you will be able to see a table which contains a list of documents against the respective shipment. The expanded section is **highlighted** in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u88.png)

When you click on **View icon** button you will be able to view the document in the new tab or it will get downloaded if the file extension is other than **.pdf**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u89.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u90.png)

### 3.3 Updating Shipment Status

1.	Click on **Update Status** button, a dialog box will open as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u91.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u92.png)

2.	From the drop-down list, select the status of your choice as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u93.png)

3.	After you have selected shipment status, click on the **Update Status** button. This will update the status value of the shipment in the database and a record of this update will be stored in the **Blockchain**. After successful uploaded of the status, you will get the following response from Blockchain.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u94.png)

4.	To check if the status of the shipment is updated or not, click on **shipment ID** of the ribbon as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u95.png)

5.	This will open the dashboard of that respective shipment where you can check the status value under **Shipping Details Sections** as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u96.png)

6.	To check whether **the record of shipment status is recorded in Blockchain or not**, you can simply check the **Blockchain Transactions** sections under the **Shipping Details** sections where all the transaction made to the Blockchain are shown in chronological order.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u97.png)

7.	Click on the transaction hash which will show the **Transaction details** in a modal as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u98.png)

#### 3.3.1 Deactivating Shipment

1.	To **deactivate/close** any shipment, click on **Close button** which is highlighted in the below image. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u99.png)

2.	After clicking on the **close button**, a modal will open as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u100.png)

3.	From the drop-down list, select the type of status you want to **close/deactivate** the shipment with.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u101.png)

4.	Once you have selected the **closed**, click on the **Deactivate Shipment** button. A dialog box will open which will ask for confirmation about **closing/deactivating** the shipment as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u102.png)

5.	When you click on **Yes button**, you will get a response from **Blockchain** as below and the shipment is now **deactivated.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u103.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u104.png)

6.	When you reload your **Shipments Tab**, the shipment will get **deactivated** and the shipment will be represented by a dark red ribbon as shown in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u105.png)

### 3.4 Dashboard

#### 3.4.1 Dashboard Summary

Click on **dashboard tab** it will navigate the dashboard page.

1.	In **Current Shipment Section**, when you click on **Shipment ID**, marker on the map will be highlighted that shows the location of that shipment.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u106.png)

2.	When you **click** on that marker, an overlay popup will be displayed against the marker that will show the **Shipment Details** of that **Shipment**.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u107.png)

3.	 In the **Current Shipments Section,** when you click on the **i  symbol** against a particular Shipment ID, an accordion will be displayed below the S**hipment ID** which will show an overview of the shipment status 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u108.png)

#### 3.4.2 Specific Shipment Dashboard

When you click on **eye symbol** against a **Shipment ID** in **Current Shipment** section it will redirect you to a page that will have details of the **Shipment**. This page has **7 tabs** which will be described in this section. The five tabs are: **Tracker, Status, Devices, Incidents, Blockchain Alerts Stored Sensor Data and Stored Sensor Alerts**. The main layout of this page consists of **Shipment Details, Alert Summary Tabs, Blockchain Transaction, Shipping Object Details** and Tabs Section.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u109.png)

#### Shipping Details Section

This section shows basic information about the shipment such as **Shipment ID, Purchase Order Number, Source, Destination and Status** of the shipment and the last known time of **GPS signal.** This section is highlighted in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u110.png)

**Blockchain Transactions Section**

This section consists history of all the **Blockchain Transactions** in chronological order. The type of transaction is also shown below the timestamp. This section is highlighted in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u111.png)

When you click on the **Transaction Hash**, a dialog box will open which will show the **Transaction Details** as shown below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u112.png)

**Shipping Objects Section**

This section consists of number of **Pallet, Carton, Boxes** and **Products** that are packaged under a **specific shipment.** This section is highlighted in the below image.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u113.png)

##### 3.4.2.1 Tracker Tab

The **Tracker Tab** will be rendered which will show the last known location of the **shipment.** The view of this tab is shown above. When you click on the marker, a pop-up will be display next to the marker that will show **shipment details** and **incidents.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u114.png)

##### 3.4.2.1	Status Tab

The Status Tab will show a list of objects along with their **Object ID, Beacon ID**, the object it is associated with, **Temperature, Humidity, Shock** and **Vibration Alerts,** and count of incidents.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u115.png)

User can visualize the **Temperature** and **Humidity** data of each object through a chart that will be rendered when a user clicks on **icon button.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u116.png)

You can select the date range by clicking in the box area where it says **Click her to change Date Range**. After clicking, you will get date selector as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u117.png)

You can select the date range and click on **update button**. The graph will get updated by the **temperature** or **humidity** values that falls under the selected date range.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u118.png)

##### 3.4.2.2	Devices Tab

The **Devices Tab** will consist of a list of association of **beacons** and **objects** with **Gateways.** The connectivity status of the devices will also be shown in this list.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u119.png)

##### 3.4.2.3	Incidents Tab

The **Incidents Tab** consists of a list of all the alerts that has occurred over the course of monitoring the shipment. The list contains details about the alerts like the object **(Product, Box, Carton or Pallet)** where the alert has occurred, **timestamp** when the alert has occurred, type of alert **(Temperature, Humidity, Tamper, Shock/Vibration Alert)** and the location where the alert has taken place. 

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u120.png)

One can acknowledge the alert by clicking on the **Acknowledge** button. Clicking on that button will open a dialog box asking for acknowledgement note. Once you fill the acknowledgement note, click on **Acknowledge** button to store this note in the database.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u121.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u122.png)

The incident which is already acknowledged will be marked as **Acknowledged** under **Action** column. You can view the Acknowledgement note by clicking on the button. This will open a dialog box which will show the Acknowledgement Note as below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u123.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u124.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u125.png)

##### 3.4.2.4	Blockchain Alert Tab
This tab shows all the alerts that are stored in **Blockchain.** All the information regarding the alert will be shown in this tab along with **Alert Starting Time** and **Alert Ending Time.**

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u126.png)

##### 3.4.2.5	Stored Sensor Data

Here we can see the whatever we added Beacons and Sensor data.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u127.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u128.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u129.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u130.png)

##### 3.4.2.6	Stored Sensor Alerts

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u131.png)

### 3.5 Report

 Click on the **View Report button,** the report corresponding to the selected **shipment** will be below.

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u132.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u133.png)

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u134.png)

To download this **Report,** click on the **Download Report** button seen on the top left corner of the page.  

![alt text](https://github.com/SecureColdChain/ColdChain/blob/master/Documentation/images/u135.png)
