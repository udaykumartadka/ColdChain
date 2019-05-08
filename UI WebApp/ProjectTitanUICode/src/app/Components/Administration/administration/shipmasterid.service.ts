import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmasteridService {
    private masterIdSource = new BehaviorSubject<number>(0);
  currentMaster = this.masterIdSource.asObservable();

  constructor() { }
  setshipmaster(shipmaster: number) {
    this.masterIdSource.next(shipmaster);
  }
}
