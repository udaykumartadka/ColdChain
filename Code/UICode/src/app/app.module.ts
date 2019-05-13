 /// <reference path="../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { APP_BASE_HREF } from '@angular/common';

import { environment } from '../environments/environment';
// tslint:disable-next-line:whitespace
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BLOB_STORAGE_TOKEN, IAzureStorage } from './Components/Administration/administration/azure-storage/azureStorage';

declare var AzureStorage: IAzureStorage;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Components/General/footer/footer.component';
import { HomeComponent } from './Components/General/home/home.component';
import { LoginPageComponent } from './Components/General/login-page/login-page.component';
import { NavbarComponent } from './Components/General/navbar/navbar.component';

// Importing Config File
import { AppSetting } from './Configuration Files/AppSetting';

// importing Services Here
import {ContractService} from './Services/Blockchain Contract Services/contract.service';
import {ShipmentService} from './Services/Shipment Services/shipment.service';
import {ShipmentDetailsService} from './Services/Shipment Services/shipment.service';
import { GatewayDetailService } from './Services/Shipment Services/shipment.service';
import {AssociateObjectService} from './Services/Associate Services/associate-object.service';
import {TreeDataService} from './Services/Associate Services/associate-object.service';
import { BlobStorageService } from '../app/Components/Administration/administration/azure-storage/blob-storage.service';
import { ShipmentReportComponent } from './Components/General/shipment-report/shipment-report.component';
// import { GatewayDetailService } from './Services/Shipment Services/shipment.service';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    LoginPageComponent,
    NavbarComponent,
    ShipmentReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MsAdalAngular6Module.forRoot({
      tenant: environment.tenant,
      clientId: environment.client_id,
      redirectUri: window.location.origin,
      navigateToLoginRequestUrl: true,
      cacheLocation: 'sessionStorage',
    })
  ],
  providers: [

    ContractService,
    ShipmentService,
    AssociateObjectService,
    ShipmentDetailsService,
    TreeDataService,
    GatewayDetailService,
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useValue: AzureStorage.Blob
    },
    AuthenticationGuard,
    {
       provide: APP_BASE_HREF,
        useValue: '/'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
