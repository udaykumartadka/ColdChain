import { TestBed, inject } from '@angular/core/testing';

import { AssociateObjectService } from './associate-object.service';

describe('AssociateObjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssociateObjectService]
    });
  });

  it('should be created', inject([AssociateObjectService], (service: AssociateObjectService) => {
    expect(service).toBeTruthy();
  }));
});
