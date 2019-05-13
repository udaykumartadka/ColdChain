import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-map-tracker-overlay',
  templateUrl: './map-tracker-overlay.component.html',
  styleUrls: ['./map-tracker-overlay.component.css']
})
export class MapTrackerOverlayComponent implements OnInit {

  shipment_id: string;
  displayIncidents: boolean;
  sessionShipID: string;

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
    displayOverlay: boolean;

    // Shipment Variables Declaration ENDS here

    JSONres: any;
  message: string;

  constructor(
    private _shipmentService: ShipmentService,
    private cs: ContractService
  ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.shipment_id = this._shipmentService.shipmentID || this.sessionShipID;
    this.displayIncidents = false;
    this.displayOverlay = false;
  }

  ngOnInit() {
    this.displayOverlay = false;
    this._shipmentService.GetActiveShipmentDetailsObservable(this.shipment_id)
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
     this.CurrentLatitude = this.JSONres.CurrentLatitude;
     this.CurrentLongitude = this.JSONres.CurrentLongitude;

     if (this.CurrentLatitude === 0 && this.CurrentLongitude === 0) {
       this.displayOverlay = false;
     } else {
       this.displayOverlay = true;
     }
    });
}

}
