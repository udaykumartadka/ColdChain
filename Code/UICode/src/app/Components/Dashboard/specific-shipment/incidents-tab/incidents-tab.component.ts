import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { Incident } from '../../../../Interfaces/incidents';
import { Acknowledgement } from '../../../../Interfaces/acknowledgeAlert';
import * as moment from 'moment';


@Component({
  selector: 'app-incidents-tab',
  templateUrl: './incidents-tab.component.html',
  styleUrls: ['./incidents-tab.component.css']
})
export class IncidentsTabComponent implements OnInit {

  incidentObject: Incident;
  incidentsList: Incident[] = [];
  JSONres: any;
  sessionShipID: string;

  isAcknowledged: boolean;
  shipment_id: string;

  ackPostObject: Acknowledgement;

  // Alert Modal Variable
  modalStatus: string;
  modalMinHum: number;
  modalMaxHum: number;
  modalMinTemp: number;
  modalMaxTemp: number;
  modalShockVibration: boolean;
  modalTamper: boolean;
  modalAlertType: string;
  modalHum: number;
  modalTemp: number;
  modalContent: string;
  modalObjectType: string;
  modalObjectID: string;
  modalBeaconID: string;
  modalIncidentId: number;
  modalAcks: String;
  modalAlertStartTime: string;
  modalAlertEndTime: string;
  modalAlertDuration: number;

  modalAlertDuration_years: number;
  modalAlertDuration_months: number;
  modalAlertDuration_days: number;
  modalAlertDuration_hours: number;
  modalAlertDuration_minutes: number;

  maxTempBreach: boolean;
  maxHumBreach: boolean;
  minTempBreach: boolean;
  minHumBreach: boolean;

  modalAlertLocation: string; // <--------- HERE
  // Add Acknowledgement Modal Variables
  ackNote: string;

  temp_duration: number;
  moment_duration: any;

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this.isAcknowledged = false;
    this.sessionShipID = sessionStorage.getItem('shipID');
  this.shipment_id = this._shipmentService.shipmentID || this.sessionShipID;
  }

  ngOnInit() {
    this.incidentsList = [];
    this._shipmentService.GetIncidentDetails(this.shipment_id)
    .subscribe(res => {
       console.log(res['_body']);
      this.JSONres = JSON.parse(res['_body']);


      for (let i = 0; i < this.JSONres.length; i++) {
        this.temp_duration = 0;
        // this.temp_duration = (Date.parse(this.JSONres[i].AlertEndtime) - Date.parse(this.JSONres[i].AlertStarttime)) / 3600000;
        this.temp_duration = Date.parse(this.JSONres[i].AlertEndtime) - Date.parse(this.JSONres[i].AlertStarttime);
        this.moment_duration = moment.duration(this.temp_duration, 'milliseconds');

        this.incidentObject = {
          IncidentId: this.JSONres[i].IncidentId,

          BeaconID: this.JSONres[i].BeaconID,

          ObjectId: this.JSONres[i].ObjectId,

          ObjectType: this.JSONres[i].ObjectType,

          Content: this.JSONres[i].Content,

          Temperature: this.JSONres[i].Temperature,

          Humidity: this.JSONres[i].Humidity,

          AlertType: this.JSONres[i].AlertType,

          AlertEndtime: this.JSONres[i].AlertEndtime,

          AlertStarttime: this.JSONres[i].AlertStarttime,

          TamperAlert: this.JSONres[i].TamperAlert,

          ShockVibrationAlert: this.JSONres[i].ShockVibrationAlert,

          MaxTempLimit: this.JSONres[i].MaxTempLimit,

          MinTempLimit: this.JSONres[i].MinTempLimit,

          MaxHumLimit: this.JSONres[i].MaxHumLimit,

          MinHumLimit: this.JSONres[i].MinHumLimit,

          AcknowledgeNotes: this.JSONres[i].AcknowledgeNotes,

          User: this.JSONres[i].User,

          Status: this.JSONres[i].Status,

          AlertLoc: this.JSONres[i].AlertLocation, // HERE  <--------------------------

          AlertDuration: this.temp_duration,

          AlertDuration_years: this.moment_duration.get('years'),

          AlertDuration_months: this.moment_duration.get('months'),

          AlertDuration_days: this.moment_duration.get('days'),

          AlertDuration_hours: this.moment_duration.get('hours'),

          AlertDuration_minutes: this.moment_duration.get('minutes'),

        };

        this.incidentsList.push(this.incidentObject);
      }

      console.log(this.incidentsList);
    });
  }

  createModal(IncidentId) {
    this.maxTempBreach = false;
    this.maxHumBreach = false;
    this.minHumBreach = false;
    this.minTempBreach = false;

    const searchFilter =  this.incidentsList.filter( (i) => i.IncidentId === IncidentId);

    console.log(searchFilter);

    this.modalIncidentId = searchFilter[0].IncidentId;
    this.modalBeaconID = searchFilter[0].BeaconID ;
    this.modalObjectID = searchFilter[0].ObjectId;
    this.modalObjectType = searchFilter[0].ObjectType ;
    this.modalContent = searchFilter[0].Content ;
    this.modalTemp = searchFilter[0].Temperature ;
    this.modalHum = searchFilter[0].Humidity ;
    this.modalAlertStartTime = searchFilter[0].AlertStarttime;
    this.modalAlertEndTime = searchFilter[0].AlertEndtime;
    this.modalAlertType = searchFilter[0].AlertType;
    this.modalTamper = searchFilter[0].TamperAlert ;
    this.modalShockVibration  = searchFilter[0].ShockVibrationAlert ;
    this.modalMaxTemp = searchFilter[0].MaxTempLimit ;
    this.modalMinTemp = searchFilter[0].MinTempLimit ;
    this.modalMaxHum = searchFilter[0].MaxHumLimit ;
    this.modalMinHum = searchFilter[0].MinHumLimit ;
    this.modalStatus = searchFilter[0].Status ;
    this.modalAcks = searchFilter[0].AcknowledgeNotes;
    this.modalAlertDuration = searchFilter[0].AlertDuration;
    this.modalAlertLocation = searchFilter[0].AlertLoc;
    this.modalAlertDuration_months = searchFilter[0].AlertDuration_months;
    this.modalAlertDuration_days = searchFilter[0].AlertDuration_days;
    this.modalAlertDuration_hours = searchFilter[0].AlertDuration_hours;
    this.modalAlertDuration_minutes = searchFilter[0].AlertDuration_minutes;

    if (this.modalTemp > this.modalMaxTemp) {
      this.maxTempBreach = true;
    } else if (this.modalTemp < this.modalMinTemp) {
      this.minTempBreach = true;
    } else if (this.modalHum < this.modalMinHum) {
      this.minHumBreach = true;
    } else if (this.modalHum > this.modalMaxHum) {
      this.maxHumBreach = true;
    }
    console.log(this.modalAlertType);
  }

  setIncidentId(incidentId) {
    this.modalIncidentId = incidentId;

    const searchFilter =  this.incidentsList.filter( (i) => i.IncidentId === incidentId);
console.log(searchFilter);
this.modalObjectID = searchFilter[0].ObjectId;
this.modalObjectType = searchFilter[0].ObjectType;
  }

  ackAlert() {

    this.ackPostObject = {
      IncidentId : this.modalIncidentId,
      AckNotes: this.ackNote
    };

    this._shipmentService.UpdateAcknowledgeNotes(JSON.stringify(this.ackPostObject))
    .subscribe(res => console.log(res));

    this.ngOnInit();
  }

  showAck(AcknowledgeNotes) {
    this.modalAcks = AcknowledgeNotes;
  }
}
