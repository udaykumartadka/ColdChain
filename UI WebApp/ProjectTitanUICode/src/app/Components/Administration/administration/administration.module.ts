import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BLOB_STORAGE_TOKEN, IAzureStorage } from './azure-storage/azureStorage';


declare var AzureStorage: IAzureStorage;



import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminPageLayoutComponent } from './admin-page-layout/admin-page-layout.component';
import { AdminUserTabComponent } from './admin-user-tab/admin-user-tab.component';
import { AdminShipmentsTabComponent } from './admin-shipments-tab/admin-shipments-tab.component';
import { AdminDevicesTabComponent } from './admin-devices-tab/admin-devices-tab.component';
import { AssociateShipmentsComponent } from './associate-shipments/associate-shipments.component';
import { MapbeaconsComponent } from './associate-shipments/mapbeacons/mapbeacons.component';
import { AhierarchyComponent } from './associate-shipments/ahierarchy/ahierarchy.component';
import { AobjectsComponent } from './associate-shipments/aobjects/aobjects.component';
import { AgatewaysComponent } from './associate-shipments/agateways/agateways.component';
import { BoxProductComponent } from './associate-shipments/aobjects/box-product/box-product.component';
import { CartonBoxComponent } from './associate-shipments/aobjects/carton-box/carton-box.component';
import { PalletCartonComponent } from './associate-shipments/aobjects/pallet-carton/pallet-carton.component';
import { AssociationSummaryComponent } from './associate-shipments/aobjects/association-summary/association-summary.component';
import { AssociationComponent } from './association/association.component';
import { TreeViewComponent } from './associate-shipments/aobjects/box-product/tree-view/tree-view.component';

// Importing Services HERE
import { ShipmentService } from '../../../Services/Shipment Services/shipment.service';
import {TreeDataService} from '../../../Services/Associate Services/associate-object.service';
import { BlobStorageService } from './azure-storage/blob-storage.service';

import {DemoMaterialModule} from './material.module';

// data service added
import { DataService } from './data.service';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
@NgModule({
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ],
  providers: [
    DataService,
    ShipmentService,
    TreeDataService,
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useValue: AzureStorage.Blob
    }
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [TreeViewComponent, AdminPageLayoutComponent, AdminUserTabComponent, AdminShipmentsTabComponent, AdminDevicesTabComponent, AssociateShipmentsComponent, MapbeaconsComponent, AhierarchyComponent, AobjectsComponent, AgatewaysComponent, BoxProductComponent, CartonBoxComponent, PalletCartonComponent, AssociationSummaryComponent, AssociationComponent, ViewDocumentComponent, UploadDocumentComponent]
})
export class AdministrationModule { }
