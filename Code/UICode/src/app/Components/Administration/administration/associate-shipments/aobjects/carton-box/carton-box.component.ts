import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import * as _ from 'lodash';
import { AssociateObjectService } from 'src/app/Services/Associate Services/associate-object.service';
import { ShipmentDetailsService, ShipmentService } from 'src/app/Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-carton-box',
  templateUrl: './carton-box.component.html',
  styleUrls: ['./carton-box.component.css']
})
export class CartonBoxComponent implements OnInit {
@Input() childMessage: any;
public boxToprod = false;
public TreeResponse;
public palletTocart = false;
public displayPalletCarton = false;
public displayCartonBox = true;
public displayAssociation = false;
public CartonList;
public BoxesList;
public shipmentId;
public masterId: number;
public AssociationList = [];
public AssociationPayList = [];
public CartonId;
public toggleView = false;
public Bval = '';
public Cartval = '';
public UnlinkedBoxes ;
public UnUtilizedCartons ;
public UnlinkedProduct ;
public payload ;
  constructor(private data: DataService,
    private associateObjService: AssociateObjectService,
    private _shipmentDetailsService: ShipmentDetailsService,
    private _shipmentService: ShipmentService) {
      this.data.currentMessagePrev.subscribe(message => {
        if (message === 'carton-box') {

          this.displayCartonBox = true;
          this.displayAssociation = false;
          this.displayPalletCarton = false;
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
      this.CartonList =  data;
      this.UnUtilizedCartons = data.length;
    });
    this.associateObjService.GetObjectList('Box', this.masterId)
    .subscribe(data => {
      this.BoxesList = data;
      this.UnlinkedBoxes = data.length;
      this.data.SendUnUsedBoxes(this.UnlinkedBoxes);
    });
    this.data.getUnUsedProducts.subscribe(message => {
      this.UnlinkedProduct = message;
    });
    this._shipmentService.GetAssociationTree(this.masterId, 'Carton')
    .subscribe(data => {
      this.TreeResponse = data;
    });
   }
  ngOnInit() {
    this.GetAllObjectList();
    if (this.childMessage.indexOf('Product') !== -1) {
      this.boxToprod = true;
    }
    if ((this.childMessage.indexOf('Pallet') !== -1) && (this.childMessage.indexOf('Cartons') !== -1)) {
      this.palletTocart = true;
    }
    this.data.currentDataTransfer.subscribe(message => {
      if (message.name === 'carton-box') {
        this.childMessage = message.data;
      }
    });
    this.data.getUnUsedProducts.subscribe(message => {
      this.UnlinkedProduct = message;
    });
  }
  gotoNext() {
    if (this.childMessage.indexOf('Pallet') !== -1) {
      this.displayCartonBox = false;
      this.displayAssociation = false;
      this.displayPalletCarton = true;
    } else {
      this.displayCartonBox = false;
      this.displayAssociation = true;
      this.displayPalletCarton = false;
    }
  }
  gotoPrevious() {
      if (this.childMessage.indexOf('Product') !== -1) {
          this.data.PreviousMessage('box-product');
          this.data.DataTransfer({name: 'box-product', data: this.childMessage});
  } else {
    this.data.PreviousMessage('assoc-hierarchy');
  }
}
CartonValue($event) {
  const findBoxBeaconId = _.find(this.CartonList, ['ObjectiD', $event.target.value]);
  if (!findBoxBeaconId) {
    this.Cartval = '';
    this.CartonId = {};
    window.alert('Invalid Carton Id');
  } else {
    this.CartonId = findBoxBeaconId;
  }
}
BoxValues($event) {
  const BoxId = $event.target.value;
  const findBeaconId = (_.find(this.BoxesList, ['ObjectiD', BoxId]));
  if (!findBeaconId) {
    window.alert('Invalid Box Id');
  } else {
    const ProductPay = {
      ChildObjectBeaconId: findBeaconId.BeaconObjId.toString(),
      ChildObjectId: findBeaconId.ObjectiD,
      ChildType: 'Box'
    };
    this.AssociationPayList.push(ProductPay);
    this.AssociationList.push(findBeaconId);
    this.AssociationList = _.uniqBy(this.AssociationList, 'ObjectiD');
  }// show alert for duplicate entries
  this.Bval = '';
}
removeBox(item) {
  this.AssociationList.splice(this.AssociationList.indexOf(item), 1);
  _.remove(this.AssociationPayList, {
    ChildObjectId: item.ObjectiD
});
}
removeCart() {
  this.Cartval = '';
  this.CartonId = {};
}
AbortOperation() {
  this.AssociationList = [];
  this.AssociationPayList = [];
  this.Cartval = '';
  this.CartonId = {};
  this.toggleView = !this.toggleView;
}
Associate() {
  if ((this.CartonId) && (this.CartonId.ObjectiD !== undefined) && (this.AssociationPayList.length > 0)) {
    this.AssociationPayList = _.uniqBy(this.AssociationPayList, 'ChildObjectId'); // remove duplicate entries
    this.payload = {
      ShipMasterID: this.masterId, // check for shipment id val
      ShipmentID: this.shipmentId, // || this.shipmentId,
      ParentObjectBeaconId: this.CartonId.BeaconObjId.toString(),
      ParentObjectId: this.CartonId.ObjectiD,
      ParentType: 'Carton',
      ChildList: this.AssociationPayList
    };
    this.associateObjService.AssociateObject(this.payload)
    .subscribe(data => {
      if (data.Status === 'Success') {
        this.UnlinkedBoxes -= this.AssociationList.length;
        this.data.SendUnUsedBoxes(this.UnlinkedBoxes);
        this.AssociationPayList = [];
        this.AssociationList = [];
        this.AbortOperation();
        this.GetAllObjectList();
      }
    });
  } else {
    window.alert('Parameter missing');
  }

  // after associate successfull call api for getting lists // GetAllObjectList();
}
}
