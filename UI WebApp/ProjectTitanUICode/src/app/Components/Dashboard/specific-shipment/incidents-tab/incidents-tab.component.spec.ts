import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsTabComponent } from './incidents-tab.component';

describe('IncidentsTabComponent', () => {
  let component: IncidentsTabComponent;
  let fixture: ComponentFixture<IncidentsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
