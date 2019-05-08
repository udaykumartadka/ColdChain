import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  // Dashboard Summary Row Number Variables Declared Here
  CurrentShipment: number;
  TemperatureBreachCount: number;
  ShockVibrationCount: number;
  HumidityBreachCount: number;
  TamperBreachCount: number;
  UnreachableDeviceCount: number;

  JSONres: any;

  viewDashboard: boolean;
  userRole: string;
  decryptedUserRole: string;

  constructor(
    private _shipmentService: ShipmentService,
    private router: Router
  ) {
    this.viewDashboard = false;
  }

  ngOnInit() {

    this.userRole = sessionStorage.getItem('Role');
 this.decryptedUserRole = atob(this.userRole);



 if (this.decryptedUserRole === undefined) {
   this.viewDashboard = false;
   this.router.navigate(['']);
 } else if (this.decryptedUserRole !== undefined) {
   this.viewDashboard = true;
 }

    this._shipmentService.getShipmentSummary()
    .subscribe(res => {
      this.JSONres = JSON.parse(res['_body']);
      console.log(this.JSONres);
      this.CurrentShipment = this.JSONres.CurrentShipments;
      this.TemperatureBreachCount = this.JSONres.TemperatureBreachCount;
      this.HumidityBreachCount = this.JSONres.HumidityBreachCount;
      this.ShockVibrationCount = this.JSONres.ShockVibrationCount;
      this.TamperBreachCount = this.JSONres.TamperBreachCount;
      this.UnreachableDeviceCount = this.JSONres.UnreachableDeviceCount;
    });
  }



}
