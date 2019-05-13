import { Component, OnInit } from '@angular/core';
import { ShipmentObject } from '../../../../Interfaces/ShipmentList';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentListComponent implements OnInit {

  shipmentList: ShipmentObject[] = [];
  shipmentId: string;
  shipment: ShipmentObject;
  displayOverview;
  clicks = 0;

  // Temporary Variables
  JSONres: any;
  shipmentObject: any;

  // SHipment Variables
  ShipmasterID: number;
  ShipmentID: string;
  constructor(
     private _shipmentService: ShipmentService,
     private cs: ContractService
     ) {

  }

  ngOnInit() {
    this._shipmentService.getAllActiveShipments()
    .subscribe(res => {

      this.shipmentList = [];

      this.JSONres = JSON.parse(res['_body']);


    for (let i = 0; i < this.JSONres.length; i++) {
      this.shipmentObject = {
        AlertStatus: this.JSONres[i].AlertStatus,
        ShipmasterID: this.JSONres[i].ShipmasterID,
        ShipmentID: this.JSONres[i].ShipmentID,
        CurrentLatitude: this.JSONres[i].CurrentLatitude,
        CurrentLongitude: this.JSONres[i].CurrentLongitude
      };
      this.shipmentList.push(this.shipmentObject);
    }
    });


}

// Click Function to Set LAt Long
setLatLong(shipment_id) {
  this.cs.BC_ShipmentID = shipment_id;
  this._shipmentService.shipmentID = shipment_id;

  for (let i = 0; i < this.shipmentList.length; i++) {

    if (this.shipmentList[i].ShipmentID === shipment_id) {

      this._shipmentService.changeMessage(this.shipmentList[i]);
    }
  }
}

toggleOverview(i, shipmentID) {
  this.clicks = this.clicks + 1;
  this._shipmentService.shipmentID = shipmentID;
  if (this.clicks % 2 === 0) {
    this.displayOverview = 0;
  } else {
    this.displayOverview = i;
  }
      }

      setShipmentID(ShipmentID, shipmentMasterID) {
        this._shipmentService.shipmentID = ShipmentID;
        this._shipmentService.shipmentMasterID = shipmentMasterID;
        sessionStorage.setItem('shipID', ShipmentID);
        sessionStorage.setItem('shipMaster', shipmentMasterID);

      }
}
