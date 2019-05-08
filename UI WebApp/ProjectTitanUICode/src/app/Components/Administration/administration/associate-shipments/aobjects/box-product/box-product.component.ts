import { Component, OnInit, Input} from '@angular/core';
import { DataService } from '../../../data.service';
import * as _ from 'lodash';
import { ShipmentDetailsService, ShipmentService } from 'src/app/Services/Shipment Services/shipment.service';
import { TreeViewParser } from 'src/app/Components/parsers/treeView.parser';

import { AssociateObjectService , TreeDataService} from 'src/app/Services/Associate Services/associate-object.service';
@Component({
  selector: 'app-box-product',
  templateUrl: './box-product.component.html',
  styleUrls: ['./box-product.component.css']
})
export class BoxProductComponent implements OnInit {
  @Input() childMessage;
  public ProductList;
  public BoxesList;
  public toggleView = false;
  public displayBoxprod = true;
  public displayCartonBox = false;
  public displayAssociation = false;
  public cartTobox = false;
  public palletTocart = false;
  public BoxId;
  public AssociationPayList = [];
  public AssociationList = [];
  public Bval = '';
  public shipmentId;
  public Pval = '';
  public aggregatePay = [];
  public flag = true;
  public masterId: number;
  public UnlinkedProduct ;
  public UnUtilizedBoxes ;
  public TreeResponse;
  public payload;
  constructor(private data: DataService,
    private associateObjService: AssociateObjectService,
    private _shipmentDetailsService: ShipmentDetailsService,
    private _shipmentService: ShipmentService,
    private _treeDataService: TreeDataService
  ) {
    this.data.currentMessagePrev.subscribe(message => {
      if (message === 'box-product') {
        this.displayBoxprod = true;
        this.displayAssociation = false;
        this.displayCartonBox = false;
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
    this.associateObjService.GetObjectList('Product', this.masterId)
    .subscribe(data => {
      this.ProductList =  data;
      this.UnlinkedProduct = data.length;
      this.data.SendUnUsedProducts(this.UnlinkedProduct);
    });
    this.associateObjService.GetObjectList('Box', this.masterId)
    .subscribe(data => {
      this.BoxesList = data;
      this.UnUtilizedBoxes = data.length;
    });
    this._shipmentService.GetAssociationTree(this.masterId, 'Box')
    .subscribe(data => {
      this.TreeResponse = data;
    });
   }
  ngOnInit() {
    this.GetAllObjectList();
    if (this.childMessage.indexOf('Cartons') !== -1) {
      this.cartTobox = true;
    }
    if (this.childMessage.indexOf('Pallet') !== -1) {
      this.palletTocart = true;
    }
    this.data.currentDataTransfer.subscribe(message => {
      if (message.name === 'box-product') {
        this.childMessage = message.data;
      }
    });
  }
  public gotoNext() {
    if (this.childMessage.indexOf('Cartons') !== -1) {
      this.displayCartonBox = true;
      this.displayAssociation = false;
      this.displayBoxprod = false;
    } else {
      this.displayCartonBox = false;
      this.displayAssociation = true;
      this.displayBoxprod = false;
    }
  }
  gotoPrevious() {
    this.data.PreviousMessage('assoc-hierarchy');
  }
  BoxValue($event) {
    const findBoxBeaconId = _.find(this.BoxesList, ['ObjectiD', $event.target.value]);
    if (!findBoxBeaconId) {
      this.Bval = '';
      this.BoxId = {};
      window.alert('Invalid Box Id');
    } else {
      this.BoxId = findBoxBeaconId;
    }
  }
  ProductValues($event) {
    const productId = $event.target.value;
    const findProductBeaconId = (_.find(this.ProductList, ['ObjectiD', productId]));
    if (!findProductBeaconId) {
      window.alert('Invalid product Id');
    } else {
      const ProductPay = {
        ChildObjectBeaconId: findProductBeaconId.BeaconObjId.toString(),
        ChildObjectId: findProductBeaconId.ObjectiD,
        ChildType: 'Product'
      };
      this.AssociationPayList.push(ProductPay);
      this.AssociationList.push(findProductBeaconId);
      this.AssociationList = _.uniqBy(this.AssociationList, 'ObjectiD');
    }// show alert for duplicate entries
    this.Pval = '';
  }
  removeProduct(item) {
    this.AssociationList.splice(this.AssociationList.indexOf(item), 1);
    _.remove(this.AssociationPayList, {
      ChildObjectId: item.ObjectiD
  });
  }
  removeBox() {
    this.Bval = '';
    this.BoxId = {};
  }
  AbortOperation() {
    this.AssociationList = [];
    this.AssociationPayList = [];
    this.Bval = '';
    this.BoxId = {};
    this.toggleView = !this.toggleView;
  }
  Associate() {

    if ((this.BoxId) && (this.BoxId.ObjectiD !== undefined) && (this.AssociationPayList.length > 0)) {
      this.AssociationPayList = _.uniqBy(this.AssociationPayList, 'ChildObjectId'); // remove duplicate entries
      this.payload = {
        ShipMasterID: this.masterId, // check for shipment id val
        ShipmentID: this.shipmentId,
        ParentObjectBeaconId: this.BoxId.BeaconObjId.toString(),
        ParentObjectId: this.BoxId.ObjectiD,
        ParentType: 'Box',
        ChildList: this.AssociationPayList
      };
      this.associateObjService.AssociateObject(this.payload)
      .subscribe(data => {
        if (data.Status === 'Success') {

          this.UnlinkedProduct -= this.AssociationList.length;
          this.data.SendUnUsedProducts(this.UnlinkedProduct);
          this.AbortOperation();
          this.GetAllObjectList();
        }
      });
    } else {
      window.alert('Parameter missing');
    }
  }

}
