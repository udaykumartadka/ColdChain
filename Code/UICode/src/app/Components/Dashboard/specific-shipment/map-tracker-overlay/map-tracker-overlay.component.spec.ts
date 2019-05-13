import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrackerOverlayComponent } from './map-tracker-overlay.component';

describe('MapTrackerOverlayComponent', () => {
  let component: MapTrackerOverlayComponent;
  let fixture: ComponentFixture<MapTrackerOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTrackerOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrackerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
