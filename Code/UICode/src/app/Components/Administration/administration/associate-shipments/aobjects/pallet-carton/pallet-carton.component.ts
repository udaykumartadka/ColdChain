import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import * as _ from 'lodash';
import { AssociateObjectService } from 'src/app/Services/Associate Services/associate-object.service';
import { ShipmentDetailsService, ShipmentService } from 'src/app/Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-pallet-carton',
  templateUrl: './pallet-carton.component.html',
  styleUrls: ['./pallet-carton.component.css']
})
export class PalletCartonComponent implements OnInit {
  @Input() childMessage: any;
  public boxToprod = false;
  public cartTobox = false;
  public displayPalletCarton = true;
  public displayAssociation = false;
  public CartonList;
  public PalletList;
  public shipmentId;
  public AssociationList = [];
  public PalletId;
  public PalletVal = '';
  public CartonVal = '';
  public toggleView = false;
  public masterId: number;
  public AssociationPayList = [];
  public UnUtilizedPallets = 0;
  public UnlinkedCartons;
  public UnlinkedProducts;
  public UnlinkedBoxes;
  public TreeResponse;
  public payload;
  constructor(private data: DataService,
    private associateObjService: AssociateObjectService,
    private _shipmentDetailsService: ShipmentDetailsService,
    private _shipmentService: ShipmentService) {
      this.data.currentMessagePrev.subscribe(message => {
        if (message === 'pallet-carton') {
          this.displayPalletCarton = true;
          this.displayAssociation = false;
          this.GetAllObjectList();
        }
      });
  }
  GetAllObjectList() {
    this._shipmentDetailsService.GetShipmentDetails
      .subscribe(message => {
        this.shipmentId = message.ShipmentId;
        this.masterId = Number(message.ShipMasterId);

      });
    this.associateObjService.GetObjectList('Carton', this.masterId)
      .subscribe(data => {
        this.CartonList = data;
        this.UnlinkedCartons = data.length;
        this.data.SendUnUsedCartons(this.UnlinkedCartons);
      });
    this.associateObjService.GetObjectList('Pallet', this.masterId)
      .subscribe(data => {
        this.PalletList = data;
        this.UnUtilizedPallets = data.length;
      });
    this.data.getUnUsedProducts.subscribe(message => {
      this.UnlinkedProducts = message;
    });
    this.data.getUnUsedBoxes.subscribe(message => {
      this.UnlinkedBoxes = message;
    });
    // show tree after master Id is received
    this._shipmentService.GetAssociationTree(this.masterId, 'Pallet')
      .subscribe(data => {
        this.TreeResponse = data;
      });
  }

  ngOnInit() {
    this.GetAllObjectList();
    this.data.currentDataTransfer.subscribe(message => {
      if (message.name === 'pallet-carton') {
        this.childMessage = message.data;
      }
    });
    if (this.childMessage.indexOf('Product') !== -1) {
      this.boxToprod = true;
    }
    if ((this.childMessage.indexOf('Boxes') !== -1) && (this.childMessage.indexOf('Cartons') !== -1)) {
      this.cartTobox = true;
    }
  }
  gotoNext() {
    this.displayAssociation = true;
    this.displayPalletCarton = false;
  }
  gotoPrevious() {
    if (this.childMessage.indexOf('Boxes') !== -1) {
      this.data.DataTransfer({ name: 'carton-box', data: this.childMessage });
      this.data.PreviousMessage('carton-box');
    } else if (this.childMessage.indexOf('Product') !== -1) {
      this.data.DataTransfer({ name: 'box-product', data: this.childMessage });
      this.data.PreviousMessage('box-product');
    } else {
      this.data.PreviousMessage('assoc-hierarchy');
    }
  }
  AbortOperation() {
    this.AssociationList = [];
    this.AssociationPayList = [];
    this.PalletVal = '';
    this.PalletId = {};
    this.toggleView = !this.toggleView;
  }
  PalletValue($event) {
    const findBoxBeaconId = _.find(this.PalletList, ['ObjectiD', $event.target.value]);
    if (!findBoxBeaconId) {
      this.PalletVal = '';
      this.PalletId = {};
      window.alert('Invalid Pallet Id');
    } else {
      this.PalletId = findBoxBeaconId;
    }
  }
  CartonValues($event) {
    const BoxId = $event.target.value;
    const findBeaconId = (_.find(this.CartonList, ['ObjectiD', BoxId]));
    if (!findBeaconId) {
      window.alert('Invalid Carton Id');
    } else {
      const ProductPay = {
        ChildObjectBeaconId: findBeaconId.BeaconObjId.toString(),
        ChildObjectId: findBeaconId.ObjectiD,
        ChildType: 'Carton'
      };
      this.AssociationPayList.push(ProductPay);
      this.AssociationList.push(findBeaconId);
      this.AssociationList = _.uniqBy(this.AssociationList, 'ObjectiD');
    }// show alert for duplicate entries
    this.CartonVal = '';
  }
  removeCarton(item) {
    this.AssociationList.splice(this.AssociationList.indexOf(item), 1);
    _.remove(this.AssociationPayList, {
      ChildObjectId: item.ObjectiD
  });
  }
  removePallet() {
    this.PalletVal = '';
    this.PalletId = {};
  }
  Associate() {
    if ((this.PalletId) && (this.PalletId.ObjectiD !== undefined) && (this.AssociationPayList.length > 0)) {
      this.AssociationPayList = _.uniqBy(this.AssociationPayList, 'ChildObjectId'); // remove duplicate entries
    this.payload = {
        ShipMasterID: this.masterId, // check for shipment id val
        ShipmentID: this.shipmentId,
        ParentObjectBeaconId: this.PalletId.BeaconObjId.toString(),
        ParentObjectId: this.PalletId.ObjectiD,
        ParentType: 'Pallet',
        ChildList: this.AssociationPayList
      };
      this.associateObjService.AssociateObject(this.payload)
      .subscribe(data => {

        if (data.Status === 'Success') {

          this.UnlinkedCartons -= this.AssociationList.length;
          this.data.SendUnUsedCartons(this.UnlinkedCartons);
          this.AbortOperation();
          this.GetAllObjectList();
        }
      });
    } else {
      window.alert('Parameter missing');
    }
  }

  public openModal() {
    this.toggleView = !this.toggleView;
  }

}
