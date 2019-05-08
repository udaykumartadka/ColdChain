import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../../Services/Shipment Services/shipment.service';
import { Status } from '../../../../../Interfaces/statusObject';
import { FormatOption } from '../../../../../Interfaces/FormatOptions';

@Component({
  selector: 'app-stored-sensor-data-tab',
  templateUrl: './stored-sensor-data-tab.component.html',
  styleUrls: ['./stored-sensor-data-tab.component.css']
})
export class StoredSensorDataTabComponent implements OnInit {

  shipment_id: string;
  statusObject: Status;
  StatusList: Status[] = [];
  JSONres: any;
  modalBeaconId: string;
  modalObjectId: string;
  modalObjectType: string;
  viewChart: boolean;
  sessionShipID: string;
  sessionShipMaster: string;

  // Temperature Fomrat Selector Variables
  temperatureOption: FormatOption[];
  tempFormatSelected: number;
  showFahrenheitTable: boolean;
  showCelciusTable: boolean;
  displayChart: boolean;

  showTable: boolean;
  showNoData: boolean;

  shipmentMasterID: any;
  constructor(
    private _shipmentService: ShipmentService
  ) {

    this.showCelciusTable = true;
    this.showFahrenheitTable = false;

    this.temperatureOption = [
      { id: 0, format: ' Celcius' },
      { id: 1, format: 'Fahrenheit' },
    ];

    this.tempFormatSelected = 0;

    this.displayChart = false;
    this.showTable = false;
    this.showNoData = false;
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.sessionShipMaster = sessionStorage.getItem('shipMaster');
    this.shipment_id = this._shipmentService.shipmentID || this.sessionShipID;
    this.shipmentMasterID = this._shipmentService.shipmentMasterID || this.sessionShipMaster;
  }

  ngOnInit() {


    this._shipmentService.GetStoredSensorDetails(this.shipmentMasterID)
      .subscribe(res => {
        this.StatusList = [];
        this.JSONres = JSON.parse(res['_body']);

        if (this.JSONres.length === 0) {
          this.showNoData = true;
          this.showTable = false;
        } else if (this.JSONres.length !== 0) {
          this.showNoData = false;
          this.showTable = true;
        }

        for (let i = 0; i < this.JSONres.length; i++) {
          this.statusObject = {
            ObjectType: this.JSONres[i].ObjectType,
            ObjectId: this.JSONres[i].ObjectId,
            BeaconId: this.JSONres[i].BeaconId,
            BeaconStatus: this.JSONres[i].BeaconStatus,
            BeaconTimestamp: this.JSONres[i].BeaconTimestamp,
            Temperature: this.JSONres[i].Temperature,
            Humidity: this.JSONres[i].Humidity,
            TemperatureAlert: this.JSONres[i].TemperatureAlert,
            HumidityAlert: this.JSONres[i].HumidityAlert,
            TamperAlert: this.JSONres[i].TamperAlert,
            ShockVibrationAlert: this.JSONres[i].ShockVibrationAlert,
          };

          this.StatusList.push(this.statusObject);
        }
      });
  }

  setBeaconId(beaconId, objectId, objectType) {
    this.modalBeaconId = beaconId;
    this.modalObjectId = objectId;
    this.modalObjectType = objectType;
    this._shipmentService.setBeaconId(beaconId);
    this.displayChart = true;

  }


  toggleUnit(formatId) {
    // alert(formatId);

    // tslint:disable-next-line:triple-equals
    if (formatId == 0 ) {
      this.showFahrenheitTable = false;
      this.showCelciusTable = true;
    // tslint:disable-next-line:triple-equals
    } else if (formatId == 1) {
      this.showCelciusTable = false;
      this.showFahrenheitTable = true;
    }
  }


}
