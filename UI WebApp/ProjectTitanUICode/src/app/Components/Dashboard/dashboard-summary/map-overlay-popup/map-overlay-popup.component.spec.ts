import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOverlayPopupComponent } from './map-overlay-popup.component';

describe('MapOverlayPopupComponent', () => {
  let component: MapOverlayPopupComponent;
  let fixture: ComponentFixture<MapOverlayPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOverlayPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOverlayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
