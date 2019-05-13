import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayIncidentsComponent } from './overlay-incidents.component';

describe('OverlayIncidentsComponent', () => {
  let component: OverlayIncidentsComponent;
  let fixture: ComponentFixture<OverlayIncidentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayIncidentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
