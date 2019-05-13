import { Component, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
@Component({
  selector: 'app-ahierarchy',
  templateUrl: './ahierarchy.component.html',
  styleUrls: ['./ahierarchy.component.css']
})
export class AhierarchyComponent implements OnInit {
  public myList;
  public FlowArray = [];
  public displayAhier = true;
  public boxToprod = false;
  public cartTobox = false;
  public palletTocart = false;
  public palletId = -1;
  public CartonId = -1;
  public BoxId = -1;
  public Aobjects = false;
  public agateways = false;
  public list: string[] = [
    'Pallet',
    'Cartons',
    'Boxes',
    'Product',
  ];

  constructor(private router: Router,
    private data: DataService) {
  }
  public ngOnInit() {
    this.data.currentMessagePrev.subscribe(message => {
      if (message === 'assoc-hierarchy') {
        this.displayAhier = true;
        this.palletId = -1;
        this.CartonId = -1;
        this.BoxId = -1;
        this.FlowArray = [];
        this.agateways = false;
      }
    });
  }
  DropOnFlow(event) {
    const data = event.dataTransfer.getData('text');
    const length = this.FlowArray.length;
    if (this.FlowArray.length > 0 && data !== '') {
      const diff = this.list.indexOf(data) - this.list.indexOf(this.FlowArray[length - 1]);
      if (diff === 1) {
        this.FlowArray.push(data);
      }
    } else if (this.FlowArray.length === 0 && data !== '') {
      this.FlowArray.push(data);
    }
  }
  allowDrop(event) {
    event.preventDefault();
  }
  dragFromList(event) {
    event.dataTransfer.setData('text', event.target.textContent);
  }
  removeTree(item) {
    const span = this.FlowArray.length - this.FlowArray.indexOf(item);
    this.FlowArray.splice(this.FlowArray.indexOf(item), span);  // remove from current child till end
  }
  gotoNext() {
    if (this.FlowArray.length > 1) {
    this.displayAhier = false;
    this.Aobjects = true;
      var myArr = this.FlowArray;
      this.palletId = myArr.reverse().indexOf('Cartons');
      this.CartonId = myArr.indexOf('Boxes');
      this.BoxId = myArr.indexOf('Product');
    } else if ((this.FlowArray.length === 1) && (this.FlowArray.indexOf('Pallet') !== -1)) {
      this.agateways = true;
      this.displayAhier = false;
    }
  }

  gotoPrevious() {
    this.data.PreviousMessage('map-beacons');
  }
}
