/*
 * Created by suman.sharma on 26/10/2018
 */
const fs = require('fs');
const request = require('request');
const config = require('./config');

'use strict';

//Function to fetch the mac address of the device
/*const getMacAddress = () => {
  let macId;

  return new Promise(function(resolve, reject) {
    macaddress.one(function(err, mac) {
      if (err) {
        reject(err);
      } else {
        macId = mac.toLowerCase().replace(new RegExp(':', 'g'), '');
        resolve(macId);
      }
    });
  })
}*/

//Function to fetch the connectionString with respect to the gateway
const getConnectionString = (macId) => {
  let connectionString;
  let sharedAccessKey;
  let azureIoTString;
  let url = config.azureFunction.connectionString + macId;

  console.log("CCTITAN: TRANSACTION :: Inside getConnectionString function...............");

  return new Promise(function(resolve, reject) {
    request.get({
      url: url
    }, function(err, resp, body) {
      if (err) {
        reject(err);
      } else if (resp.statusCode == 200) {
        connectionString = JSON.parse(JSON.parse(body))
        sharedAccessKey = ";SharedAccessKey=" + connectionString;
        azureIoTString = config.azureFunction.connStringPrefix + macId + sharedAccessKey;
        resolve(azureIoTString);
      } else {
        reject("ERR_FETCH_CONN_STR", err)
      }
    })
  })
}

//Function to fetch the beacons associated with the gateway
const fetchBeaconAssociation = (macId) => {
  console.log("CCTITAN: TRANSACTION :: Inside fetchBeaconAssociation function.");
  let beaconData = [];
  let url = config.azureFunction.gateway_beacon_data + macId;
  return new Promise(function(resolve, reject) {
    request.get({
      url: url
    }, function(err, resp, body) {
      if (err) {
        reject(err);
      } else if (resp.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject("ERR_GETTING_ASSOCIATED_BEACONS_LIST", err);
      }
    })
  })
}

const getTrackerID = (macId) => {
  console.log("CCTITAN: TRANSACTION :: Inside getGPSFromAnotherDevice function.");
  let url = config.azureFunction.gpsAzureFunctionUrl + macId;
  return new Promise(function(resolve, reject) {
    request.get({
      url: url
    }, function(err, resp, body) {
      if (resp.statusCode == 200) {
        var data = JSON.parse(body);
        resolve(data.TrackerId);
      } else {
        reject("ERR_GETTING_ASSOCIATED_TRACKER_ID", err);
      }
    })
  })
}

const getGPSFromAnotherDevice = (trackerID) => {
  console.log("CCTITAN: TRANSACTION :: Inside getGPSFromAnotherDevice function...............");
  let url = config.azureFunction.gpsTrackerDataUrl + trackerID;
  return new Promise(function(resolve, reject) {
    request.get({
      url: url
    }, function(err, resp, body) {
      if (resp.statusCode == 200) {
        resolve(body);
      } else {
        reject("ERR_GETTING_ASSOCIATED_TRACKER_GPS", err);
      }
    })
  })
}

const getConnectivity = () => {
  console.log("CCTITAN: TRANSACTION :: Inside getConnectivity function...............");
  return new Promise(function(resolve, reject) {
    require('dns').resolve('www.google.com', function(err) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function checkFileExists(file) {
  console.log("CCTITAN: TRANSACTION :: Inside checkFileExists function...............");

  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        //console.log("CCTITAN: Error ::", err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function checkFileEmpty(file) {
  console.log("CCTITAN: TRANSACTION :: Inside checkFileEmpty function...............");
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        resolve(true);
        console.log("CCTITAN: true");
      } else {
        if (data.length == 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}


module.exports = {
  //getMacAddress: getMacAddress,
  getConnectionString: getConnectionString,
  fetchBeaconAssociation: fetchBeaconAssociation,
  getGPSFromAnotherDevice: getGPSFromAnotherDevice,
  getConnectivity: getConnectivity,
  checkFileExists: checkFileExists,
  checkFileEmpty: checkFileEmpty,
  getTrackerID: getTrackerID
};