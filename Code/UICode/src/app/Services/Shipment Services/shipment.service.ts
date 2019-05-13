import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LatLongDetails } from './LocationCoordinates';
import { AppSetting } from '../../Configuration Files/AppSetting';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  SpecificShipmentID;
  // Declare Global Variables Here to Use in Components
  public shipmentID: string;
  public shipmentMasterID: number;
  public shipmaster: any; // variable for contentList
  public LatLongArray: LatLongDetails[];
  public beaconId: string;

  // User Role Related Variables
  public userRole: string;
  public loggedIn: boolean;
  public viewDashboardTab: boolean;
  public viewAdminTab: boolean;
  public viewLoginTab: boolean;
  public email: string;

  // Global Variable Declaration ENDS Here

  private messageSource = new BehaviorSubject(this.LatLongArray);
  currentMessage = this.messageSource.asObservable();

  private userRoleSource = new BehaviorSubject('');
  currentUserRole = this.userRoleSource. asObservable();

  private BeaconId = new BehaviorSubject('');
  GetBeaconId = this.BeaconId.asObservable();

  private Incidents = new BehaviorSubject('');
  getIncidentList = this.Incidents.asObservable();

  findMaxHum(arr) {
    console.log(arr);
    let max = arr[0].humidity;
    let maxIndex = 0;
    for (let i = 0 ; i < arr.length; i++) {
      if (arr[i].humidity > max) {
        max = arr[i].humidity;
        maxIndex = i;
      }
    }
    console.log(max);
    return arr[maxIndex];
  }

  findMinHum(arr) {
    let res = arr[0].humidity;
    let minIndex = 0;
    for (let i = 0 ; i < arr.length; i++) {
      if (arr[i].humidity < res) {
        res = arr[i].humidity;
        minIndex = i
      }
    }
    console.log(res);
    return arr[minIndex];

  }

  findAvgHum(arr) {
    let res = 0;
    for (let i = 0 ; i < arr.length; i++) {
     res = res + arr[i].humidity;
    }
  res = res / arr.length;
    return res;

  }

  // TEMPERATURE CALCULATION
  findMaxTemp(arr) {
    console.log(arr);
    let max = arr[0].temperature;
    let maxIndex = 0;
    for (let i = 0 ; i < arr.length; i++) {
      if (arr[i].temperature > max) {
        max = arr[i].temperature;
        maxIndex = i;
      }
    }
    console.log(max);
    return arr[maxIndex];
  }

  findMinTemp(arr) {
    let res = arr[0].temperature;
    let minIndex = 0;
    for (let i = 0 ; i < arr.length; i++) {
      if (arr[i].temperature < res) {
        res = arr[i].temperature;
        minIndex = i;
      }
    }
    console.log(res);
    return arr[minIndex];

  }

  findAvgTemp(arr) {
    let res = 0;
    for (let i = 0 ; i < arr.length; i++) {
     res = res + arr[i].temperature;
    }
  res = res / arr.length;
    return res;

  }
  setBeaconId(message: any) {
    this.BeaconId.next(message);

  }

  changeIncidents(message: any) {
    this.Incidents.next(message);
  }

  changeMessage(message: any) {
    this.messageSource.next(message);

  }

  setUserRole(role: any) {
this.userRoleSource.next(role);

  }

  /* SETTING Lat Long For showing single marker when you click on any row in shipment List */
  setLatLongList(type, shipmentList) {
    this.LatLongArray = [];
    this.LatLongArray = shipmentList;
  }


  constructor(
    private http: Http
  ) {
    console.log('Shipment Services Initialized...');
  }


  getShipmentSummary() {
    return interval(5000).pipe(
      switchMap(() => this.http.get(environment.API_Endpoint + '/GetDasboardSummary'))
      , map(result => result));
  }


  getAllActiveShipments() {
    return this.http.get(environment.API_Endpoint + '/GetAllActiveShipments')
      .pipe(map(result => result));
  }

  getUserRole(emailID) {
    return this.http.get(environment.API_Endpoint + '/GetUserRoles?EmailId=' + emailID)
      .pipe(map(result => result));
  }


  // Get Specific Shipment Details --> POLLING
  GetActiveShipmentDetails(shipmentID) {
    return interval(25000).pipe(
      switchMap(() => this.http.get(environment.API_Endpoint + '/GetActiveShipmentDetails?ShipmentID=' + shipmentID))
      , map(result => result));
  }

// Get Active Shipment Details OBSERVABLE
 GetActiveShipmentDetailsObservable(shipmentID) {

    return this.http.get(environment.API_Endpoint + '/GetActiveShipmentDetails?ShipmentID=' + shipmentID)
      .pipe(map(result => result));
  }

  // Get ALL Shipments -->USED in ADMIN Shipments Tabs -->Shipment Ribbons
  getAllShipments() {
    return this.http.get(environment.API_Endpoint + '/GetAllShipmentDetails')
      .pipe(map(result => result));
  }

 // Delete a specific device from the database
 DeleteDevice(DeviceId) {
  return this.http.get(environment.API_Endpoint + '/DeleteDeviceInfo?DeviceID=' + DeviceId)
    .pipe(map(result => result));
 }


  // Get All Devices Details
  GetDeviceDetails() {
    return this.http.get(environment.API_Endpoint + '/GetDeviceInfo')
      .pipe(map(result => result));
  }

  // Get Shipment Incidents
  GetIncidentDetails(shipment_id) {
    return this.http.get(environment.API_Endpoint + '/GetIncidentDetails?ShipmentID=' + shipment_id)
      .pipe(map(result => result));
  }

    // Get Stored Shipment Incidents
    GetStoredIncidentDetails(shipment_id) {
      return this.http.get('https://cctitanfunctionaz.azurewebsites.net/api/GetStoredIncidentDetails?ShipmentID=' + shipment_id)
        .pipe(map(result => result));
    }

  getAssociationforShipments(shipmentId) {
    return this.http.get(environment.API_Endpoint + '/GetAssociationForShipment?ShipmentId=' + shipmentId)
      .pipe(map(result => result.json()));
  }
  // CREATE/ADD Shipment
  addShipment(shipmentObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(environment.API_Endpoint + '/AddShipmentDetails', shipmentObject, options)
      .pipe(map(result => result));
  }

  // Update Status in Azure
  UpdateShippingStatus(shipmentObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });


    return this.http.post(environment.API_Endpoint + '/UpdateShippingStatus', shipmentObject, options)
      .pipe(map(result => result));
  }

   // Acknowledge Alerts
   UpdateAcknowledgeNotes(postObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(environment.API_Endpoint + '/UpdateAcknowledgeNotes', postObject, options)
      .pipe(map(result => result));
  }

       // Get Beacon Details
   GetBeaconDetails(shipmaster) {
    return this.http.get(environment.API_Endpoint + '/GetBeaconDetails?ShipMasterId=' + shipmaster)
     .pipe(map(result => result));
 }

  GetAssociationTree(ShipmastertId, ObjectType) {
    const Url = environment.API_Endpoint + '/GetAssociationSubTree?ShipmasterId=';
    return this.http.get(Url + ShipmastertId + '&ObjectType=' + ObjectType)
      .pipe(map(result => result.json()));
  }
  // To get the content Details for a particular shipment masterid
  GetContent(shipmaster) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_Endpoint + '/GetProducts?ShipmasterId=' + shipmaster)
      .pipe(map(result => result));
  }


  // Get Shipment Report
    GetShipmentReport(shipmentId) {
      // tslint:disable-next-line:max-line-length
      return this.http.get(environment.API_Endpoint + '/GetShipmentReport?ShipmentID=' + shipmentId)
        .pipe(map(result => result));
    }

  //  Get Temperature Graph Values
  GetTemperatureGraph(beaconId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_Endpoint + '/GetTemperatureGraph?BeaconId=' + beaconId)
      .pipe(map(result => result));
  }

  // Get Humidity Graph Values
  GetHumidityGraph(beaconId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_Endpoint + '/GetHumidityGraph?BeaconId=' + beaconId)
      .pipe(map(result => result));
  }

    // Get Temperature Graph By Date
    GetTemperatureGraphByDate(getObject) {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      // tslint:disable-next-line:max-line-length
      return this.http.post(environment.API_Endpoint + '/GetTemperatureGraphByDate', getObject , options)
        .pipe(map(result => result));
    }

  // Get Humidity Graph By Date
  GetHumidityGraphByDate(getObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(environment.API_Endpoint + '/GetHumidityGraphByDate', getObject , options)
      .pipe(map(result => result));
  }

  // STORED GRAPH APIs

   // GetStoredTemperatureGraph
   GetStoredTemperatureGraph(beaconId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_Endpoint + '/GetStoredTemperatureGraph?BeaconId=' + beaconId)
      .pipe(map(result => result));
  }


  // GetStoredHumidityGraph
  GetStoredHumidityGraph(beaconId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_Endpoint + '/GetStoredHumidityGraph?BeaconId=' + beaconId)
      .pipe(map(result => result));
  }

  // Get Stored Temperature Graph By Date
  GetStoredTemperatureGraphByDate(getObject) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(environment.API_Endpoint + '/GetStoredTemperatureGraphByDate', getObject , options)
      .pipe(map(result => result));
  }

// Get Humidity Graph By Date
GetStoredHumidityGraphByDate(getObject) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const options = new RequestOptions({ headers: headers });
  // tslint:disable-next-line:max-line-length
  return this.http.post(environment.API_Endpoint + '/GetStoredHumidityGraphByDate', getObject , options)
    .pipe(map(result => result));
}

  // Polling Get Specific Shipment STATUS TAB ITEMS
  GetRealtimeSensorDetails(shipmentMasterID, shipmentID) {
    return interval(25000).pipe(
      // tslint:disable-next-line:max-line-length
      switchMap(() => this.http.get(environment.API_Endpoint + '/GetRealtimeSensorDetails?ShipmasterId=' + shipmentMasterID + '&ShipmentID=' + shipmentID) )
    , map(res => res));

  }

  // Get Stored Sensor Details
  GetStoredSensorDetails(shipmentMasterID) {
   return this.http.get(environment.API_Endpoint + '/GetStoredSensorDetails?ShipmasterId=' + shipmentMasterID )
    .pipe(map(result => result));
  }



  // Get Device Status
  GetDeviceStatus(shipment_id) {
    return this.http.get(environment.API_Endpoint + '/GetDeviceStatus?ShipmentID=' + shipment_id)
      .pipe(map(result => result));
  }

  // Delete a specific beacon from the database
  DeleteBeacon(BeaconObjId) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(environment.API_Endpoint + '/DeleteBeaconInfo?BeaconObjectId=' + BeaconObjId, options)
    .pipe(map(result => result));
  }

}
export class ShipmentDetailsService {
  ShipmentModel = {
    ShipmentId: '',
    ShipMasterId: ''
  };

  private ShipmentDetails = new BehaviorSubject(this.ShipmentModel);
  GetShipmentDetails = this.ShipmentDetails.asObservable(); // for access

  ShipmentDetailsDataTransfer(message: any) {
    this.ShipmentDetails.next(message);
  }
}

export class GatewayDetailService {

  GatewayModel = {
    ShipmentId: '',
    ShipMasterId: '',
    ShipmentStatus: ''
  };
  private gatewayDetails = new BehaviorSubject(this.GatewayModel);
  getgatewayDetails = this.gatewayDetails.asObservable();
  constructor() { }
  gatewayDetailsDataTransfer(message: any) {
    this.gatewayDetails.next(message);
  }
}
