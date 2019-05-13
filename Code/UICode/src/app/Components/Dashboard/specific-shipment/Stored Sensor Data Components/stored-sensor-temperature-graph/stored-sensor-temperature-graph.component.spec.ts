import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredSensorTemperatureGraphComponent } from './stored-sensor-temperature-graph.component';

describe('StoredSensorTemperatureGraphComponent', () => {
  let component: StoredSensorTemperatureGraphComponent;
  let fixture: ComponentFixture<StoredSensorTemperatureGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredSensorTemperatureGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredSensorTemperatureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
