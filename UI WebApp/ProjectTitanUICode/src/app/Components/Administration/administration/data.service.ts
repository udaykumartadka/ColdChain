import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSourcePrev = new BehaviorSubject('default message');
  private messageSourceTransfer = new BehaviorSubject({name: 'default', data: []}); 
  private UnUsedProducts = new BehaviorSubject(0);
  private UnUsedBoxes = new BehaviorSubject(0);
  private UnUsedCartons = new BehaviorSubject(0);
  private UnUsedPallets = new BehaviorSubject(0);

  currentMessagePrev = this.messageSourcePrev.asObservable(); // var for accessing
  currentDataTransfer = this.messageSourceTransfer.asObservable();
  getUnUsedProducts = this.UnUsedProducts.asObservable();
  getUnUsedBoxes = this.UnUsedBoxes.asObservable();
  getUnUsedCartons = this.UnUsedCartons.asObservable();
  getUnUsedPallets = this.UnUsedPallets.asObservable();
  constructor() { }

  PreviousMessage(message: string) {
    this.messageSourcePrev.next(message)
  }
  DataTransfer(message:any){
    this.messageSourceTransfer.asObservable();
  }
  SendUnUsedBoxes(message: any){
    this.UnUsedBoxes.next(message);
  }
  SendUnUsedProducts(message: any){
    this.UnUsedProducts.next(message);
  }
  SendUnUsedCartons(message: any){
    this.UnUsedCartons.next(message);
  }
  SendUnUsedPallets(message: any){
    this.UnUsedPallets.next(message);
  }
}
