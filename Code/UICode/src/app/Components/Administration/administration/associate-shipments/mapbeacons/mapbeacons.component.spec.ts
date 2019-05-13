import { async, ComponentFixture, TestBed } from ' @angular/core/testing ';

import { MapbeaconsComponent } from './mapbeacons.component';

describe('MapbeaconsComponent', () => {
  let component: MapbeaconsComponent;
  let fixture: ComponentFixture<MapbeaconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapbeaconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapbeaconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
