import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDevicesTabComponent } from './admin-devices-tab.component';

describe('AdminDevicesTabComponent', () => {
  let component: AdminDevicesTabComponent;
  let fixture: ComponentFixture<AdminDevicesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDevicesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDevicesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
