import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageLayoutComponent } from './admin-page-layout.component';

describe('AdminPageLayoutComponent', () => {
  let component: AdminPageLayoutComponent;
  let fixture: ComponentFixture<AdminPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
