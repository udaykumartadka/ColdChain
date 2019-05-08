import { TestBed, inject } from '@angular/core/testing';

import { MapbeaconService } from './mapbeacon.service';

describe('MapbeaconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapbeaconService]
    });
  });

  it('should be created', inject([MapbeaconService], (service: MapbeaconService) => {
    expect(service).toBeTruthy();
  }));
});
