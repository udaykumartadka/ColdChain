import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateShipmentsComponent } from './associate-shipments.component';

describe('AssociateShipmentsComponent', () => {
  let component: AssociateShipmentsComponent;
  let fixture: ComponentFixture<AssociateShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
