import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhierarchyComponent } from './ahierarchy.component';

describe('AhierarchyComponent', () => {
  let component: AhierarchyComponent;
  let fixture: ComponentFixture<AhierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AhierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
