import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ShipmasteridService } from '../../shipmasterid.service';
import {MapbeaconService} from '../../../../../Services/Shipment Services/mapbeacon.service';
import { GatewayDetailService } from 'src/app/Services/Shipment Services/shipment.service';
import { CompleteObject } from '../../../../../Interfaces/completeobject';
import { PalletList } from '../../../../../Interfaces/PalletList';
import { DataService } from '../../data.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-agateways',
  templateUrl: './agateways.component.html',
  styleUrls: ['./agateways.component.css']
})

export class AgatewaysComponent implements OnInit {
  @Input() childMessage;
  public Gateway: string;
  public Pallet: string;
  public Tracker: string;
  public GatewaysArray: any = [];
  private newAttribute: any = {};
  public displayAssocSummary = false;
  public displayAssGateways = true;
  // public data: any;
  palletListObject: PalletList;
  palletList: PalletList[] = [];
  postcompleteobject: CompleteObject;
  shipmaster: number;
  shipmentId: string;
  shipmentstatus: string;
  constructor( private _masterService: ShipmasteridService,
    private gateway: MapbeaconService,
    private _gatewayDetailsService: GatewayDetailService,
    private data: DataService) {

   }

  ngOnInit() {
    this.getshipmaster();
  }
  getshipmaster() {
    this._masterService.currentMaster.subscribe(master => {
     this.shipmaster = master;
    //  console.log(this.shipmaster);
   }, err => {
     console.log(err);
   });
 }
  addFieldValue() {
    this.GatewaysArray.push(this.newAttribute);
    this.newAttribute = {};
    // console.log(this.newAttribute);
  }

  create() {
    for (let i = 0; i < this.GatewaysArray.length; i++) {
    // console.log(this.GatewaysArray[i]);
    // console.log(JSON.stringify(this.GatewaysArray[i]));
  }
    this._gatewayDetailsService.getgatewayDetails
    .subscribe(message => {
      this.shipmentId = String(message.ShipmentId);
      this.shipmentstatus = String(message.ShipmentStatus);
      // console.log(this.shipmentId);
      // this.masterId = message.ShipMasterId;
    });

   for (let i = 0; i < this.GatewaysArray.length; i++) {
      this.palletListObject = {
        PalletId: this.GatewaysArray[i].Pallet,
        MacId: this.GatewaysArray[i].Gateway,
        TrackerId: this.GatewaysArray[i].Tracker
     //   Content: this.GatewaysArray[i].Content,
      };
    //  console.log('Palletobject', this.palletListObject);
     this.palletList.push(this.palletListObject);
       }
    // console.log('palletList', this.palletList);
     this.postcompleteobject = {
    ShipmentID: this.shipmentId,
    ShipmasterID: this.shipmaster,
    PalletList: this.palletList
  };
  //  console.log('completeobject', this.postcompleteobject);
  //  console.log(JSON.stringify(this.postcompleteobject));
  this.gateway.gatewayData(this.postcompleteobject).subscribe(
    response => (response),
      error => {
        console.log(error);
        alert('Could not assign gateways to pallets. Please contact admin.');
        this.palletList = [];
        this.GatewaysArray.length = 0;
       },       // error
      () => {
        // console.log('completed'); // complete
      alert('Gateway is Assigned');
      this.palletList = [];
    //  this.GatewaysArray.length = 0;
      }
 );
}
 /* deleteFieldValue() {
    this.GatewaysArray.splice(index, 1);
}*/

gotoPrevious() {
  if (this.childMessage.length > 1) {
    this.data.PreviousMessage('associate-summary');
    this.data.DataTransfer({name: 'associate-summary', data: this.childMessage});
    this.displayAssocSummary = true;
    this.displayAssGateways = false;
  } else if (this.childMessage.length === 1) {
    this.data.PreviousMessage('assoc-hierarchy');
}
}
deleteFieldValue(index) {
  this.GatewaysArray.splice(index, 1);
}
}
