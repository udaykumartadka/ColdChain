import { Component, Input } from '@angular/core';
import { TreeControl, NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';

import { of } from 'rxjs';
interface TestData {
  ObjectId: string;
  Level: number;
  ParentID: number;
  Type: string;
  ID: string;
  Children?: TestData[];
}

// const GetLevel = (node: TestData) => node.level;
// const IsExpandable = (node: TestData) => node.Children && node.Children.length > 0;
const GetChildren = (node: TestData) => of(node.Children);
// const TC = new FlatTreeControl(GetLevel, IsExpandable);
const TC = new NestedTreeControl(GetChildren);

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {
  @Input() TreeResponse;
  tc = TC;
  public dataTree;
  constructor() {

  }
//   data = [
//     {
//       name: 'a',
//       Children: [
//         { name: 'g' },
//         {
//           name: 'b',
//           Children: [
//             { name: 'e' },
//             { name: 'f' }
//           ]
//         },
//         {
//           name: 'c',
//           Children: [
//             { name: 'd' }
//           ]
//         }
//       ]
//     }];
// // data=this.dataTree;
  hasChild(_: number, node: TestData) {
    return node.Children != null && node.Children.length > 0;
  }
}
