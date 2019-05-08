import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredSensorHumidityGraphComponent } from './stored-sensor-humidity-graph.component';

describe('StoredSensorHumidityGraphComponent', () => {
  let component: StoredSensorHumidityGraphComponent;
  let fixture: ComponentFixture<StoredSensorHumidityGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredSensorHumidityGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredSensorHumidityGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
