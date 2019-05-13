import { Component, OnInit } from '@angular/core';
import { ContractService} from '../../../../Services/Blockchain Contract Services/contract.service';
import { DocHistory } from './../../../../Interfaces/DocHistory';
import * as Web3 from '../../../../../../node_modules/web3';

declare let require: any;
declare let window: any;

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {
  docHistory: DocHistory[];
  docs: DocHistory;

  shipmentByIdObject: any;
  shipment: any;
  display: boolean;
  tempShipmentDocHistory: any;
  shipmentID: string;
  displayLoader: boolean;
  displayTable: boolean;

  private _web3: any;

  constructor(
    private cs: ContractService
  ) {
    this._web3 = new Web3(window.web3.currentProvider);
    this.shipmentID = this.cs.BC_ShipmentID;
    this.displayLoader = true;
    this.displayTable = false;

  }

  ngOnInit() {
    this.getShipmentDocUploadHistory();
  }

  getShipmentDocUploadHistory() {
    this.docHistory = [];
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

        this.cs.getShipmentDocsHistory(shipmentIdParameter).then(historyResult => {
          this.tempShipmentDocHistory = historyResult;


          for (let i = 0; i < this.tempShipmentDocHistory.length; i++) {
            this.docs = {
              shipmentId: this._web3.toAscii(this.tempShipmentDocHistory[i].args.shipmentId),
              blockTimestamp: this.tempShipmentDocHistory[i].args.blockTimestamp,
              fromUser: this.tempShipmentDocHistory[i].args.fromUser,

              docName: this.tempShipmentDocHistory[i].args.docName,
              docType: this.tempShipmentDocHistory[i].args.docType,
              docRef: atob(this.tempShipmentDocHistory[i].args.docRef),

              address: this.tempShipmentDocHistory[i].address,
              blockHash: this.tempShipmentDocHistory[i].blockHash,
              blockNumber: this.tempShipmentDocHistory[i].blockNumber,
              event: this.tempShipmentDocHistory[i].event,
              logIndex: this.tempShipmentDocHistory[i].logIndex,
              removed: this.tempShipmentDocHistory[i].removed,
              transactionHash: this.tempShipmentDocHistory[i].transactionHash,
              transactionIndex: this.tempShipmentDocHistory[i].transactionIndex
            };
            this.docHistory.push(this.docs);
          }

          this.display = true;
          this.displayLoader = false;
          this.displayTable = true;

          this.docHistory.sort(this.cs.sortByTimestamp);

        });

      }
    });
  }



}
