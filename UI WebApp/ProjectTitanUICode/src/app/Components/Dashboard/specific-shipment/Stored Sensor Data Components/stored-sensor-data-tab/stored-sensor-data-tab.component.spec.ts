import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredSensorDataTabComponent } from './stored-sensor-data-tab.component';

describe('StoredSensorDataTabComponent', () => {
  let component: StoredSensorDataTabComponent;
  let fixture: ComponentFixture<StoredSensorDataTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredSensorDataTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredSensorDataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
