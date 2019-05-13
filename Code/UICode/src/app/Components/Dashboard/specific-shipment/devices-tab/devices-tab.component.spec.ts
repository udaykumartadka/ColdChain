import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesTabComponent } from './devices-tab.component';

describe('DevicesTabComponent', () => {
  let component: DevicesTabComponent;
  let fixture: ComponentFixture<DevicesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
