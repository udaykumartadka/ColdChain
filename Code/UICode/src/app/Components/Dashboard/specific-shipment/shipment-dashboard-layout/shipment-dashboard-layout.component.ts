import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-shipment-dashboard-layout',
  templateUrl: './shipment-dashboard-layout.component.html',
  styleUrls: ['./shipment-dashboard-layout.component.css']
})
export class ShipmentDashboardLayoutComponent implements OnInit {
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
   CurrentGPSTime: any;

   // Shipment Variables Declaration ENDS here

   JSONres: any;
  message: string;
  refreshComponents = true;
  sessionShipID: string;


   constructor(
     private _shipmentService: ShipmentService
   ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
     this.shipmentID = this._shipmentService.shipmentID || this.sessionShipID ;
   }

   ngOnInit() {
     this.sessionShipID = sessionStorage.getItem('shipID');
     this._shipmentService.GetActiveShipmentDetailsObservable(this.shipmentID)
       .subscribe(res => {
        this.refreshComponents = false;
        this.JSONres = JSON.parse(res['_body']);
        this.refreshComponents = true;
        this.ShipmentID = this.JSONres.ShipmentID;
        this.ShipmentStatus = this.JSONres.ShipmentStatus;
        this.PONumber = this.JSONres.PONumber;
        this.SourceLoc = this.JSONres.SourceLoc;
        this.DestinationLoc = this.JSONres.DestinationLoc;
        this.CreatedDateTime = this.JSONres.CreatedDateTime;
        this.TemperatureBreachCount = this.JSONres.TemperatureBreachCount;
        this.HumidityBreachCount = this.JSONres.HumidityBreachCount;
        this.ShockVibrationCount = this.JSONres.ShockVibrationCount;
        this.TamperBreachCount = this.JSONres.TamperBreachCount;
        this.UnreachableDeviceCount = this.JSONres.UnreachableDeviceCount;
        this.PalletCount = this.JSONres.PalletCount;
        this.BoxCount = this.JSONres.BoxCount;
        this.CartonCount = this.JSONres.CartonCount;
        this.ProductCount = this.JSONres.ProductCount;
        this.CurrentGPSTime = this.JSONres.CurrentGPSTime;
        sessionStorage.setItem('CreatedTime', this.JSONres.CreatedDateTime);
       }

       );


       this._shipmentService.GetActiveShipmentDetails(this.shipmentID)
       .subscribe(res1 => {
        this.refreshComponents = false;
        this.JSONres = JSON.parse(res1['_body']);
        this.refreshComponents = true;
        this.TemperatureBreachCount = this.JSONres.TemperatureBreachCount;
        this.HumidityBreachCount = this.JSONres.HumidityBreachCount;
        this.ShockVibrationCount = this.JSONres.ShockVibrationCount;
        this.TamperBreachCount = this.JSONres.TamperBreachCount;
        this.UnreachableDeviceCount = this.JSONres.UnreachableDeviceCount;
        this.CurrentGPSTime = this.JSONres.CurrentGPSTime;
         }
       );
   }
}
