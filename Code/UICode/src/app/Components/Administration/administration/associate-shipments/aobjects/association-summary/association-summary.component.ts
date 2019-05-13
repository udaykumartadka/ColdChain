import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import { ShipmentService, ShipmentDetailsService } from 'src/app/Services/Shipment Services/shipment.service';
@Component({
  selector: 'app-association-summary',
  templateUrl: './association-summary.component.html',
  styleUrls: ['./association-summary.component.css']
})

export class AssociationSummaryComponent implements OnInit {
  @Input() childMessage;
  public boxToprod = false;
  public cartTobox = false;
  public palletToCart = false;
  public displayGateway = false;
  public displayAssociation = true;
  public UnlinkedCartons;
  public UnlinkedProducts;
  public UnlinkedBoxes;
  public UnlinkedPallets;
  public TreeResponse;
  public masterId: number;
  constructor(private data: DataService,
    private _shipmentService: ShipmentService,
    private _shipmentDetailsService: ShipmentDetailsService
  ) {
    // this.shipmentService.getAssociationforShipments('SH123')
    // .subscribe(data=>{
    //   this.treeResponse = data;
    //   const TreeArray = TreeViewParser(data);
    // });
    this._shipmentDetailsService.GetShipmentDetails
      .subscribe(message => {
        this.masterId = Number(message.ShipMasterId);
        this._shipmentService.GetAssociationTree(this.masterId, 'Pallet')
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe(data => {
            this.TreeResponse = data;
          });
      });
  }


  ngOnInit() {

    this.data.currentMessagePrev.subscribe(message => {
      if (message === 'associate-summary') {
        this.displayAssociation = true;
        this.displayGateway = false;
      }
    });
    this.data.currentDataTransfer.subscribe(message => {
      if (message.name === 'associate-summary') {
        this.childMessage = message.data;
      }

    });
    this.data.getUnUsedProducts.subscribe(message => {
      this.UnlinkedProducts = message;
    });
    this.data.getUnUsedBoxes.subscribe(message => {
      this.UnlinkedBoxes = message;
    });
    this.data.getUnUsedCartons.subscribe(message => {
      this.UnlinkedCartons = message;
    });
    this.data.getUnUsedPallets.subscribe(message => {
      this.UnlinkedPallets = message;
    });
    if (this.childMessage.indexOf('Product') !== -1) {
      this.boxToprod = true;
    }
    if ((this.childMessage.indexOf('Boxes') !== -1) && (this.childMessage.indexOf('Cartons') !== -1)) {
      this.cartTobox = true;
    }
    if ((this.childMessage.indexOf('Cartons') !== -1) && (this.childMessage.indexOf('Pallet') !== -1)) {
      this.palletToCart = true;
    }

  }
  gotoPrevious() {

    if (this.childMessage.indexOf('Pallet') !== -1) {
      this.data.DataTransfer({ name: 'pallet-carton', data: this.childMessage });
      this.data.PreviousMessage('pallet-carton');
    } else if (this.childMessage.indexOf('Cartons') !== -1) {

      this.data.DataTransfer({ name: 'carton-box', data: this.childMessage });
      this.data.PreviousMessage('carton-box');
    } else if (this.childMessage.indexOf('Product') !== -1) {
      this.data.DataTransfer({ name: 'box-product', data: this.childMessage });
      this.data.PreviousMessage('box-product');
    } else {
      this.data.PreviousMessage('assoc-hierarchy');
    }
  }
  gotoNext() {
    this.displayAssociation = false;
    this.displayGateway = true;
  }
}
