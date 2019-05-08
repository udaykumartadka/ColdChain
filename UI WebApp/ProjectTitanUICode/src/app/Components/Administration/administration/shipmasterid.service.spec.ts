import { TestBed, inject } from '@angular/core/testing';

import { ShipmasteridService } from './shipmasterid.service';

describe('ShipmasteridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipmasteridService]
    });
  });

  it('should be created', inject([ShipmasteridService], (service: ShipmasteridService) => {
    expect(service).toBeTruthy();
  }));
});
