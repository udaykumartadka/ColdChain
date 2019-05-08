import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentTrackerComponent } from './shipment-tracker.component';

describe('ShipmentTrackerComponent', () => {
  let component: ShipmentTrackerComponent;
  let fixture: ComponentFixture<ShipmentTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
