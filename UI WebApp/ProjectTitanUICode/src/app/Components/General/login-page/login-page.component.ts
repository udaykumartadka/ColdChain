import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  userRole: string;

  email: string;
  token: string;
  tempRes: any;

  link = '/Administration';


  constructor(
    private router: Router,
    private adalSvc: MsAdalAngular6Service,
    private _shipmentService: ShipmentService
  ) {
    this._shipmentService.loggedIn = false;
    this.adalSvc.acquireToken('https://graph.windows.net').subscribe((token: string) => {
      this.token = token;
      this.email = this.adalSvc.userInfo.profile.email;
      this._shipmentService.email = this.email;
    });
   }

  ngOnInit() {

    if (this.token === undefined) {
      this._shipmentService.viewDashboardTab = false;
      this._shipmentService.viewAdminTab = false;
      this._shipmentService.viewLoginTab = true;

      this.router.navigate(['']);

    } else if (this.token !== '' && this.email !== '') {

      this._shipmentService.loggedIn = true;
      this._shipmentService.getUserRole(this.email).subscribe(
        res => {
        this.tempRes = JSON.parse(res['_body']);
        this.userRole = this.tempRes.Role;
        sessionStorage.setItem('Role',  btoa(this.userRole));
        this._shipmentService.setUserRole(this.userRole);

        if (this.userRole === undefined) {
          this.router.navigate(['']);

        } else if (this.userRole === 'Administrator') {
          this._shipmentService.viewAdminTab = true;
          this._shipmentService.viewDashboardTab = true;
          this._shipmentService.viewLoginTab = false;
          this.router.navigate(['Administration']);
        } else if (this.userRole !== 'Administrator') {
          this._shipmentService.viewAdminTab = false;
          this._shipmentService.viewLoginTab = false;
          this._shipmentService.viewDashboardTab = true;
          this.router.navigate(['dashboard']);
        }
      }

      );
    }
  }

  AzureLogin() {
    // tslint:disable-next-line:no-shadowed-variable
    const token = this.adalSvc.acquireToken('https://graph.windows.net').subscribe((token: string) => {
    });
  }

  navigator() {
    if (this.username === 'admin') {
      this.router.navigate(['/', 'Administration']);
    } else if (this.username === 'user') {
      this.router.navigate(['/', 'dashboard']);
    } else {
      alert('Invalid Username OR Password');
    }
  }
}
