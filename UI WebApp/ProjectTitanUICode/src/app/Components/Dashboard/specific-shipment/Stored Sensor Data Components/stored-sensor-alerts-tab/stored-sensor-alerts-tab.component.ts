import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../../Services/Shipment Services/shipment.service';
import { Incident } from './StoredIncidents';
import { Acknowledgement } from './acknowledgeAlert';
import * as moment from 'moment';
@Component({
  selector: 'app-stored-sensor-alerts-tab',
  templateUrl: './stored-sensor-alerts-tab.component.html',
  styleUrls: ['./stored-sensor-alerts-tab.component.css']
})
export class StoredSensorAlertsTabComponent implements OnInit {


  incidentObject: Incident;
  incidentsList: Incident[] = [];
  JSONres: any;
  sessionShipID: string;

  isAcknowledged: boolean;
  shipment_id: string;

  ackPostObject: Acknowledgement;

  showTable: boolean;
  showNoData: boolean;

  temp_duration: number;
  moment_duration: any;

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
  maxTempBreach: boolean;
  maxHumBreach: boolean;
  minTempBreach: boolean;
  minHumBreach: boolean;

  modalAlertLocation: string; // <--------- HERE
  // Add Acknowledgement Modal Variables
  ackNote: string;

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this.isAcknowledged = false;
    this.showTable = false;
    this.showNoData = false;
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.shipment_id = this._shipmentService.shipmentID || this.sessionShipID;
  }

  ngOnInit() {
    this.incidentsList = [];
    this._shipmentService.GetStoredIncidentDetails(this.shipment_id)
      .subscribe(res => {
        console.log(res['_body']);
        this.JSONres = JSON.parse(res['_body']);
        // console.log(this.JSONres[0]);

        if (this.JSONres.length === 0) {
          this.showNoData = true;
          this.showTable = false;
        } else if (this.JSONres.length !== 0) {
          this.showNoData = false;
          this.showTable = true;
        }

        for (let i = 0; i < this.JSONres.length; i++) {
          this.temp_duration = Date.parse(this.JSONres[i].AlertEndtime) - Date.parse(this.JSONres[i].AlertStarttime);
          this.moment_duration = moment.duration(this.temp_duration, 'milliseconds');
          this.incidentObject = {
            // IncidentId: this.JSONres[i].IncidentId,

            BeaconID: this.JSONres[i].BeaconID,

            ObjectId: this.JSONres[i].ObjectId,

            ObjectType: this.JSONres[i].ObjectType,

            Content: this.JSONres[i].Content,

            // Temperature: this.JSONres[i].Temperature,

            // Humidity: this.JSONres[i].Humidity,

            AlertType: this.JSONres[i].AlertType,

            AlertEndtime: this.JSONres[i].AlertEndtime,

            AlertStarttime: this.JSONres[i].AlertStarttime,

            // TamperAlert: this.JSONres[i].TamperAlert,

            // ShockVibrationAlert: this.JSONres[i].ShockVibrationAlert,

            // MaxTempLimit: this.JSONres[i].MaxTempLimit,

            // MinTempLimit: this.JSONres[i].MinTempLimit,

            // MaxHumLimit: this.JSONres[i].MaxHumLimit,

            // MinHumLimit: this.JSONres[i].MinHumLimit,

            // AcknowledgeNotes: this.JSONres[i].AcknowledgeNotes,

            // User: this.JSONres[i].User,

            // Status: this.JSONres[i].Status,

            // AlertLoc: this.JSONres[i].AlertLocation, // HERE  <--------------------------

            Duration: this.JSONres[i].Duration,

            Alert_secs: this.moment_duration.get('seconds'),

            Alert_mins: this.moment_duration.get('minutes'),

            Alert_hours:  this.moment_duration.get('hours'),

            Alert_Days:  this.moment_duration.get('days'),

            Alert_months:   this.moment_duration.get('months'),
          };

          this.incidentsList.push(this.incidentObject);
        }


        console.log(this.incidentsList);
        // console.log(this.incidentsList[0].AlertLoc);
      });
  }

  //   createModal(IncidentId) {
  //     this.maxTempBreach = false;
  //     this.maxHumBreach = false;
  //     this.minHumBreach = false;
  //     this.minTempBreach = false;
  //     // console.log(BeaconID);
  //     for (let i = 0; i < this.incidentsList.length; i++) {
  //     if (this.incidentsList[i].IncidentId === IncidentId) {
  //       this.modalIncidentId = this.incidentsList[i].IncidentId;
  // this.modalBeaconID = this.incidentsList[i].BeaconID ;
  // this.modalObjectID = this.incidentsList[i].ObjectId;
  // this.modalObjectType = this.incidentsList[i].ObjectType ;
  // this.modalContent = this.incidentsList[i].Content ;
  // this.modalTemp = this.incidentsList[i].Temperature ;
  // this.modalHum = this.incidentsList[i].Humidity ;
  // this.modalAlertStartTime = this.incidentsList[i].AlertStarttime;
  // this.modalAlertEndTime = this.incidentsList[i].AlertEndtime;
  // this.modalAlertType = this.incidentsList[i].AlertType;
  // this.modalTamper = this.incidentsList[i].TamperAlert ;
  // this.modalShockVibration  = this.incidentsList[i].ShockVibrationAlert ;
  // this.modalMaxTemp = this.incidentsList[i].MaxTempLimit ;
  // this.modalMinTemp = this.incidentsList[i].MinTempLimit ;
  // this.modalMaxHum = this.incidentsList[i].MaxHumLimit ;
  // this.modalMinHum = this.incidentsList[i].MinHumLimit ;
  // this.modalStatus = this.incidentsList[i].Status ;
  // this.modalAcks = this.incidentsList[i].AcknowledgeNotes;
  // this.modalAlertDuration = this.incidentsList[i].AlertDuration;
  // this.modalAlertLocation = this.incidentsList[i].AlertLoc;

  // if (this.modalTemp > this.modalMaxTemp) {
  //   this.maxTempBreach = true;
  // } else if (this.modalTemp < this.modalMinTemp) {
  //   this.minTempBreach = true;
  // } else if (this.modalHum < this.modalMinHum) {
  //   this.minHumBreach = true;
  // } else if (this.modalHum > this.modalMaxHum) {
  //   this.maxHumBreach = true;
  // }

  // }

  //     }
  //     console.log(this.modalAlertType);
  //   }

  // setIncidentId(incidentId) {
  //   // console.log(incidentId);
  //   this.modalIncidentId = incidentId;
  //   for (let i = 0; i < this.incidentsList.length; i++) {
  //     if (this.incidentsList[i].IncidentId = incidentId) {
  //       this.modalObjectID = this.incidentsList[i].ObjectId;
  //       this.modalObjectType = this.incidentsList[i].ObjectType;
  //     }
  //   }
  // }

  // ackAlert() {

  //   this.ackPostObject = {
  //     IncidentId : this.modalIncidentId,
  //     AckNotes: this.ackNote
  //   };

  //   this._shipmentService.UpdateAcknowledgeNotes(JSON.stringify(this.ackPostObject))
  //   .subscribe(res => console.log(res));

  //   this.ngOnInit();
  // }

  // showAck(AcknowledgeNotes) {
  //   // console.log(AcknowledgeNotes);
  //   this.modalAcks = AcknowledgeNotes;
  //   // console.log(this.modalAcks);
  // }
}
