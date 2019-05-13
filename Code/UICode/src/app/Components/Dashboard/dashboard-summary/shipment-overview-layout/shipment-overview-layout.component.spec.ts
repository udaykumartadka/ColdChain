import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOverviewLayoutComponent } from './shipment-overview-layout.component';

describe('ShipmentOverviewLayoutComponent', () => {
  let component: ShipmentOverviewLayoutComponent;
  let fixture: ComponentFixture<ShipmentOverviewLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentOverviewLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentOverviewLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
