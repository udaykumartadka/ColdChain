import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerTabComponent } from './tracker-tab.component';

describe('TrackerTabComponent', () => {
  let component: TrackerTabComponent;
  let fixture: ComponentFixture<TrackerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
