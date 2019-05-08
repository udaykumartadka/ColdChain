import { Component, OnInit } from '@angular/core';
import { MapModule, MapAPILoader, MarkerTypeId, IMapOptions, IBox, IMarkerIconInfo, WindowRef,
  DocumentRef, MapServiceFactory,
  BingMapAPILoaderConfig, BingMapAPILoader,
  GoogleMapAPILoader,  GoogleMapAPILoaderConfig, ILatLong} from 'angular-maps';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';

@Component({
  selector: 'app-tracker-tab',
  templateUrl: './tracker-tab.component.html',
  styleUrls: ['./tracker-tab.component.css']
})
export class TrackerTabComponent implements OnInit {

  public lat ; //  = '40.7128'
  public long ; // = '-74.00607'

  shipment_id: string;
  JSONres: any;
  displaymap: boolean;
  sessionShipID: string;

  _options: IMapOptions;
   _box: IBox;
   _iconInfo: IMarkerIconInfo;


  numericLat: number ;
  numericLong: number ;

  _markerTypeId = MarkerTypeId;

  constructor(
    private _shipmentService: ShipmentService
  ) {
    this.displaymap = false;
    this.sessionShipID = sessionStorage.getItem('shipID');
    this.shipment_id = this._shipmentService.shipmentID  || this.sessionShipID;

   }

  ngOnInit() {


    // Calling API to fetch Shipment Details => to get Current Lat Long
    this._shipmentService.GetActiveShipmentDetails(this.shipment_id)
    .subscribe(res => {
      this.JSONres = JSON.parse(res['_body']);
      this.numericLat = this.JSONres.CurrentLatitude;
      this.numericLong = this.JSONres.CurrentLongitude;

      // Converting DataType of Lat and Long to String Here
      this.lat = this.numericLat.toString();
      this.long = this.numericLong.toString();

      // Bing Maps Thingy

      this._options = {
        disableBirdseye: true,
        disableStreetside: true,
        navigationBarMode: 1,
        zoom: 2,
      };

      this._box = {
        maxLatitude: this.numericLat + 7,
       maxLongitude: this.numericLong + 7,
       minLatitude: this.numericLat - 7,
       minLongitude: this.numericLong - 7
     };

     this._iconInfo = {
      markerType: MarkerTypeId.ScaledImageMarker,
      url: '../../../../../assets/icons/placeholder (1).svg',
      scale: 0.18,
      markerOffsetRatio: { x: 0.5, y: 1 }
    };

    this.displaymap = true;

    });
  }

}
