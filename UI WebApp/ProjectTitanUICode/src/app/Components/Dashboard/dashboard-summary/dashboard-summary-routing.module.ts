import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing Dashboard Modules Here
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSummaryRoutingModule { }
