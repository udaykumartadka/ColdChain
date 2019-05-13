import { Component, OnInit } from '@angular/core';
import { ShipmentService } from 'src/app/Services/Shipment Services/shipment.service';
import {MapbeaconService} from '../../../../Services/Shipment Services/mapbeacon.service';
import { DeviceList } from '../../../../Interfaces/DeviceList';
@Component({
  selector: 'app-admin-devices-tab',
  templateUrl: './admin-devices-tab.component.html',
  styleUrls: ['./admin-devices-tab.component.css']
})
export class AdminDevicesTabComponent implements OnInit {

  public objectList: any = [];
  public MacId: string;
  public DeviceType: string;

  DeviceList: DeviceList[] = [];
  adddeviceobject: { Mode: string; MacId: any; DeviceType: any; };
  postobject: any;
  DeviceJSONres: any;
  DeviceListobject: { id: any; MacId: any; DeviceType: any; CreatedOn: any; Status: any; };
  JSONres: any;
      constructor(private device: MapbeaconService,
        private _shipmentService: ShipmentService) { }

      ngOnInit() {this.objectList = ['Gateway', 'Tracker'];
    this.callgetfunction();
  }
  // function to get DeviceDetails
    callgetfunction() {
      this.DeviceList = [];
    this._shipmentService.GetDeviceDetails().subscribe(res => {

      this.DeviceJSONres = JSON.parse(res['_body']);

   for (let i = 0; i < this.DeviceJSONres.length; i++) {

    this.DeviceListobject = {
      id: this.DeviceJSONres[i].DeviceId,
      MacId: this.DeviceJSONres[i].MacId,
      DeviceType: this.DeviceJSONres[i].DeviceType,
      CreatedOn: this.DeviceJSONres[i].CreatedOn,
      Status: this.DeviceJSONres[i].Status
  };

   this.DeviceList.push(this.DeviceListobject);
 }

 });
      }
      remove(counter: any, id: any) {
        this._shipmentService.DeleteDevice(id).subscribe(
          response => (response),
            error => console.log(error),       // error
            () => {
            alert('Device is deleted successfully');
            this.DeviceList.splice(counter, 1);

           });


      }
      AddDevice()  {
           this.adddeviceobject = {
            Mode: 'New',
            MacId: this.MacId,
            DeviceType: this.DeviceType

          };

         this.postobject = this.adddeviceobject;
      this.device.deviceData(this.postobject).subscribe(
        response => (response),
          error => console.log(error),       // error
          () => {
          this.postobject = {};
          window.alert('Device is Onboarded');
          this.callgetfunction(); }    // complete
     );
    }
}
