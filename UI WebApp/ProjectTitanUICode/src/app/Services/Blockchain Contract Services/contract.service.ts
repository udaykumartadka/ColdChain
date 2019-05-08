import { Injectable, OnInit } from '@angular/core';
import { AppSetting } from '../../Configuration Files/AppSetting';
import { environment } from '../../../environments/environment';

import * as Web3 from '../../../../node_modules/web3';

declare let require: any;
declare let window: any;

const tokenAbi = require('./tokenContract.json');

@Injectable()
export class ContractService {
  private _account: string = null;
  private _web3: any;
  public eventCounter: Number;
  TnxHash: String = '';

  BC_ShipmentID: any;

  private _tokenContract: any;

  private _tokenContractAddress = environment.contractAddress; // v11.5


  constructor() {
    this._web3 = new Web3(new Web3.providers.HttpProvider(environment.HttpProvider)); // v11.4

    this._tokenContract = this._web3.eth.contract(tokenAbi).at(this._tokenContractAddress);
  }



  /*****************************************************************************************************************
   *                                            Web3 Account Functions
   *****************************************************************************************************************/

  // Get all accounts
  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
          this._web3.personal.unlockAccount(accs[0], environment.Web3_password, 1500000);
          this._account = accs[0];

        });
      }) as string;
      this._web3.eth.defaultAccount = this._account;
    }
    return Promise.resolve(this._account);
  }

  // FUNCTION : to get User Balance
  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract._eth.getBalance(account, function (err, result) {
        if (err != null) {
          reject(err);
        }

        resolve(_web3.fromWei(result));

      });
    }) as Promise<number>;
  }

  public convertToHex(str) {
    let hex = '0x';
    for (let i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

sortByTimestamp(a, b) {
    return a.blockTimestamp - b.blockTimestamp;
  }

  /*****************************************************************************************************************
   *                                        Shipment Creation Functions
   *****************************************************************************************************************/


  // FUNCTION: to Create Shipment
  public async createShipment(shipmentId: String, productList,
    sourceLocation, destinationLocation, logisticsPartner, dateOfShipment, dateOfDelivery,
    purchaseOrderNumber, fromUser) {  // docType before docRef

    const account = await this.getAccount();
    const shipID = this.convertToHex(shipmentId);

    // Declare event watch for transactions to be able to fetch transaction history later
    const shipmentEvent = this._tokenContract.ShipmentEvent({ shipmentId: shipID }, { fromBlock: 0, toBlock: 'latest' });
    const shipmentDetailsEvent = this._tokenContract.ShipmentDetailsEvent({ shipmentId: shipID }, { fromBlock: 0, toBlock: 'latest' });
    const msgTypeDetailsEvent = this._tokenContract.MsgTypeDetailsEvent({ shipmentId: shipID }, { fromBlock: 0, toBlock: 'latest' });


    /* Send create transaction to contract which returns a txnHash for successful txn
       2 txns are sent to contract for shipment creation -
       createShipment     - populates Shipment & ShipmentDetails structures
       fillMsgTypeDetails - populates MessageType structure */
    this.TnxHash = null ;
    const messageType = 'Shipment Created';
    console.log('Before create');
    return await this._tokenContract.createShipment(shipID, productList,
      sourceLocation, destinationLocation, logisticsPartner, dateOfShipment, dateOfDelivery, purchaseOrderNumber,
      messageType, fromUser,
      { from: account, gas: environment.gasLimit }, (err, res) => {

        if (err) {
          console.log('Before err');
          console.log(err);
          console.log('After err');
        } else {
          console.log(res);
          this.TnxHash = res;
          alert('Consignment succesfully added to Blockchain with Transaction Hash : ' + res);
         }
      });
  }


  /*****************************************************************************************************************
   *                                        Shipment Getter Functions
   *****************************************************************************************************************/


  // Get All Shipment IDs present in blockchain
  public async getShipments(): Promise<any[]> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.getShipments({ from: account, gas: 100000 }, function (err, result) {
        if (err != null) {
          console.log(err);
          reject(err);

        } else {
          console.log(result);
        }
        resolve(result);
      });
    }) as Promise<any[]>;
  }

  // Fetch Shipment structure for particular shipment
  public async getShipmentById(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.getShipmentById(shipmentID, { from: account, gas: environment.gasLimit }, function (err, result) {
        if (err != null) {
          reject(err);
        } else {
          console.log(result);
        }

        resolve(result);

      });
    }) as Promise<any>;
  }

  // Get the Shipment Details for particular shipment
  public async getShipmentDetails(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.getShipmentDetails(shipmentID, { from: account, gas: environment.gasLimit }, function (err, result) {
        if (err != null) {
          reject(err);
        } else {
          console.log(result);
        }

        resolve(result);

      });
    }) as Promise<any>;
  }

  // Get the Shipment Message Type Details for particular shipment
  public async getMsgTypeDetails(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.getMsgTypeDetails(shipmentID, { from: account, gas: environment.gasLimit }, function (err, result) {
        if (err != null) {
          reject(err);
        } else {
          console.log(result);
        }

        resolve(result);

      });
    }) as Promise<any>;
  }

  // Get Shipment Alert Count and latest alertDetails for particular shipment
  public async getShipmentAlerts(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.getShipmentAlerts(shipmentID, { from: account, gas: environment.gasLimit }, function (err, result) {
        if (err != null) {
          reject(err);
        } else {
          console.log(result);
        }

        resolve(result);

      });
    }) as Promise<any>;
  }


  /*****************************************************************************************************************
   *                                        Shipment Transaction History Functions
   *****************************************************************************************************************/


  // Fetch shipment creation history of particular shipment (Shipment structure)
  public async getShipmentHistory(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      const event = this._tokenContract.ShipmentEvent({ shipmentId: shipmentID }, { fromBlock: 0, toBlock: 'latest' });
      event.get((error, eventResult) => {
        if (error != null) {
          reject(error);
        } else {
          console.log('shipmentID : ');
          console.log(eventResult);
          resolve(eventResult);
        }

      });
    }) as Promise<any>;
  }

  // Fetch shipment creation history of particular shipment (ShipmentDetails structure)
  public async getShipmentDetailsHistory(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      const event = this._tokenContract.ShipmentDetailsEvent({ shipmentId: shipmentID }, { fromBlock: 0, toBlock: 'latest' });
      event.get((error, eventResult) => {
        if (error != null) {
          reject(error);
        } else {
          console.log('shipmentID : ');
          console.log(eventResult);
          resolve(eventResult);
        }

      });
    }) as Promise<any>;
  }

  // Fetch entire shipment update history of particular shipment (MessageType structure)
  public async getMsgTypeDetailsHistory(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      const event = this._tokenContract.MsgTypeDetailsEvent({ shipmentId: shipmentID }, { fromBlock: 0, toBlock: 'latest' });
      event.get((error, eventResult) => {
        if (error != null) {
          reject(error);
        } else {
          console.log('getMsgTypeDetailsHistory : ');
          console.log(eventResult);
          resolve(eventResult);
        }

      });
    }) as Promise<any>;
  }

  // Fetch all the alerts of a particular shipment (Alerts structure)
  public async getShipmentAlertsHistory(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      const event = this._tokenContract.ShipmentAlertsEvent({ shipmentId: shipmentID }, { fromBlock: 0, toBlock: 'latest' });
      event.get((error, eventResult) => {
        if (error != null) {
          reject(error);
        } else {
          console.log('getShipmentAlertsHistory : ' + shipmentID);
          console.log(eventResult);
          resolve(eventResult);
        }

      });
    }) as Promise<any>;
  }

  // Fetch All Documents
  public async getShipmentDocsHistory(shipmentID): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      const event = this._tokenContract.ShipmentDocUploadEvent({ shipmentId: shipmentID }, { fromBlock: 0, toBlock: 'latest' });
      event.get((error, eventResult) => {
        if (error != null) {
          reject(error);
        } else {
          console.log('getShipmentDocUploadHistory : ' + shipmentID);
          console.log(eventResult);
          resolve(eventResult);
        }

      });
    }) as Promise<any>;
  }


  /*****************************************************************************************************************
   *                                        Shipment Update Functions
   *****************************************************************************************************************/


  public async updateShipmentInfo(shipmentId, shipmentInfo, messageType, fromUser): Promise<any> {
    const account = await this.getAccount();

    // tslint:disable-next-line:max-line-length
    await this._tokenContract.updateShipmentInfo(shipmentId, shipmentInfo, messageType, fromUser, { from: account, gas: environment.gasLimit }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.TnxHash = res;
        console.log('Updated shipment info : ' + this.TnxHash);
        alert('Consignment succesfully updated in Blockchain with Transaction Hash : ' + res);
        return res;
      }
    });
  }


  public async updateShipmentStatus(shipmentId, shipmentStatus, messageType, fromUser): Promise<any> {
    const account = await this.getAccount();

    // tslint:disable-next-line:max-line-length
    return await this._tokenContract.updateShipmentStatus(shipmentId, shipmentStatus, messageType, fromUser, { from: account, gas: environment.gasLimit }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.TnxHash = res;
        console.log('Updated shipment Status : ' + this.TnxHash);
        alert('Consignment succesfully updated in Blockchain with Transaction Hash : ' + res);
      }
    });
  }


  public async updateShipmentDocs(shipmentId, docName, docType, shipmentDocs, messageType, fromUser): Promise<any> {
    const account = await this.getAccount();

    // tslint:disable-next-line:max-line-length
    await this._tokenContract.updateShipmentDocs(shipmentId, docName, docType, shipmentDocs, messageType, fromUser, { from: account, gas: environment.gasLimit }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.TnxHash = res;
        console.log('Updated shipment Docs : ' + this.TnxHash);
        alert('Consignment succesfully updated in Blockchain with Transaction Hash : ' + res);
      }
    });
  }

  public async updateShipmentHeartBeat(shipmentId, heartBeat, messageType, fromUser): Promise<any> {
    const account = await this.getAccount();
    console.log('Update Shipment ID : ' + shipmentId);
    // tslint:disable-next-line:max-line-length
    await this._tokenContract.updateShipmentHeartBeat(shipmentId, heartBeat, messageType, fromUser, { from: account, gas: environment.gasLimit }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.TnxHash = res;
        console.log('Updated shipment HeartBeat : ' + this.TnxHash);
        alert('Consignment succesfully updated in Blockchain with Transaction Hash : ' + res);
      }
    });
  }

  public async updateShipmentAlerts(shipmentId, alertCount, alertsDetails, messageType, fromUser): Promise<any> {
    const account = await this.getAccount();

    // tslint:disable-next-line:max-line-length
    await this._tokenContract.updateShipmentAlerts(shipmentId, alertCount, alertsDetails, messageType, fromUser, { from: account, gas: environment.gasLimit }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.TnxHash = res;
        console.log('Updated shipment Alerts : ' + this.TnxHash);
        alert('Consignment succesfully updated in Blockchain with Transaction Hash : ' + res);
      }
    });
  }

}

