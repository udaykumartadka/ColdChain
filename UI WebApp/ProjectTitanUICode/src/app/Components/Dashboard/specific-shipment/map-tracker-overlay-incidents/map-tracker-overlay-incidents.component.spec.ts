import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrackerOverlayIncidentsComponent } from './map-tracker-overlay-incidents.component';

describe('MapTrackerOverlayIncidentsComponent', () => {
  let component: MapTrackerOverlayIncidentsComponent;
  let fixture: ComponentFixture<MapTrackerOverlayIncidentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTrackerOverlayIncidentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrackerOverlayIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
