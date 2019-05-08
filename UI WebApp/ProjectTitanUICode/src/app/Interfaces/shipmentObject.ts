import {ProductList} from './productList';

export class ShipmentObject {
 ShipmentID: String;
 ShipmentStatus: String;
 CreatedBy: String;
 SourceLoc: String;
 DestinationLoc: String;
 LogisticPartner: String;
 DateofShipment: String;
 DeliveryDate: String;
 InvoiceDocRef: String;
 PONumber: String;
 BlockchainStatus: String;
 TransactionHash: String;
 ProductList: ProductList[];
}
