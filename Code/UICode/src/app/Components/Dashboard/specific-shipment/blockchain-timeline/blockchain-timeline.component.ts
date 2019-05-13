import { Component, OnInit } from '@angular/core';
import { Shipment } from '../../../../Interfaces/shipment';
import { ShipmentHistory } from '../../../../Interfaces/shipmentHistory';
import { AlertHistory } from '../../../../Interfaces/alertHistory';
import { Products } from '../../../../Interfaces/products';
import * as Web3 from '../../../../../../node_modules/web3';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

declare let require: any;
declare let window: any;


@Component({
  selector: 'app-blockchain-timeline',
  templateUrl: './blockchain-timeline.component.html',
  styleUrls: ['./blockchain-timeline.component.css']
})
export class BlockchainTimelineComponent implements OnInit {

  shipment: Shipment;
  shipmentHistory: ShipmentHistory[];
  transactions: ShipmentHistory;
  alertHistory: AlertHistory[];
  alerts: AlertHistory;

  tempShipmentHistory: any;
  tempShipmentDetailsHistory: any;
  tempShipmentAlertsHistory: any;
  listOfProducts: Products[];
  tempProduct: any;
  sessionShipID: string;

  shipmentID: any;
  private _web3: any;
  shipmentByIdObject: any;
  detailsObject: any;
  msgTypeObject: any;
  alertsObject: any;
  display: boolean;

  public productList: any;
  public parsedProductList: any;

  constructor(
    private cs: ContractService,
    private _shipmentService: ShipmentService
  ) {
    this.sessionShipID = sessionStorage.getItem('shipID');
    this._web3 = new Web3(window.web3.currentProvider);
    this.shipmentID = this._shipmentService.shipmentID || this.sessionShipID ;
  }

  // MODAL VARIABLES HERE

  // Shipment Creation
  modalTxnHash: any;
  modalShipmentID: any;
  modalPO_Number: any;
  modalSource: any;
  modalDestination: any;
  modalTimestamp: any;

  // Alert Modal
  modalBeaconID: any;
  modalGatewayID: any;
  modalAlertType: any;
  modalAlertValue: any;
  modalAlertLocation: any;
  modalAlertStartTime: any;
  modalAlertEndTime: any;
  modalLast_GPS_Time: any;
  modalAlertSystemTime: any;
  modalObjectID: any;
  modalObjectType: any;
  modalPalletID: any;

  // INFO UPDATE MODAL
  modalShipmentInfo: any;

  // STATUS UPDATE MODAL
  modalStatus: any;

  // DOC UPDATE MODAL
  modalDoc_Type: any;
  modalDoc_Ref: any;
  modalDocName: string;


  sortByTimestamp(a, b) {
    return a.blockTimestamp - b.blockTimestamp;
  }

  ngOnInit() {
    this.shipmentHistory = [];
    let shipmentIdParameter = this.cs.convertToHex(this.shipmentID);

    this.cs.getShipmentById(shipmentIdParameter).then(res => {
      this.shipmentByIdObject = res;
      if (this.shipmentByIdObject[0] === 0x00) {
        this.shipment = null;
        alert('Shipment does not exist');
        this.display = false;
      } else {
        for (let i = (shipmentIdParameter.length - 2); i < 64; i++) {
          shipmentIdParameter += '0';
        }

        this.cs.getShipmentHistory(shipmentIdParameter).then(historyResult => {
          this.cs.getShipmentDetailsHistory(shipmentIdParameter).then(detailsHistoryResult => {
            this.tempShipmentHistory = historyResult;
            this.tempShipmentDetailsHistory = detailsHistoryResult;
            for (let i = 0; i < this.tempShipmentHistory.length; i++) {
              this.transactions = {
                messageType: this.tempShipmentHistory[i].args.messageType,
                shipmentId: this._web3.toAscii(this.tempShipmentHistory[i].args.shipmentId),
                blockTimestamp: (this.tempShipmentHistory[i].args.blockTimestamp),
                productList: this.tempShipmentHistory[i].args.productList,
                fromUser: this.tempShipmentHistory[i].args.fromUser,

                sourceLocation: this.tempShipmentDetailsHistory[i].args.sourceLocation,
                destinationLocation: this.tempShipmentDetailsHistory[i].args.destinationLocation,
                logisticsPartner: this.tempShipmentDetailsHistory[i].args.logisticsPartner,
                dateOfShipment: this._web3.toAscii(this.tempShipmentDetailsHistory[i].args.dateOfShipment),
                dateOfDelivery: this._web3.toAscii(this.tempShipmentDetailsHistory[i].args.dateOfDelivery),
                purchaseOrderNumber: this.tempShipmentDetailsHistory[i].args.purchaseOrderNumber,

                shipmentInfo: null,
                status: null,
                docName: null,
                docType: null,
                docRef: null,
                heartBeat: null,

                alertCount: null,
                alertDetails: null,

                address: this.tempShipmentHistory[i].address,
                blockHash: this.tempShipmentHistory[i].blockHash,
                blockNumber: this.tempShipmentHistory[i].blockNumber,
                event: this.tempShipmentHistory[i].event,
                logIndex: this.tempShipmentHistory[i].logIndex,
                removed: this.tempShipmentHistory[i].removed,
                transactionHash: this.tempShipmentHistory[i].transactionHash,
                transactionIndex: this.tempShipmentHistory[i].transactionIndex
              };
              this.shipmentHistory.push(this.transactions);

              this.shipmentHistory.sort((a, b) =>
              b.blockTimestamp - a.blockTimestamp
           );

            }
            this.display = true;
          });
        });

        this.cs.getMsgTypeDetailsHistory(shipmentIdParameter).then(historyResult => {
          this.tempShipmentHistory = historyResult;
          for (let i = 0; i < this.tempShipmentHistory.length; i++) {
            this.transactions = {
              messageType: this.tempShipmentHistory[i].args.messageType,
              shipmentId: this._web3.toAscii(this.tempShipmentHistory[i].args.shipmentId),
              blockTimestamp: (this.tempShipmentHistory[i].args.blockTimestamp),

              productList: null,
              fromUser: this.tempShipmentHistory[i].args.fromUser,

              sourceLocation: null,
              destinationLocation: null,
              logisticsPartner: null,
              dateOfShipment: null,
              dateOfDelivery: null,
              purchaseOrderNumber: null,

              shipmentInfo: this.tempShipmentHistory[i].args.shipmentInfo,
              status: this.tempShipmentHistory[i].args.status,
              docName: null,
              docType: null,
              docRef: null,
              heartBeat: this.tempShipmentHistory[i].args.heartBeat,

              alertCount: null,
              alertDetails: null,

              address: this.tempShipmentHistory[i].address,
              blockHash: this.tempShipmentHistory[i].blockHash,
              blockNumber: this.tempShipmentHistory[i].blockNumber,
              event: this.tempShipmentHistory[i].event,
              logIndex: this.tempShipmentHistory[i].logIndex,
              removed: this.tempShipmentHistory[i].removed,
              transactionHash: this.tempShipmentHistory[i].transactionHash,
              transactionIndex: this.tempShipmentHistory[i].transactionIndex
            };
            this.shipmentHistory.push(this.transactions);
            this.shipmentHistory.sort((a, b) =>
            b.blockTimestamp - a.blockTimestamp
         );
          }
          this.display = true;
        });
        this.cs.getShipmentDocsHistory(shipmentIdParameter).then(historyResult => {
          this.tempShipmentHistory = historyResult;
          for (let i = 0; i < this.tempShipmentHistory.length; i++) {
            this.transactions = {
              messageType: this.tempShipmentHistory[i].args.messageType,
              shipmentId: this._web3.toAscii(this.tempShipmentHistory[i].args.shipmentId),
              blockTimestamp: this.tempShipmentHistory[i].args.blockTimestamp,
              productList: null,
              fromUser: this.tempShipmentHistory[i].args.fromUser,

              sourceLocation: null,
              destinationLocation: null,
              logisticsPartner: null,
              dateOfShipment: null,
              dateOfDelivery: null,
              purchaseOrderNumber: null,

              shipmentInfo: null,
              status: null,
              docName: this.tempShipmentHistory[i].args.docName,
              docType: this.tempShipmentHistory[i].args.docType,
              docRef: this.tempShipmentHistory[i].args.docRef,
              heartBeat: null,

              alertCount: null,
              alertDetails: null,

              address: this.tempShipmentHistory[i].address,
              blockHash: this.tempShipmentHistory[i].blockHash,
              blockNumber: this.tempShipmentHistory[i].blockNumber,
              event: this.tempShipmentHistory[i].event,
              logIndex: this.tempShipmentHistory[i].logIndex,
              removed: this.tempShipmentHistory[i].removed,
              transactionHash: this.tempShipmentHistory[i].transactionHash,
              transactionIndex: this.tempShipmentHistory[i].transactionIndex
            };
            this.shipmentHistory.push(this.transactions);
            this.shipmentHistory.sort((a, b) =>
              a.blockTimestamp - b.blockTimestamp
            );
          }
          this.display = true;
        });

        this.cs.getShipmentAlertsHistory(shipmentIdParameter).then(historyResult => {
          this.tempShipmentHistory = historyResult;
          for (let i = 0; i < this.tempShipmentHistory.length; i++) {
            this.transactions = {
              messageType: this.tempShipmentHistory[i].args.messageType,
              shipmentId: this._web3.toAscii(this.tempShipmentHistory[i].args.shipmentId),

              blockTimestamp: (this.tempShipmentHistory[i].args.blockTimestamp),
              productList: null,
              fromUser: this.tempShipmentHistory[i].args.fromUser,

              sourceLocation: null,
              destinationLocation: null,
              logisticsPartner: null,
              dateOfShipment: null,
              dateOfDelivery: null,
              purchaseOrderNumber: null,

              shipmentInfo: null,
              status: null,
              docName: null,
              docType: null,
              docRef: null,
              heartBeat: null,

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
            this.shipmentHistory.push(this.transactions);
            this.shipmentHistory.sort((a, b) =>
               b.blockTimestamp - a.blockTimestamp
            );

          }
          this.display = true;
        });

      }
    });

  }

  setModalValues(txnHash, msgType) {

    const searchFilter = this.shipmentHistory.filter( (i) => i.transactionHash === txnHash);
    this.modalTxnHash = txnHash;

    if (msgType === 'Shipment Created') {

      this.modalShipmentID = searchFilter[0].shipmentId;
      this.modalPO_Number = searchFilter[0].purchaseOrderNumber;
      this.modalSource = searchFilter[0].sourceLocation;
      this.modalDestination = searchFilter[0].destinationLocation;
      this.modalTimestamp = searchFilter[0].blockTimestamp;
    } else if (msgType === 'Alert-Closed' || msgType === 'Alert-Started' ) {
      this.modalShipmentID = searchFilter[0].shipmentId;
      this.modalTimestamp = searchFilter[0].blockTimestamp;
      // tslint:disable-next-line:prefer-const
      let temp = JSON.parse(searchFilter[0].alertDetails);
      this.modalBeaconID = temp.Beacon_ID;
      this.modalGatewayID = temp.Gateway_ID;
      this.modalAlertType = temp.Alert_Type;
      this.modalAlertValue = temp.Alert_Value;
      this.modalAlertLocation = temp.Alert_Loc;
      this.modalAlertSystemTime = temp.Alert_System_Time;
      this.modalAlertStartTime = temp.Alert_Start_Time;
      this.modalAlertEndTime = temp.Alert_End_Time;
      this.modalObjectID = temp.Object_ID;
      this.modalObjectType = temp.Object_Type;
      this.modalPalletID = temp.Pallet_ID;
    } else if (msgType === 'Shipment Info Updated') {
      // Set VAriables for Shipment INFO Updated
      this.modalShipmentID = searchFilter[0].shipmentId;
      this.modalTimestamp = searchFilter[0].blockTimestamp;
      this.modalShipmentInfo = searchFilter[0].shipmentInfo;
      for (let i = 0; i < this.shipmentHistory.length; i++) {
        if (this.shipmentHistory[i].transactionHash === txnHash) {

        }
      }

    } else if (msgType === 'Shipment Status Updated') {
      // Set Variables for Status Update MODAL
      this.modalShipmentID = searchFilter[0].shipmentId;
      this.modalTimestamp = searchFilter[0].blockTimestamp;
      this.modalStatus = searchFilter[0].status;

    } else if (msgType === 'Document Upload') {
      this.modalShipmentID = searchFilter[0].shipmentId;
      this.modalTimestamp = searchFilter[0].blockTimestamp;
      this.modalDoc_Ref = searchFilter[0].docRef;
      this.modalDoc_Type = searchFilter[0].docType;
      this.modalDocName = searchFilter[0].docName;
    }

  }

}
