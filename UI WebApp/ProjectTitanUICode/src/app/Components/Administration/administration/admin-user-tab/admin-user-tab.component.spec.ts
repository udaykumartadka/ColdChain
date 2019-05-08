import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserTabComponent } from './admin-user-tab.component';

describe('AdminUserTabComponent', () => {
  let component: AdminUserTabComponent;
  let fixture: ComponentFixture<AdminUserTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
