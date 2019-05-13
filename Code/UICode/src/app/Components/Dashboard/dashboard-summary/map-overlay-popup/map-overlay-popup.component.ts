import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-map-overlay-popup',
  templateUrl: './map-overlay-popup.component.html',
  styleUrls: ['./map-overlay-popup.component.css']
})
export class MapOverlayPopupComponent implements OnInit {
  shipment_id: string;
  displayIncidents: boolean;

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
  displayOverlay: boolean;

  displayAlerts: boolean;
  displayNoAlerts: boolean;
  displayLoader: boolean;
  checkCondition: string;

  constructor(
    private _shipmentService: ShipmentService,
    private cs: ContractService
  ) {
    this.displayAlerts = false;
    this.displayLoader = true;
    this.displayNoAlerts = false;
    this.shipment_id = this.cs.BC_ShipmentID;

    this.displayIncidents = false;

    this._shipmentService.getIncidentList.subscribe(
      res => {
        this.checkCondition = res;
        if (this.checkCondition === 'true') {

          this.displayAlerts = true;
          this.displayLoader = false;
          this.displayNoAlerts = false;
        } else if (this.checkCondition === 'false') {

          this.displayAlerts = false;
          this.displayNoAlerts = true;
          this.displayLoader = false;
        }
      }
    );
  }

  ngOnInit() {

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


