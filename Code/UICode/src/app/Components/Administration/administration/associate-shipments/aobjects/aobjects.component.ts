import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-aobjects',
  templateUrl: './aobjects.component.html',
  styleUrls: ['./aobjects.component.css']
})
export class AobjectsComponent implements OnInit {
@Input() childMessage;
public palletId = -1;
public CartonId = -1;
public BoxId = -1;
  constructor() {
  }
  ngOnInit() {
    var myArr = this.childMessage;
    this.palletId = myArr.reverse().indexOf('Cartons');
    this.CartonId = myArr.indexOf('Boxes');
    this.BoxId = myArr.indexOf('Product');
}
}
