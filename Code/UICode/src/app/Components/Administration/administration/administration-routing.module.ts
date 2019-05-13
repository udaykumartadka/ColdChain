import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageLayoutComponent } from './admin-page-layout/admin-page-layout.component';


// Importing Admin Modules Here

const routes: Routes = [
  {
    path: '',
    component: AdminPageLayoutComponent
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
