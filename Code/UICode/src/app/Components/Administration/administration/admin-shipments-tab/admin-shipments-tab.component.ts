import { Component, OnInit } from '@angular/core';
import { ShipmentService, ShipmentDetailsService, GatewayDetailService } from '../../../../Services/Shipment Services/shipment.service';
import { ShipmentDetailsObject } from '../../../../Interfaces/shipmentDetail';
import { ProductList } from '../../../../Interfaces/productList';
import { ShipmentObject } from '../../../../Interfaces/shipmentObject';
import { Status } from '../../../../Interfaces/StatusOptions';
import * as moment from 'moment';
import { ShipmasteridService } from '../shipmasterid.service';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';

@Component({
  selector: 'app-admin-shipments-tab',
  templateUrl: './admin-shipments-tab.component.html',
  styleUrls: ['./admin-shipments-tab.component.css']
})
export class AdminShipmentsTabComponent implements OnInit {


  shipmentID: String = '';
  PO_Number: String = '';
  source: String = '';
  destination: String = '';
  LogisticsPartner: String = '';
  form_productList: String = '';
  public fromUser: string;
  sessionShipID: string;

  displayNoShipmentMsg: boolean;

  // New Shipment Associate Variables
  associate_shipment_ID: any;
  associate_po_number: any;
  associate_Created_ON: any;
  associate_source: any;
  associate_destination: any;

  productListObject: ProductList;
  productList: ProductList[] = [];

  postShipmentObject: ShipmentObject;
  public txnHash: String = '';
  LocalShipmentID: any;

  statusOptions: Status[];
  StatusSelected: number;
  statusMsg: String;

  ShipmentStatusOptions: Status[];
  ShipmentStatusSelected: number;
  ShipmentStatusMsg: String;

  closeStatusOptions: Status[];
  closeStatusSelected: number;
  closeStatusMsg: String;

  shipmentIdParameter: any;
  tempObject: any;
  displayOverview;
  shipmentPresent: boolean;

  // Shipment Details Parameters
  shipmentDetailsList: ShipmentDetailsObject[] = [];
  filteredShipmentList: ShipmentDetailsObject[] = [];
  public shipment_master_id: any;
  shipmentCreated: boolean;

  // NewShipmentParameters that will be used in ADD Shipment Form
  NewShipmentID: any;
  newPurchaseOrder: any;
  newShipmentSource: any;
  newShipmentDestination: any;
  newShipmentCreatedOn: any;


  // Togglers
  displayViewDoc: boolean;
  displayUploadDoc: boolean;
  displayAssociation: boolean;
  displayShipmentList: boolean;
  AssociatePage: boolean;
  viewCloseConfirmation: boolean;

  // Temporary Variables
  JSONres: any;
  shipmentObject: any;
  tempArray: any;
  tempArray2: any;
  updateObject: any;

  constructor(
    private _shipmentService: ShipmentService,
    private _shipmentDetailService: ShipmentDetailsService,
    // private _masterService: ShipmasteridService,
    private cs: ContractService,
    private _GatewayDetailService: GatewayDetailService,
    private _masterService: ShipmasteridService
  ) {
    // Initializing Togglers
    this.displayShipmentList = true;
    this.AssociatePage = false;
    this.displayViewDoc = false;
    this.displayUploadDoc = false;
    this.displayAssociation = false;
    this.shipmentCreated = false;

    this.statusMsg = '';
    this.closeStatusMsg = '';

    this.displayNoShipmentMsg = false;
    this.viewCloseConfirmation = false;

  }

  ngOnInit() {

    this.displayNoShipmentMsg = false;
    this.shipmentDetailsList = [];
    this.filteredShipmentList = [];

    this.statusOptions = [
      { id: 0, status: 'Choose Status' },
      { id: 1, status: 'In-Progress' },
      { id: 2, status: 'H/O to LSP' },
      { id: 3, status: 'In-Transit' },
      { id: 4, status: 'H/O to FF' },
      { id: 5, status: 'Customs WH' },
      { id: 6, status: 'Received' },
      { id: 7, status: 'Distributors WH' },
      { id: 8, status: 'Delivered' },
    ];

    // Filter Shipment Status Here
    this.ShipmentStatusOptions = [
      { id: 0, status: ' Show All Shipments' },
      { id: 1, status: 'Active Shipments' },
      { id: 2, status: 'Deactivated Shipments' },
      { id: 3, status: 'New Shipments' },
    ];

    // Close Status Logic Here
    this.closeStatusOptions = [
      { id: 0, status: 'Choose Status' },
      { id: 1, status: 'Closed' },
      { id: 2, status: 'Abandoned' },
    ];

    // Setting Default Status
    this.StatusSelected = 0;
    this.ShipmentStatusSelected = 0;
    this.closeStatusSelected = 0;

    // Calling getAllShipments() API and making a Local Copy of the List
    this._shipmentService.getAllShipments()
      .subscribe(res => {
        this.JSONres = JSON.parse(res['_body']);


        for (let i = 0; i < this.JSONres.length; i++) {
          this.shipmentObject = {
            ShipmasterID: this.JSONres[i].ShipmasterID,
            ShipmentID: this.JSONres[i].ShipmentID,
            ShipmentStatus: this.JSONres[i].ShipmentStatus,
            CreatedBy: this.JSONres[i].CreatedBy,
            CreatedDateTime: this.JSONres[i].CreatedDateTime,
            SourceLoc: this.JSONres[i].SourceLoc,
            DestinationLoc: this.JSONres[i].DestinationLoc,
            LogisticPartner: this.JSONres[i].LogisticPartner,
            DateofShipment: this.JSONres[i].DateofShipment,
            DeliveryDate: this.JSONres[i].DeliveryDate,
            InvoiceDocRef: this.JSONres[i].InvoiceDocRef,
            PONumber: this.JSONres[i].PONumber,
            BlockchainStatus: this.JSONres[i].BlockchainStatus,
            TransactionHash: this.JSONres[i].TransactionHash,
            IsActive: this.JSONres[i].IsActive,
            GatewayCount: this.JSONres[i].GatewayCount,
            PalletCount: this.JSONres[i].PalletCount,
            CartonCount: this.JSONres[i].CartonCount,
            BoxCount: this.JSONres[i].BoxCount,
            ProductCount: this.JSONres[i].ProductCount,
            BeaconCount: this.JSONres[i].BeaconCount,
          };

          this.shipmentDetailsList.push(this.shipmentObject);
        }
        this.filteredShipmentList = this.shipmentDetailsList;
      });

    if (this.shipmentDetailsList.length === 0) {
      this.displayNoShipmentMsg = true;
    }
  }

  sortShipments(ShipmentStatusSelected) {

    // tslint:disable-next-line:triple-equals
    if (ShipmentStatusSelected == 1) {  // ACTIVE SHIPMENT
      this.filteredShipmentList = [];
      for (let i = 0; i < this.shipmentDetailsList.length; i++) {
        if (this.shipmentDetailsList[i].ShipmentStatus !== 'New' && this.shipmentDetailsList[i].IsActive === true) {
          this.filteredShipmentList.push(this.shipmentDetailsList[i]);
        }
      }
      // tslint:disable-next-line:triple-equals
      if (this.filteredShipmentList.length == 0) {
        alert('There are No Active Shipments');
      }
      // tslint:disable-next-line:triple-equals
    } else if (ShipmentStatusSelected == 2) { // DEACTIVATED SHIPMENT
      this.filteredShipmentList = [];
      for (let i = 0; i < this.shipmentDetailsList.length; i++) {
        if (this.shipmentDetailsList[i].ShipmentStatus !== 'New' && this.shipmentDetailsList[i].IsActive === false) {
          this.filteredShipmentList.push(this.shipmentDetailsList[i]);
        }

      }
      // tslint:disable-next-line:triple-equals
      if (this.filteredShipmentList.length == 0) {
        alert('There are No Deactivated Shipments');
      }
      // tslint:disable-next-line:triple-equals
    } else if (ShipmentStatusSelected == 3) { // NEW
      this.filteredShipmentList = [];
      for (let i = 0; i < this.shipmentDetailsList.length; i++) {
        if (this.shipmentDetailsList[i].ShipmentStatus === 'New') {
          this.filteredShipmentList.push(this.shipmentDetailsList[i]);
        }

      }
      // tslint:disable-next-line:triple-equals
      if (this.filteredShipmentList.length == 0) {
        alert('There are No New Shipments');
      }
      // tslint:disable-next-line:triple-equals
    } else if (ShipmentStatusSelected == 0) { // ALL
      this.filteredShipmentList = [];
      for (let i = 0; i < this.shipmentDetailsList.length; i++) {
        this.filteredShipmentList.push(this.shipmentDetailsList[i]);
      }
    }
  }
  /*------------------------ --------------------------------------------------------------------
                                Click Functions Written Below
  -----------------------------------------------------------------------------------------------*/
  createShipment() {

    this.txnHash = '';
    this.shipmentPresent = false;
    if (this.shipmentID === '' || this.source === '' || this.destination === '' || this.LogisticsPartner === '') {
      alert('Please Enter ALL the  Fields');
    } else {
      this.tempArray = this.form_productList.split(',');
      // Forming Product List Object and Pushing the Object in the ProductList
      for (let i = 0; i < this.tempArray.length; i++) {
        this.tempArray2 = this.tempArray[i].split(':');
        this.productListObject = {
          ProductId: 'P-' + (i + 1),
          ProductName: this.tempArray2[0],
          Quantity: this.tempArray2[1]
        };
        this.productList.push(this.productListObject);
      }
      /*------------------------------------------------------------------------------
                 First Create in Blockchain and then Create in AZURE
      --------------------------------------------------------------------------------*/

      // Check if Shipment Exists in Blockchain
      let shipmentIdParameter = this.cs.convertToHex(this.shipmentID);
      for (let i = (shipmentIdParameter.length - 2); i < 64; i++) {
        shipmentIdParameter += '0';
      }
      // Get all Shipment IDs present in blockchain
      this.cs.getShipments().then(res => {
        this.tempObject = res;

        // Check if Shipment already exists
        for (let j = 0; j < this.tempObject.length; j++) {
          if ((this.tempObject[j]) === shipmentIdParameter) {
            alert('Shipment already exists');
            this.shipmentPresent = true;
            break;
          }
        }
        // Create new Shipment if shipment doesn't exist in blockchain
        if (!this.shipmentPresent) {
          this.fromUser = 'BlockMaker';
          this.txnHash = null;
          this.cs.createShipment(this.shipmentID, JSON.stringify(this.productList),
            this.source, this.destination, this.LogisticsPartner,
            // tslint:disable-next-line:radix
            moment().format(), '2020-04-23T18:25:43.511Z', (this.PO_Number), this.fromUser);

          this.txnHash = this.cs.TnxHash;
        }

        // Checking If Shipment is Created in Blockchain
        if (this.txnHash != null && !this.shipmentPresent) {

          // Creating Post JSON Object to Create Shipment in Azure
          this.postShipmentObject = {
            ShipmentID: this.shipmentID,
            ShipmentStatus: 'New',
            CreatedBy: 'N/A',
            SourceLoc: this.source,
            DestinationLoc: this.destination,
            LogisticPartner: this.LogisticsPartner,
            DateofShipment: moment().format(),
            DeliveryDate: '2020-04-23T18:25:43.511Z',
            InvoiceDocRef: 'N/A',
            PONumber: this.PO_Number,
            BlockchainStatus: 'N/A',
            TransactionHash: 'N/A',
            ProductList: this.productList

          };

          this._shipmentService.addShipment(JSON.stringify(this.postShipmentObject)) // POST REQUEST to AZURE
            .subscribe(response => {
              console.log(response);
              //  Resetting the Fields
              this.shipmentID = '';
              this.PO_Number = '';
              this.source = '';
              this.destination = '';
              this.LogisticsPartner = '';
              this.form_productList = '';
              this.ngOnInit();
            });
        }
      });

    }


  }

  resetFields() {
    this.shipmentID = '';
    this.PO_Number = '';
    this.source = '';
    this.destination = '';
    this.LogisticsPartner = '';
    this.form_productList = '';
  }
  associate(data) {
    this.associate_shipment_ID = data.ShipmentID;
    this.associate_po_number = data.PONumber;
    this.associate_Created_ON = data.CreatedDateTime;
    this.associate_source = data.SourceLoc;
    this.associate_destination = data.DestinationLoc;
    this.displayShipmentList = false;
    this.AssociatePage = true;
    this._masterService.setshipmaster(data.ShipmasterID);
    this._shipmentDetailService.ShipmentDetailsDataTransfer({ ShipmentId: data.ShipmentID, ShipMasterId: data.ShipmasterID });
    this._GatewayDetailService.gatewayDetailsDataTransfer({ ShipmentId: data.ShipmentID, ShipMasterId: data.ShipmasterID });
  }

  viewShipments() {
    this.displayShipmentList = true;
    this.AssociatePage = false;
  }

  viewDoc(i, shipment_id) {
    this.displayOverview = i;
    this.cs.BC_ShipmentID = shipment_id;
    if (!this.displayViewDoc) {
      this.displayUploadDoc = false;
      // Display View Doc
      this.displayViewDoc = true;
      this.displayAssociation = false;
    } else {
      this.displayUploadDoc = false;
      this.displayViewDoc = false;
      this.displayAssociation = false;
    }
  }

  uploadDoc(i, shipment_id) {
    this.displayOverview = i;
    this.cs.BC_ShipmentID = shipment_id;
    if (!this.displayUploadDoc) {
      this.displayViewDoc = false;
      // Display Upload Doc
      this.displayUploadDoc = true;
      this.displayAssociation = false;
    } else {
      this.displayUploadDoc = false;
      this.displayViewDoc = false;
      this.displayAssociation = false;
    }
  }

  viewAssociation(i, shipment_master_id) {
    this._shipmentService.shipmentMasterID = shipment_master_id;
    this.displayOverview = i;
    this.shipment_master_id = shipment_master_id;
    if (!this.displayAssociation) {
      this.displayViewDoc = false;
      this.displayUploadDoc = false;

      // Display Association
      this.displayAssociation = true;
    } else {
      this.displayAssociation = false;
      this.displayUploadDoc = false;
      this.displayViewDoc = false;
    }
  }

  setLocalShipmentID(shipmentid) {
    this.LocalShipmentID = shipmentid;
  }

  updateStatus(statusVal, shipmentid) {
    if (statusVal === 0) {
      alert('Please Select a Valid Status');
    } else {
      this.shipmentIdParameter = null;
      this.shipmentPresent = false;
      this.statusMsg = this.statusOptions[statusVal].status;
      this.shipmentIdParameter = this.cs.convertToHex(shipmentid);
      for (let i = (this.shipmentIdParameter.length - 2); i < 64; i++) {
        this.shipmentIdParameter += '0';
      }

      // Check ShipmentIDs in blockchain if this shipment is present
      this.cs.getShipments().then(res => {
        this.tempObject = res;

        for (let j = 0; j < this.tempObject.length; j++) {
          if ((this.tempObject[j]) === this.shipmentIdParameter) {
            this.shipmentPresent = true;
            break;
          }
        }

        if (this.shipmentPresent) {
          // Update Status in Azure
          this.updateObject = {};
          this.updateObject = {
            ShipmentId: shipmentid,
            ShippingStatus: this.statusMsg

          };
          this._shipmentService.UpdateShippingStatus(JSON.stringify(this.updateObject))
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => res);

          this.cs.updateShipmentStatus(this.shipmentIdParameter, this.statusMsg, 'Shipment Status Updated', 'BlockMaker');

        } else {
          alert('Shipment Does Not Exists in Blockchain');
        }
      });
      this.StatusSelected = 0;
    }
  }

  validateInput(statusVal) {
    this.closeStatusSelected = statusVal;
    if (statusVal === 0) {
      alert('Choose a Valid Status');
      this.viewCloseConfirmation = false;
    } else {
      this.viewCloseConfirmation = true;
    }
  }
  // Close Status Function Here
  updatecloseStatus() {
    if (this.closeStatusSelected === 0) {
      alert('Please Select a Valid Status');
    } else {
      this.shipmentIdParameter = null;
      this.shipmentPresent = false;
      this.statusMsg = this.closeStatusOptions[this.closeStatusSelected].status;
      this.shipmentIdParameter = this.cs.convertToHex(this.LocalShipmentID);
      for (let i = (this.shipmentIdParameter.length - 2); i < 64; i++) {
        this.shipmentIdParameter += '0';
      }

      // Check ShipmentIDs in blockchain if this shipment is present
      this.cs.getShipments().then(res => {
        this.tempObject = res;

        for (let j = 0; j < this.tempObject.length; j++) {
          if ((this.tempObject[j]) === this.shipmentIdParameter) {
            this.shipmentPresent = true;
            break;
          }
        }

        if (this.shipmentPresent) {

          this.cs.updateShipmentStatus(this.shipmentIdParameter, this.statusMsg, 'Shipment Status Updated', 'BlockMaker');
          // Update Status in Azure
          this.updateObject = {};
          this.updateObject = {
            ShipmentId: this.LocalShipmentID,
            ShippingStatus: this.statusMsg
          };
          this._shipmentService.UpdateShippingStatus(JSON.stringify(this.updateObject))
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => res);
          this.viewCloseConfirmation = false;
        } else {
          alert('Shipment Does Not Exists in Blockchain');
        }
      });
      this.closeStatusSelected = 0;
    }
  }

  setShipmentID(shipmentId, shipmasterid) {
    this._shipmentService.shipmentID = shipmentId;
    sessionStorage.setItem('shipID', shipmentId);
    sessionStorage.setItem('shipMaster', shipmasterid);
  }
  // CLICK FUNCTION DEFINTION ENDS HERE ------------
}

