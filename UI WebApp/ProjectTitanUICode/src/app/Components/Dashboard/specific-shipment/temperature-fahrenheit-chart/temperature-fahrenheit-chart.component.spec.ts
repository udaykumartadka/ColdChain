import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureFahrenheitChartComponent } from './temperature-fahrenheit-chart.component';

describe('TemperatureFahrenheitChartComponent', () => {
  let component: TemperatureFahrenheitChartComponent;
  let fixture: ComponentFixture<TemperatureFahrenheitChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureFahrenheitChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureFahrenheitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
