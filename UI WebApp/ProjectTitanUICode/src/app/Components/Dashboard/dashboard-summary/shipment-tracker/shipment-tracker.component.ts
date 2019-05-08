import { Component, OnInit } from '@angular/core';
import {
  MarkerTypeId,
  IMapOptions,
  IBox,
  IMarkerIconInfo,
  ILatLong
} from 'angular-maps';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
import { ShipmentObject } from '../../../../Interfaces/ShipmentTrackerList';
import { reserveSlots } from '@angular/core/src/render3/instructions';


@Component({
  selector: 'app-shipment-tracker',
  templateUrl: './shipment-tracker.component.html',
  styleUrls: ['./shipment-tracker.component.css']
})
export class ShipmentTrackerComponent implements OnInit {
  JSONres: any;
  shipmentList: ShipmentObject[] = [];
  shipmentObject: any;

  // tslint:disable-next-line:member-ordering
  displayMap: boolean;

  avgNumericLat: number;
  avgNumericLong: number;

  SumLat: number;
  sumLong: number;
  // Declaring Array
  // tslint:disable-next-line:member-ordering
  _markers: Array<ILatLong> = new Array<ILatLong>();
  _options: IMapOptions;
  _box: IBox;
  _iconInfo: IMarkerIconInfo;
  _markerTypeId = MarkerTypeId;

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this._shipmentService.currentMessage.subscribe(res => res);

    this.SumLat = 0;
    this.sumLong = 0;
    this.displayMap = false;
  }

  ngOnInit() {
    this.SumLat = 0;
    this.sumLong = 0;

    // SInGLE or MULTIPLE Check
    this._shipmentService.currentMessage.subscribe(res => {

      if (res === undefined) {
        // Forming List of Lat Longs
        this._shipmentService.getAllActiveShipments()
          .subscribe(res1 => {

            this.JSONres = JSON.parse(res1['_body']);


            for (let i = 0; i < this.JSONres.length; i++) {
              this.shipmentObject = {
                ShipmasterID: this.JSONres[i].ShipmasterID,
                ShipmentID: this.JSONres[i].ShipmentID,
                CurrentLatitude: this.JSONres[i].CurrentLatitude,
                CurrentLongitude: this.JSONres[i].CurrentLongitude
              };
              this.shipmentList.push(this.shipmentObject);

            }
            this.mapFunction(this.shipmentList);
          });
      } else {

        this.mapFunction([res]);
      }
    });

  }

  mapFunction(latLongList) {
    this.SumLat = 0;
    this.sumLong = 0;
    this._markers = [];
    for (let i = 0; i < latLongList.length; i++) {
      this._markers.push({ latitude: latLongList[i].CurrentLatitude, longitude: latLongList[i].CurrentLongitude });
      this.SumLat = this.SumLat + latLongList[i].CurrentLatitude;
      this.sumLong = this.sumLong + latLongList[i].CurrentLongitude;
    }

    this.avgNumericLat = (this.SumLat) / latLongList.length;
    this.avgNumericLong = (this.sumLong) / latLongList.length;

    this._options = {
      disableBirdseye: true,
      disableStreetside: true,
      navigationBarMode: 1,
      zoom: 2,
    };

    this._box = {
      maxLatitude: this.avgNumericLat + 25,
      maxLongitude: this.avgNumericLong + 25,
      minLatitude: this.avgNumericLat - 25,
      minLongitude: this.avgNumericLong - 25

    };


    this._iconInfo = {
      markerType: MarkerTypeId.ScaledImageMarker,
      url: '../../../../../assets/icons/placeholder (1).svg',
      scale: 0.18,
      markerOffsetRatio: { x: 0.5, y: 1 }
    };
    this.displayMap = true;
  }

}
