import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';
import { Incident } from '../../../Interfaces/incidents';
import * as moment from 'moment';

@Component({
  selector: 'app-shipment-report',
  templateUrl: './shipment-report.component.html',
  styleUrls: ['./shipment-report.component.css']
})
export class ShipmentReportComponent implements OnInit {

  @ViewChild('content') content: ElementRef;

  shipmentId: string;
  poNumber: string;
  createdOn: string;
  source: string;
  destination: string;
  lastKnownGPS: string;
  currentLoc: string;
  status: string;
  logisticsPartner: string;

  // Incident Counts Here
  tamperCount: number;
  temperatureCount: number;
  humidityCount: number;
  shockVibrations: number;
  unreachableDevices: number;

  reportName: string;
  sessionShipID: string;
  JSONres: any;
  displayDownloadBtn: boolean;
  temp_duration: number;
  moment_duration: any;

  // Incidents Details Related
  incidentObject: Incident;
  incidentsList: Incident[] = [];

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.shipmentId = this._shipmentService.shipmentID || this.sessionShipID;
    this.reportName = this.shipmentId + '_' + moment().format('ll');
    this.displayDownloadBtn = false;
  }

  ngOnInit() {

    this.shipmentId = this._shipmentService.shipmentID || this.sessionShipID;
    this._shipmentService.GetShipmentReport(this.shipmentId)
      .subscribe(res => {
        this.JSONres = JSON.parse(res['_body']);
        this.poNumber = this.JSONres.PONumber;
        this.source = this.JSONres.SourceLoc;
        this.destination = this.JSONres.DestinationLoc;
        this.createdOn = this.JSONres.CreatedDateTime;
        this.tamperCount = this.JSONres.TamperBreachCount;
        this.humidityCount = this.JSONres.HumidityBreachCount;
        this.temperatureCount = this.JSONres.TemperatureBreachCount;
        this.shockVibrations = this.JSONres.ShockVibrationCount;
        this.unreachableDevices = this.JSONres.UnreachableDeviceCount;
        this.lastKnownGPS = this.JSONres.CurrentGPSTime;
        this.logisticsPartner = this.JSONres.LogisticPartner;
        this.currentLoc = 'Yet to Include';
        this.status = this.JSONres.ShipmentStatus;
      });

      // making Incident List
      this._shipmentService.GetIncidentDetails(this.shipmentId)
      .subscribe(res => {
        this.JSONres = JSON.parse(res['_body']);
        for (let i = 0; i < this.JSONres.length; i++) {
          this.temp_duration = 0;
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

            AlertLoc: this.JSONres[i].AlertLocation,

            AlertDuration: this.temp_duration,

            AlertDuration_years: this.moment_duration.get('years'),

            AlertDuration_months: this.moment_duration.get('months'),

            AlertDuration_days: this.moment_duration.get('days'),

            AlertDuration_hours: this.moment_duration.get('hours'),

            AlertDuration_minutes: this.moment_duration.get('minutes'),

        };

          this.incidentsList.push(this.incidentObject);
        }
        this.displayDownloadBtn = true;

      });
  }
  public downloadPDF() {

    return xepOnline.Formatter.Format('content',
     { render: 'download',
     embedLocalImages: 'true',
    //  pageMarginRight: '5px',
    //  pageMarginLeft : '5px'
   });
  }

}
