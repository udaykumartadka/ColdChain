import { SpecificShipmentModule } from './specific-shipment.module';

describe('SpecificShipmentModule', () => {
  let specificShipmentModule: SpecificShipmentModule;

  beforeEach(() => {
    specificShipmentModule = new SpecificShipmentModule();
  });

  it('should create an instance', () => {
    expect(specificShipmentModule).toBeTruthy();
  });
});
