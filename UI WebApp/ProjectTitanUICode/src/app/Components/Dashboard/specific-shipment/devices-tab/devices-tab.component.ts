import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { DeviceStatus } from '../../../../Interfaces/DeviceStatus';

@Component({
  selector: 'app-devices-tab',
  templateUrl: './devices-tab.component.html',
  styleUrls: ['./devices-tab.component.css']
})
export class DevicesTabComponent implements OnInit {

  isConnected: boolean;
  deviceStatusObject: DeviceStatus;
  deviceStatusList: DeviceStatus [] = [];
  shipment_id: string;
  JSONres: any;
  sessionShipID: string;

    constructor(
    private _shipmentService: ShipmentService
  ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.isConnected = false;
    this.shipment_id = this._shipmentService.shipmentID || this.sessionShipID;

   }

  ngOnInit() {
  this.deviceStatusList = [];

  // calling the api to fetch details
  this._shipmentService.GetDeviceStatus(this.shipment_id)
  .subscribe(res => {


    this.JSONres = JSON.parse(res['_body']);

    for (let j = 0; j < this.JSONres.length; j++) {

      this.deviceStatusObject = {
        MacId: this.JSONres[j].MacId ,
        Type: this.JSONres[j].Type,
        Status: this.JSONres[j].Status
      };
      this.deviceStatusList.push(this.deviceStatusObject);
    }



  });
  }

}
