var hex2ascii = require('hex2ascii');
var Web3 = require('web3');
var async = require('async')
var notificationService = require('./notification_services.js')
//var variables = require('./ABI_v11.json')
var variables = require('./ABI_v12.json')


var makeTxn = function(arr,cb){
    async.eachSeries(arr || [], dataIterator , function(err){
      cb(null);
    })
}

var dataIterator = function(obj3, iterCB){
    var shipmentId = obj3.Shipment_ID;
    var alert_type = obj3.Alert_Status;
    var final_str = JSON.stringify(obj3);
    console.log('Transaction JSON',final_str);
    try {
        web3 = new Web3(new Web3.providers.HttpProvider("http://40.117.159.33:8545"));
    } catch (e) {
        console.log(e);
    }

    web3.personal.unlockAccount(web3.eth.accounts[0], "Wipro@123456", 1500000);
//    var addressShipment = "0xb137a6de25dff338a5da60c83dab7e25cf7ccd3f";
	var addressShipment = "0x3110bc96848f05062d2c8e563da89cc26433195c";
    var Contract = web3.eth.contract(variables);
    var Shipment = Contract.at(addressShipment);
    var list_shipmentid = Shipment.getShipments();
    for(var i=0; i<list_shipmentid.length; i++){
      var str = hex2ascii(list_shipmentid[i]);
      /*if(str == shipmentId){
        console.log('Shipment ID found.');
        Shipment.updateShipmentAlerts(shipmentId,1,final_str,'Alert','blockmaker', {
          from: web3.eth.accounts[0],
          gas: 3000000
        },
        function (error, tHash) {
          if (error) {
            console.log(error);
          }else{
            console.log('Transaction Key: ',tHash);
          }
          notificationService.sendEmail(obj3, function(e){
            iterCB(null, null)
          });
        });
      }*/  if(str == shipmentId){
        console.log('Shipment ID found.');
        if(alert_type == 'Active'){
          Shipment.updateShipmentAlerts(shipmentId,1,final_str,'Alert-Started','blockmaker', {
            from: web3.eth.accounts[0],
            gas: 3000000
          },
          function (error, tHash) {
            if (error) {
              console.log(error);
            }else{
              console.log('Transaction Key: ',tHash);
            }
            notificationService.sendEmail(obj3, function(e){
              iterCB(null, null)
            });
          });
        }
        if (alert_type == 'Closed'){
          Shipment.updateShipmentAlerts(shipmentId,1,final_str,'Alert-Closed','blockmaker', {
            from: web3.eth.accounts[0],
            gas: 3000000
          },
          function (error, tHash) {
            if (error) {
              console.log(error);
            }else{
              console.log('Transaction Key: ',tHash);
            }
            notificationService.sendEmail(obj3, function(e){
              iterCB(null, null)
            });
          });
        }
      }
	    
	    else{
      //  console.log('ShipmentID not found Trasaction not made.');
      }
    }
}

module.exports = {
  'makeTxn' : makeTxn
}
