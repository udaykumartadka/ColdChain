import { Component, OnInit, Input } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.css']
})
export class AssociationComponent implements OnInit {

  @Input() shipMasterID: number;
  public TreeResponse;
  constructor(
    private _shipmentService: ShipmentService,
  ) {
    this.shipMasterID = this._shipmentService.shipmentMasterID;
    this._shipmentService.GetAssociationTree(this.shipMasterID, 'Pallet')
    // tslint:disable-next-line:no-shadowed-variable
    .subscribe(data => {
      this.TreeResponse = data;
    });
   }

  ngOnInit() {
  }

}
