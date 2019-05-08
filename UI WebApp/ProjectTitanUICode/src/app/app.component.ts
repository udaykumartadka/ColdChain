import { Component } from '@angular/core';
import {ShipmentService} from './Services/Shipment Services/shipment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userRole: String;
  constructor(
    // private router: Router,
    // private _shipmentService: ShipmentService
  ) {
    // this.router.navigate(['login']);

  }
}
