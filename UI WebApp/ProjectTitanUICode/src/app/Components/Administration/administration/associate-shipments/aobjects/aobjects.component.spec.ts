import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AobjectsComponent } from './aobjects.component';

describe('AobjectsComponent', () => {
  let component: AobjectsComponent;
  let fixture: ComponentFixture<AobjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AobjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AobjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
