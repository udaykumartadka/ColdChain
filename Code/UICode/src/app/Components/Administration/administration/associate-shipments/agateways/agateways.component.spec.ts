import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgatewaysComponent } from './agateways.component';

describe('AgatewaysComponent', () => {
  let component: AgatewaysComponent;
  let fixture: ComponentFixture<AgatewaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgatewaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgatewaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
