import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions, IBox, IMarkerIconInfo, WindowRef,
  DocumentRef, MapServiceFactory,
  BingMapAPILoaderConfig, BingMapAPILoader,
  GoogleMapAPILoader,  GoogleMapAPILoaderConfig
} from 'angular-maps';

import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';

import { environment } from '../../../../environments/environment';

import { SpecificShipmentRoutingModule } from './specific-shipment-routing.module';
import { DevicesTabComponent } from './devices-tab/devices-tab.component';
import { IncidentsTabComponent } from './incidents-tab/incidents-tab.component';
import { ShipmentDashboardLayoutComponent } from './shipment-dashboard-layout/shipment-dashboard-layout.component';
import { StatusTabComponent } from './status-tab/status-tab.component';
import { TrackerTabComponent } from './tracker-tab/tracker-tab.component';
import { WindowTabsComponent } from './window-tabs/window-tabs.component';
import { MapTrackerOverlayComponent } from './map-tracker-overlay/map-tracker-overlay.component';
import { MapTrackerOverlayIncidentsComponent } from './map-tracker-overlay-incidents/map-tracker-overlay-incidents.component';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component';
import { HumidityChartComponent } from './humidity-chart/humidity-chart.component';
import { BlockchainTimelineComponent } from './blockchain-timeline/blockchain-timeline.component';
import { BlockchainAlertsComponent } from './blockchain-alerts/blockchain-alerts.component';
import { StoredSensorDataTabComponent } from './Stored Sensor Data Components/stored-sensor-data-tab/stored-sensor-data-tab.component';
// tslint:disable-next-line:max-line-length
import { StoredSensorAlertsTabComponent } from './Stored Sensor Data Components/stored-sensor-alerts-tab/stored-sensor-alerts-tab.component';
// tslint:disable-next-line:max-line-length
import { StoredSensorHumidityGraphComponent } from './Stored Sensor Data Components/stored-sensor-humidity-graph/stored-sensor-humidity-graph.component';
// tslint:disable-next-line:max-line-length
import { StoredSensorTemperatureGraphComponent } from './Stored Sensor Data Components/stored-sensor-temperature-graph/stored-sensor-temperature-graph.component';

// import Services here
// import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';

import { TemperatureConverterPipe } from './status-tab/temperature-converter.pipe';
import { TemperatureFahrenheitChartComponent } from './temperature-fahrenheit-chart/temperature-fahrenheit-chart.component';
import { StoredSensorFahrenheitGraphComponent } from './Stored Sensor Data Components/stored-sensor-fahrenheit-graph/stored-sensor-fahrenheit-graph.component';

@NgModule({
  imports: [
    CommonModule,
    SpecificShipmentRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MapModule.forRoot()
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [
    TemperatureConverterPipe,
    DevicesTabComponent,
    IncidentsTabComponent,
    ShipmentDashboardLayoutComponent,
    StatusTabComponent,
    TrackerTabComponent,
    WindowTabsComponent,
    MapTrackerOverlayComponent,
    MapTrackerOverlayIncidentsComponent,
    TemperatureChartComponent,
    HumidityChartComponent,
    BlockchainTimelineComponent,
    BlockchainAlertsComponent,
    StoredSensorDataTabComponent,
    StoredSensorAlertsTabComponent,
    StoredSensorHumidityGraphComponent,
    StoredSensorTemperatureGraphComponent,
    TemperatureFahrenheitChartComponent,
    StoredSensorFahrenheitGraphComponent],
    providers: [
      // ShipmentService,
      {
        provide: MapAPILoader, deps: [], useFactory: BingMapServiceProviderFactory
    }
    ],
})
export class SpecificShipmentModule { }

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
