import { Component, OnInit } from '@angular/core';
import { AlertHistory } from '../../../../Interfaces/alertHistory';
import * as Web3 from '../../../../../../node_modules/web3';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { Shipment } from '../../../../Interfaces/shipment';
import { AlertDetails } from '../../../../Interfaces/alertDetails';

declare let require: any;
declare let window: any;


@Component({
  selector: 'app-blockchain-alerts',
  templateUrl: './blockchain-alerts.component.html',
  styleUrls: ['./blockchain-alerts.component.css']
})
export class BlockchainAlertsComponent implements OnInit {
  shipment: Shipment;
  shipmentID: any;
  private _web3: any;
  alertHistory: AlertHistory[];
  alerts: AlertHistory;
  displayAlert: boolean;
  tempShipmentHistory: any;
  shipmentByIdObject: any;
  sessionShipID: string;

  // Declaring Variables for Shipment Details Object
  alertDetailObject: AlertDetails;
  alertDetails: AlertDetails[] = [];
  Beacon_ID: any;
  Gateway_ID: any;
  Alert_Type: any;
  Alert_Value: any;
  Alert_Lat: any;
  Alert_Long: any;
  Last_GPS_Time: any;
  Alert_System_Time: any;
  Object_ID: any;
  Object_Type: any;
  JSONalertDetails: any;

  constructor(
    private cs: ContractService,
    private _shipmentService: ShipmentService
  ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
    this._web3 = new Web3(window.web3.currentProvider);
    this.shipmentID = this._shipmentService.shipmentID  || this.sessionShipID;
    this.displayAlert = false;
  }

  sortByTimestamp(a, b) {
    return a.blockTimestamp - b.blockTimestamp;
  }

  ngOnInit() {
    this.alertHistory = [];
    this.displayAlert = false;
    let shipmentIdParameter = this.cs. convertToHex(this.shipmentID);

    this.cs.getShipmentById(shipmentIdParameter).then(res => {
      this.shipmentByIdObject = res;
      if (this.shipmentByIdObject[0] === 0x00) {
        this.shipment = null;
        alert('Shipment does not exist');
      } else {
        for (let i = (shipmentIdParameter.length - 2); i < 64; i++) {
          shipmentIdParameter += '0';
        }
        this.cs.getShipmentAlertsHistory(shipmentIdParameter).then(historyResult => {
          this.tempShipmentHistory = historyResult;

          for (let i = 0; i < this.tempShipmentHistory.length; i++) {
            this.alerts = {
              shipmentId: this._web3.toAscii(this.tempShipmentHistory[i].args.shipmentId),
              blockTimestamp: (this.tempShipmentHistory[i].args.blockTimestamp),
              fromUser: this.tempShipmentHistory[i].args.fromUser,
              alertCount: this.tempShipmentHistory[i].args.alertCount,
              alertDetails: this.tempShipmentHistory[i].args.alertDetails,
              address: this.tempShipmentHistory[i].address,
              blockHash: this.tempShipmentHistory[i].blockHash,
              blockNumber: this.tempShipmentHistory[i].blockNumber,
              event: this.tempShipmentHistory[i].event,
              logIndex: this.tempShipmentHistory[i].logIndex,
              removed: this.tempShipmentHistory[i].removed,
              transactionHash: this.tempShipmentHistory[i].transactionHash,
              transactionIndex: this.tempShipmentHistory[i].transactionIndex
            };
            this.alertHistory.push(this.alerts);
          }
          this.alertHistory.sort(this.sortByTimestamp);

          for (let i = 0; i < this.alertHistory.length; i++) {
            this.JSONalertDetails = {};
            this.JSONalertDetails = JSON.parse(this.alertHistory[i].alertDetails); // JSON.parse

            this.alertDetailObject = {
              Beacon_ID: this.JSONalertDetails.Beacon_ID,
              blockTimestamp: this.alertHistory[i].blockTimestamp,
              Gateway_ID: this.JSONalertDetails.Gateway_ID,
              Shipment_ID: this.JSONalertDetails.Shipment_ID,
              Pallet_ID: this.JSONalertDetails.Pallet_ID,
              Alert_Start_Time: this.JSONalertDetails.Alert_Start_Time,
              Alert_End_Time: this.JSONalertDetails.Alert_End_Time,
              Alert_Loc: this.JSONalertDetails.Alert_Loc,
              Alert_Type: this.JSONalertDetails.Alert_Type,
              Alert_Value: this.JSONalertDetails.Alert_Value,
              Alert_Lat: this.JSONalertDetails.Alert_Lat,
              Alert_Long: this.JSONalertDetails.Alert_Long,
              Object_ID: this.JSONalertDetails.Object_ID,
              Object_Type: this.JSONalertDetails.Object_Type,
            };
            this.alertDetails.push((this.alertDetailObject));
            this.alertDetails.sort((a, b) =>
            b.blockTimestamp - a.blockTimestamp
         );
          }
            this.displayAlert = true;
        });
      }
    });
  }
}
