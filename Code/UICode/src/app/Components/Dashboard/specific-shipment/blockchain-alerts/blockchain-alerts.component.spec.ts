import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainAlertsComponent } from './blockchain-alerts.component';

describe('BlockchainAlertsComponent', () => {
  let component: BlockchainAlertsComponent;
  let fixture: ComponentFixture<BlockchainAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
