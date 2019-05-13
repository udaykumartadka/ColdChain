import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { MapbeaconService } from '../../../../../Services/Shipment Services/mapbeacon.service';
import { ShipmentService } from '../../../../..//Services/Shipment Services/shipment.service';
import { BeaconDetailsObject } from '../../../../../Interfaces/BeaconDetails';
import { ShipmasteridService } from '../../shipmasterid.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mapbeacons',
  templateUrl: './mapbeacons.component.html',
  styleUrls: ['./mapbeacons.component.css']
})
export class MapbeaconsComponent implements OnInit {
  subscription: Subscription;
  public displayMapBeacons = true;
  public displayAssoc = false;
  public message;
  public contentList: any = [];
  public JSONres: any;
  public hidden: boolean;
  public addrow: boolean;
  public viewrow: boolean;
  shipmaster: number;
  public count: number ;
  // public beaconDetailsList: BeaconDetailsObject[] = [];
  public beaconDetails: BeaconDetailsObject;
  Objects = [
    { Name: 'Pallet' },
    { Name: 'Carton' },
    { Name: 'Box' },
    { Name: 'Product' }
  ];
  options = ['Room Temperature', 'Cold Storage', 'Cool Storage'];
  optionSelected: any;
  toggledropdown: boolean;

  editField: string;
  updatevalue = {};
  beaconList: Array<any> = [];
  newBeaconList: Array<any> = [
    // tslint:disable-next-line:max-line-length
    { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '20', TemperatureMax: '30', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
  ];
  toggleView: boolean;
  postbeaconObject: any;
  beaconJSONres: any;
  editbeaconObject: {
    BeaconObjectId: any; BeaconId: any; ObjectId: any; ObjectType: any; Content: any; TemperatureMin: any; HumidityMin: any; // parseInt
    TemperatureMax: any; // parseInt
    HumidityMax: any; // parseInt
    TemperatureAlertThreshold: any; // parseInt
    HumidityAlertThreshold: any;
  };
  removeJSONres: any;
  editbeaconlist:  Array<any> = [];
  editField1: string;
  environment: any;
  constructor(private router: Router,
    private data: DataService,
    private _shipmentService: ShipmentService,
    private _masterService: ShipmasteridService,
    private mapbeacon: MapbeaconService
  ) { }

  ngOnInit() {
    this.optionSelected = 'Room Temperature';
    this.toggledropdown = false;
    this.count = 0;
    this.toggleView = false;
    this.viewrow = true;
    this.addrow = false;
    this.hidden = false;
    this.getshipmasterid();
    this.GetALLBeaconDetails();
    this.getContent();
    this.data.currentMessagePrev.subscribe(message => {
      if (message === 'map-beacons') {
        this.displayMapBeacons = true;
        this.displayAssoc = false;
      }
    });

  }
  /*calldropdown() {
    this.toggledropdown = true;
  } */
  onOptionsSelected(event) {
    // console.log(event);
    this.environment = event;
    if (this.environment === 'Room Temperature') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '20', TemperatureMax: '30', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else if (this.environment === 'Cold Storage') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '2', TemperatureMax: '8', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else if (this.environment === 'Cool Storage') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '8', TemperatureMax: '15', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '20', TemperatureMax: '30', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    }
   // this.add(this.environment);
    // option value will be sent as event
   }
  // Function to get Shipmasterid
  getshipmasterid() {
    this._masterService.currentMaster.subscribe(master => {
      this.shipmaster = master;
      // console.log(this.shipmaster);
    }, err => {
      console.log(err);
    });
  }

  // Function to get all beacon details
  GetALLBeaconDetails() {
    this.viewrow = true;
    this.addrow = false;
    this.subscription = this._shipmentService.GetBeaconDetails(this.shipmaster).subscribe(res => {
      this.beaconJSONres = JSON.parse(res['_body']);
      this.beaconList = [];
      for (let i = 0; i < this.beaconJSONres.length; i++) {

        this.beaconDetails = {
          BeaconObjectId: this.beaconJSONres[i].BeaconObjectId,
          BeaconID: this.beaconJSONres[i].BeaconID,
          ObjectId: this.beaconJSONres[i].ObjectId,
          ObjectType: this.beaconJSONres[i].ObjectType,
          TemperatureMin: this.beaconJSONres[i].TemperatureMin,
          TemperatureMax: this.beaconJSONres[i].TemperatureMax,
          HumidityMax: this.beaconJSONres[i].HumidityMax,
          HumidityMin: this.beaconJSONres[i].HumidityMin,
          Content: this.beaconJSONres[i].Content,
          TemperatureAlertThreshold: this.beaconJSONres[i].TemperatureAlertThreshold,
          HumidityAlertThreshold: this.beaconJSONres[i].HumidityAlertThreshold
        };
        this.beaconList.push(this.beaconDetails);
        // console.log('BeaconList', this.beaconList);
      }

      this.beaconJSONres = {};
    });
    // console.log('After the service call', this.beaconList);
  }
  // Function to get Content List
  getContent() {
    this._shipmentService.GetContent(this.shipmaster).subscribe(res => {

      this.JSONres = JSON.parse(res['_body']);

      for (let i = 0; i < this.JSONres.length; i++) {
        this.contentList[i] = this.JSONres[i].ProductName;
      }
      // console.log(this.contentList);
    });
  }

  updateList(id: number, property: string, event: any) {

    const editField = event.target.textContent;
    this.beaconList[id][property] = editField;
    //   this.newBeaconList[id][property] = editField;
    // console.log('UpdateBeaconList', this.beaconList);
  }
  newList(id: number, property: string, event: any) {
    const editField1 = event.target.textContent;
    this.editbeaconlist[id][property] = editField1;
    //   this.newBeaconList[id][property] = editField;
    // console.log('UpdateBeaconList', this.editbeaconlist);
  }
  remove(counter: any, id: any) {

    if (id === ' ') {
      alert('Record is not present in the data. Please save the record first.');
    } else {
    this._shipmentService.DeleteBeacon(id).subscribe(
      response => {
        console.log(response);
      },
      error => {console.log(error);

        console.log(error['_body']);
        this.removeJSONres = JSON.parse(error['_body']);
        console.log(this.removeJSONres.Message);
        if (this.removeJSONres.Message === 'Cannot delete row because of Association') {
          alert('Cannot delete this row because of Association');
        }
      },     // error
      () => {
        console.log('completed');
        alert('Beacon is deleted successfully');
        this.beaconList.splice(counter, 1);
        // console.log(this.beaconList);
      });
    }

  }
  add() {

    this.beaconList = this.beaconList.concat(this.newBeaconList);
    if (this.environment === 'Room Temperature') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '20', TemperatureMax: '30', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else if (this.environment === 'Cold Storage') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '2', TemperatureMax: '8', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else if (this.environment === 'Cool Storage') {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '8', TemperatureMax: '15', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    } else {
      this.newBeaconList = [
        // tslint:disable-next-line:max-line-length
        { BeaconObjectId: ' ', BeaconID: ' ', ObjectId: ' ', ObjectType: ' ', Content: ' ', TemperatureMin: '20', TemperatureMax: '30', HumidityMin: '30', HumidityMax: '90', TemperatureAlertThreshold: '1', HumidityAlertThreshold: '1' },
      ];
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;

  }
  editValue(id: number, property: string, event: any) {
    this.editField1 = event.target.textContent;
  }


  SavebeaconList(id) {
    if (this.beaconList[id].BeaconID === ' ' || this.beaconList[id].ObjectId === ' ' || this.beaconList[id].ObjectType === ' ' ||
    this.beaconList[id].Content === ' ') {
        alert('Cannot add null values. Please enter values.');
    } else {
      this.addbeaconList(id);
    }
  }
    addbeaconList(id) {
    if ( this.beaconList[id].BeaconObjectId === ' ' ) {
    // console.log('hi');
    // console.log(this.beaconList[id]);
    this.postbeaconObject = {
      ShipMasterId: this.shipmaster,
      BeaconId: this.beaconList[id].BeaconID,
      ObjectId: this.beaconList[id].ObjectId,
      ObjectType: this.beaconList[id].ObjectType,
      Content: this.beaconList[id].Content,
      TemperatureMin: this.beaconList[id].TemperatureMin,
      HumidityMin: (this.beaconList[id].HumidityMin), // parseInt
      TemperatureMax: (this.beaconList[id].TemperatureMax), // parseInt
      HumidityMax: (this.beaconList[id].HumidityMax), // parseInt
      TemperatureAlertThreshold: (this.beaconList[id].TemperatureAlertThreshold),  // parseInt
      HumidityAlertThreshold: (this.beaconList[id].HumidityAlertThreshold)
    }; // parseInt
    // console.log(this.postbeaconObject);
    // call api and add
    this.mapbeacon.addData(this.postbeaconObject).subscribe(
      response => console.log(response),
      error => { // error
        // tslint:disable-next-line:prefer-const
        let JSONreply = JSON.parse(error._body);
        alert(JSONreply.Message);
      },
      () => {
        console.log('completed');
        window.alert('Row is inserted');


      }
    );
    } else {
      alert('Record is already present in the data. Try adding new record');
    }

  }
  refresh() {
    this.GetALLBeaconDetails();
  }
  editrecord(id) {
    if ( this.beaconList[id].BeaconObjectId !== ' ' ) {
    this.editbeaconlist = [];
    this.toggleView = true;
    // console.log('hi edit');
    this.toggleView = true;
    this.editbeaconObject = {
      BeaconObjectId: this.beaconList[id].BeaconObjectId,
      BeaconId: this.beaconList[id].BeaconID,
      ObjectId: this.beaconList[id].ObjectId,
      ObjectType: this.beaconList[id].ObjectType,
      Content: this.beaconList[id].Content,
      TemperatureMin: this.beaconList[id].TemperatureMin,
      HumidityMin: (this.beaconList[id].HumidityMin), // parseInt
      TemperatureMax: (this.beaconList[id].TemperatureMax), // parseInt
      HumidityMax: (this.beaconList[id].HumidityMax), // parseInt
      TemperatureAlertThreshold: (this.beaconList[id].TemperatureAlertThreshold),  // parseInt
      HumidityAlertThreshold: (this.beaconList[id].HumidityAlertThreshold)
    }; // parseInt
    // console.log(this.editbeaconObject);
    this.editbeaconlist.push(this.editbeaconObject);
    // console.log('editbeaconList', this.editbeaconlist);
  } else {
    alert('Record is not present in the data. Please save the record first');
  }
}

    UpdateRecord() {
    // call api and update
    this.updatevalue = JSON.stringify(this.editbeaconlist[0]);
    console.log(this.updatevalue);
    this.mapbeacon.editData(this.updatevalue).subscribe(
      response => console.log(response),
      error => console.log(error),       // error
      () => {
        console.log('completed');
        window.alert('Record has been updated');
      this.GetALLBeaconDetails();
      this.AbortOperation();
        // this.postbeaconObject = {};

      }
    );
    }
  gotoNext() {
    this.displayMapBeacons = false;
    this.displayAssoc = true;
  }
  AbortOperation() {
    this.toggleView = !this.toggleView;
  }
}
