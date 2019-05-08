import { Component, OnInit } from '@angular/core';
import { AssociateObjectService } from 'src/app/Services/Associate Services/associate-object.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-admin-user-tab',
  templateUrl: './admin-user-tab.component.html',
  styleUrls: ['./admin-user-tab.component.css']
})
export class AdminUserTabComponent implements OnInit {
  editField: string;
  public toggleView = false;
  Roles = [
    { Name: 'Distributor' },
    { Name: 'Administrator' },
    { Name: '3PL' },
    { Name: 'General User' }
  ];
  list: any;
  personList: any;

  NewRowList: Array<any> = [
    { Username: 'name', Email: 'Email', Role: 'Select', Status: 'active', CreatedBy: 'r' },
  ];
  constructor(private _associateObjService: AssociateObjectService) { }
  ngOnInit() {
    this.GetAllUserDetails();
  }
  GetAllUserDetails() {
    this._associateObjService.GetUserList()
      .subscribe(data => {
        this.list = data;
      });
    this._associateObjService.GetAllUsersInfo()
      .subscribe(list => {
        this.personList = list;
      });
  }
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }
  updateRowList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.NewRowList[id][property] = editField;
  }

  remove(id) {
    const pay = {
      RoleId: this.personList[id].ID
    };

    this._associateObjService.DeleteUser(pay)
      .subscribe(res => {
        window.alert(res);
        this.GetAllUserDetails();
      });
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
  changeMatValue(id: number, property: string, event: any) {
    this.editField = event.value;
    if (property === 'Username') {
      const object = _.find(this.list, ['Name', this.editField]);
      this.NewRowList[id]['Email'] = object.Email;
    }
    if (property === 'Role') {
      const object = _.find(this.list, ['Name', this.editField]);
      this.NewRowList[id]['Role'] = object.Role;
    }
  }
  add() {
    this.toggleView = true;
  }
  AbortOperation() {
    this.toggleView = !this.toggleView;
    this.NewRowList = [
      { Username: 'name', Email: 'Email', Role: 'Select', Status: 'active', CreatedBy: 'r' },
    ];
  }
  SaveUser() {
    // call api and add
    const payload = this.NewRowList[0];
    this._associateObjService.AddUser(payload)
      .subscribe(res => {
        window.alert(res);
        this.GetAllUserDetails();
        this.AbortOperation();
      });
  }
  SaveChanges(id) {
    const pay = {
      RoleId: this.personList[id].ID,
      UserRole: this.personList[id].Role
    };
    this._associateObjService.UpdateUserInfo(pay)
      .subscribe(res => {
        window.alert(res);
        this.GetAllUserDetails();
      });
  }
}
