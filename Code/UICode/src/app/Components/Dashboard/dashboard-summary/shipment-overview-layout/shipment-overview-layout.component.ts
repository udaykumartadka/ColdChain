import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-shipment-overview-layout',
  templateUrl: './shipment-overview-layout.component.html',
  styleUrls: ['./shipment-overview-layout.component.css']
})
export class ShipmentOverviewLayoutComponent implements OnInit {
  shipmentID: string;
  // Shipment Object Variables Here
  ShipmasterID: number;
  ShipmentID: string;
  ShipmentStatus: string;
  CreatedBy: string;
  CreatedDateTime: string;
  SourceLoc: string;
  DestinationLoc: string;
  LogisticPartner: string;
  DateofShipment: string;
  DeliveryDate: string;
  InvoiceDocRef: string;
  PONumber: string;
  BlockchainStatus: string;
  TransactionHash: string;
  IsActive: boolean;
  GatewayCount: number;
  PalletCount: number;
  CartonCount: number;
  BoxCount: number;
  ProductCount: number;
  BeaconCount: number;
  TemperatureBreachCount: number;
  HumidityBreachCount: number;
  ShockVibrationCount: number;
  TamperBreachCount: number;
  UnreachableDeviceCount: number;
  CurrentLatitude: number;
  CurrentLongitude: number;


  // Shipment Variables Declaration ENDS here

  JSONres: any;
message: string;

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this.shipmentID = this._shipmentService.shipmentID;
  }

  ngOnInit() {

    this._shipmentService.GetActiveShipmentDetailsObservable(this.shipmentID)
      .subscribe(res => {

       this.JSONres = JSON.parse(res['_body']);
       this.ShipmentStatus = this.JSONres.ShipmentStatus;
       this.PONumber = this.JSONres.PONumber;
       this.SourceLoc = this.JSONres.SourceLoc;
       this.DestinationLoc = this.JSONres.DestinationLoc;
       this.CreatedDateTime = this.JSONres.CreatedDateTime;
       this.TemperatureBreachCount = this.JSONres.TemperatureBreachCount;
       this.HumidityBreachCount = this.JSONres.HumidityBreachCount;
       this.ShockVibrationCount = this.JSONres.ShockVibrationCount;
       this.TamperBreachCount = this.JSONres.TamperBreachCount;
      });
  }

}
