import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredSensorFahrenheitGraphComponent } from './stored-sensor-fahrenheit-graph.component';

describe('StoredSensorFahrenheitGraphComponent', () => {
  let component: StoredSensorFahrenheitGraphComponent;
  let fixture: ComponentFixture<StoredSensorFahrenheitGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredSensorFahrenheitGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredSensorFahrenheitGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
