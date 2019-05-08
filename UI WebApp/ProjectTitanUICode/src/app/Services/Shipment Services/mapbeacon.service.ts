import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map, repeat, repeatWhen } from 'rxjs/operators';
import { AppSetting } from '../../Configuration Files/AppSetting';
import { environment } from '../../../environments/environment';

import { Data } from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapbeaconService {
 constructor(private http: Http ) {}

 // Adding Beacon Data
  addData(data: Data): Observable<any> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const options = new RequestOptions({ headers: headers });


  return this.http.post(environment.API_Endpoint + '/AddBeaconDetails', data, options)
  .pipe(map(res => {}));
}

// Updating Beacon Data
editData(data: Data): Observable<any> {
const headers = new Headers({ 'Content-Type': 'application/json' });
const options = new RequestOptions({ headers: headers });
return this.http.post(environment.API_Endpoint + '/UpdateBeaconDetails', data, options)
.pipe(map(res => {}));
}

// Adding Gateway Data
gatewayData(data: Data): Observable<any> {
const headers = new Headers({ 'Content-Type': 'application/json' });
const options = new RequestOptions({ headers: headers });
return this.http.post(environment.API_Endpoint + '/AssignPalletAndGateways', data, options)
.pipe(map(res => {}));
}

// Adding Device Data
deviceData(data: Data): Observable<any> {
const headers = new Headers({ 'Content-Type': 'application/json' });
const options = new RequestOptions({ headers: headers });
return this.http.post(environment.API_Endpoint + '/RegisterDevice', data, options)
.pipe(map(res => {}));
}
}

