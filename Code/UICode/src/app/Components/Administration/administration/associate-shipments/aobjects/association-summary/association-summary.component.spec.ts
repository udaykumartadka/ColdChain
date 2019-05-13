import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationSummaryComponent } from './association-summary.component';

describe('AssociationSummaryComponent', () => {
  let component: AssociationSummaryComponent;
  let fixture: ComponentFixture<AssociationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
