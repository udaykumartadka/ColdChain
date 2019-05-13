'use strict';

var async = require('async');
const noble = require('noble');
let bleState = null //1- ON , 0 - off
var _ = require('lodash');
var provisionedBLE = []
var bleData = []
var logger = console;


var startScan = function() {

   console.log("Start Scanning");
  noble.startScanning([]);

  setTimeout(function() {
    stopScan();
  }, 120000);
}

var stopScan = function() {
   console.log("stop Scanning", bleData.length);

  noble.stopScanning();


  setTimeout(function() {
    bleData = null;
    bleData = [];
    startScan()
  }, 4000);
}

setTimeout(function() {
  startScan()
}, 1000);


noble.on('discover', peripheral => {

  if (provisionedBLE && provisionedBLE.length > 0 && provisionedBLE.indexOf(peripheral.id) !== -1) {
     //console.log(`Found Beacon ${peripheral.id}`);
    bleData.push(peripheral);
  } else if (provisionedBLE && provisionedBLE.length === 0) {
    //console.log(`Found Beacon ${peripheral.id}`);
    bleData.push(peripheral);
  }

});

var getBleData = function() {
  console.log("CCTITAN : BLE DATA LENGTH : ", bleData.length)
  return bleData;
}

var setProvisionedBLEs = function(_provisionedBLEs) {
  console.log("SETTING PROVISIONED BLEs : ", _provisionedBLEs)
  provisionedBLE = _provisionedBLEs;
}

module.exports = {
  getBleData: getBleData,
  setProvisionedBLEs: setProvisionedBLEs
}