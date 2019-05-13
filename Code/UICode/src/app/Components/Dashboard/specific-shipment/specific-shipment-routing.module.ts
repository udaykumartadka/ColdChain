import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing Specific Shipment Modules Here
import { DevicesTabComponent } from './devices-tab/devices-tab.component';
import { IncidentsTabComponent } from './incidents-tab/incidents-tab.component';
import { ShipmentDashboardLayoutComponent } from './shipment-dashboard-layout/shipment-dashboard-layout.component';
import { StatusTabComponent } from './status-tab/status-tab.component';
import { TrackerTabComponent } from './tracker-tab/tracker-tab.component';
import { WindowTabsComponent } from './window-tabs/window-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: ShipmentDashboardLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecificShipmentRoutingModule { }
