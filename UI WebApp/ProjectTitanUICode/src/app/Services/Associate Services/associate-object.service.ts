import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AppSetting } from '../../Configuration Files/AppSetting';
import {environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AssociateObjectService {
  constructor(private http: Http) { }

  public setRequestObject(apiUrl, payload) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers });
    const requestObj = this.http.post(apiUrl, payload, options);
    return requestObj;
  }
  public HttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
  }
  GetObjectList(type, id) {
    const constUrl = environment.API_Endpoint + '/GetObjectList?ObjectType=';
    const apiUrl = constUrl + type + '&ShipmasterId=' + id;
    return this.http.get(apiUrl)
      .pipe(map(result => result.json()));
  }

  AssociateObject(payload) {
    const apiUrl = environment.API_Endpoint + '/SaveAssociation';
    return this.setRequestObject(apiUrl, payload)
      .pipe(map((response) => response.json()));

  }
  GetUserList()  {
    const constUrl = environment.API_Endpoint + '/GetGroupUsers';
    return this.http.get(constUrl)
      .pipe(map(result => result.json()));
  }
  AddUser(payload) {
    const apiUrl = environment.API_Endpoint + '/AddUserDetails';
    return this.setRequestObject(apiUrl, payload)
    .pipe(map((response) => response.json()));

  }
  GetAllUsersInfo() {
    const constUrl = environment.API_Endpoint + '/GetUsers';
    return this.http.get(constUrl)
    .pipe(map(result => result.json()));
  }
  UpdateUserInfo(payload) {
    const apiUrl = environment.API_Endpoint + '/UpdateUserRole';
    return this.setRequestObject(apiUrl, payload)
    .pipe(map((response) => response.json()));
  }
  DeleteUser(payload) {
    const apiUrl = environment.API_Endpoint + '/DeleteUserRole';
    return this.setRequestObject(apiUrl, payload)
    .pipe(map((response) => response.json()));
  }
}

export class TreeDataService {
  public TreeDetails = new BehaviorSubject([]);
  public GetTreeDetails = this.TreeDetails.asObservable(); // for access

  constructor() { }

  public TreeDataTransfer(message: any) {
    this.TreeDetails.next(message);
  }
}
