import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDashboardLayoutComponent } from './shipment-dashboard-layout.component';

describe('ShipmentDashboardLayoutComponent', () => {
  let component: ShipmentDashboardLayoutComponent;
  let fixture: ComponentFixture<ShipmentDashboardLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentDashboardLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
