import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentReportComponent } from './shipment-report.component';

describe('ShipmentReportComponent', () => {
  let component: ShipmentReportComponent;
  let fixture: ComponentFixture<ShipmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
