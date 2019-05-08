import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions, IBox, IMarkerIconInfo, WindowRef,
  DocumentRef, MapServiceFactory,
  BingMapAPILoaderConfig, BingMapAPILoader,
  GoogleMapAPILoader,  GoogleMapAPILoaderConfig
} from 'angular-maps';

import { DashboardSummaryRoutingModule } from './dashboard-summary-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ShipmentTrackerComponent } from './shipment-tracker/shipment-tracker.component';
import { MapOverlayPopupComponent } from './map-overlay-popup/map-overlay-popup.component';
import { ShipmentOverviewLayoutComponent } from './shipment-overview-layout/shipment-overview-layout.component';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { OverlayIncidentsComponent } from './overlay-incidents/overlay-incidents.component';


// Importing Services Here
// import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';

@NgModule({
  imports: [
    CommonModule,
    DashboardSummaryRoutingModule,
    MapModule.forRoot()
  ],
  declarations: [
    DashboardLayoutComponent,
     ShipmentTrackerComponent,
     MapOverlayPopupComponent,
     ShipmentOverviewLayoutComponent,
     ShipmentListComponent,
     OverlayIncidentsComponent
    ],
    providers: [
      // ShipmentService,
      {
        provide: MapAPILoader, deps: [], useFactory: BingMapServiceProviderFactory
    }
    ],
})
export class DashboardSummaryModule { }

export function BingMapServiceProviderFactory() {
  const bc: BingMapAPILoaderConfig = new BingMapAPILoaderConfig();
  // bc.apiKey = 'Ait5cIqk1VP54uASgs8lBo5xyx3mND_ksYExmw547lKKq2RI4rCCUaHA0Ch7uBnm';
  bc.apiKey = environment.BingApiKey;
    // replace with your bing map key
    // the usage of this key outside this plunker is illegal.
  bc.branch = 'experimental';
    // to use the experimental bing brach. There are some bug fixes for
    // clustering in that branch you will need if you want to use
    // clustering.
  return new BingMapAPILoader(bc, new WindowRef(), new DocumentRef());
}
