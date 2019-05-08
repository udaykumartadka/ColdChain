import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

// Importing Components


import { HomeComponent } from './Components/General/home/home.component';
import { ShipmentReportComponent } from './Components/General/shipment-report/shipment-report.component';
import { LoginPageComponent } from './Components/General/login-page/login-page.component';



const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'dashboard',
    loadChildren: 'src/app/Components/Dashboard/dashboard-summary/dashboard-summary.module#DashboardSummaryModule',
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'SpecificShipment',
    loadChildren: 'src/app/Components/Dashboard/specific-shipment/specific-shipment.module#SpecificShipmentModule',
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'Administration',
    loadChildren: 'src/app/Components/Administration/administration/administration.module#AdministrationModule',
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]
  },

    {path: 'home',
     component: HomeComponent,
     pathMatch: 'full',
     canActivate: [AuthenticationGuard]},
  // {path: 'login', component: LoginPageComponent},

  {
    path: 'shipmentReport',
    component: ShipmentReportComponent,
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
