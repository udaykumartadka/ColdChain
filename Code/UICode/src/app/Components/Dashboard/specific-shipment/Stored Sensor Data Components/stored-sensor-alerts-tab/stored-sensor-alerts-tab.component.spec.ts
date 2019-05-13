import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredSensorAlertsTabComponent } from './stored-sensor-alerts-tab.component';

describe('StoredSensorAlertsTabComponent', () => {
  let component: StoredSensorAlertsTabComponent;
  let fixture: ComponentFixture<StoredSensorAlertsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredSensorAlertsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredSensorAlertsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
