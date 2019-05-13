import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShipmentsTabComponent } from './admin-shipments-tab.component';

describe('AdminShipmentsTabComponent', () => {
  let component: AdminShipmentsTabComponent;
  let fixture: ComponentFixture<AdminShipmentsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminShipmentsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminShipmentsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
