import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page-layout',
  templateUrl: './admin-page-layout.component.html',
  styleUrls: ['./admin-page-layout.component.css']
})
export class AdminPageLayoutComponent implements OnInit {

  userRole: string;
  decryptedUserRole: string;
  viewAdmin: boolean;

  constructor(
    private _shipmentService: ShipmentService,
    private router: Router
  ) {
this.viewAdmin = false;
  }

  ngOnInit() {
 this.userRole = sessionStorage.getItem('Role');
 this.decryptedUserRole = atob(this.userRole);

 // tslint:disable-next-line:triple-equals
 if (this.decryptedUserRole != 'Administrator') {
   this.viewAdmin = false;
   this.router.navigate(['dashboard']);
 // tslint:disable-next-line:triple-equals
 } else if ( this.decryptedUserRole == 'Administrator') {
   this.viewAdmin = true;
 }

  }

}
