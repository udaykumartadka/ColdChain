import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonBoxComponent } from './carton-box.component';

describe('CartonBoxComponent', () => {
  let component: CartonBoxComponent;
  let fixture: ComponentFixture<CartonBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartonBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartonBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
