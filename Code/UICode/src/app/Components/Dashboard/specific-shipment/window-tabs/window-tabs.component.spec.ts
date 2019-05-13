import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowTabsComponent } from './window-tabs.component';

describe('WindowTabsComponent', () => {
  let component: WindowTabsComponent;
  let fixture: ComponentFixture<WindowTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
