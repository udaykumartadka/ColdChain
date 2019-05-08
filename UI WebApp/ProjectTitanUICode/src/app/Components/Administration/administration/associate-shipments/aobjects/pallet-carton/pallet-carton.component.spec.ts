import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletCartonComponent } from './pallet-carton.component';

describe('PalletCartonComponent', () => {
  let component: PalletCartonComponent;
  let fixture: ComponentFixture<PalletCartonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalletCartonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletCartonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
