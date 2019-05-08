import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';
import { Router } from '@angular/router';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userRole: string;
  tempRole: string;
  viewAdmin = false;
  viewSignIn = true;
  public viewdashboard = false;
  viewSignOut = false;

  sessionAdm: string;
  sessiondsb: string;

  decryptedUserRole: string;

  constructor(
    private _shipmentService: ShipmentService,
    private router: Router,
    private adalSvc: MsAdalAngular6Service,
  ) {
    this.viewdashboard = false;
    this.viewSignOut = false;
    this._shipmentService.currentUserRole
      .subscribe(role => {
        this.tempRole = role;
        this.authenticate();
      });
  }



  authenticate() {
    this.userRole = sessionStorage.getItem('Role');
    this.sessionAdm = sessionStorage.getItem('adm');

    this.decryptedUserRole = atob(this.userRole) || this.tempRole;

    // tslint:disable-next-line:triple-equals
    if (this.decryptedUserRole === 'Administrator') {
      this.viewSignIn = false;
      this.viewAdmin = true;
      this.viewdashboard = true;
      this.viewSignOut = true;

    } else if (this.decryptedUserRole === '' || this.decryptedUserRole === undefined) {
      this.viewAdmin = false;
      this.viewSignIn = true;
      this.viewdashboard = false;
      this.viewSignOut = false;
    } else if (this.decryptedUserRole !== 'Administrator') {
      this.viewSignIn = false;
      this.viewAdmin = false;
      this.viewdashboard = true;
      this.viewSignOut = true;

    }

  }
  logOut() {
    sessionStorage.clear();
    this.adalSvc.logout();
    this.viewSignOut = false;

  }
}
