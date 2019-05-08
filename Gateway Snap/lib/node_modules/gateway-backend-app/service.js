/*
 * Created by suman.sharma on 26/10/2018
 */
const SerialPort = require('serialport');
const nmea = require('nmea');
const fs = require('fs');
const TRANSACTION = require('./transaction');
const gpsServices = require('./gpsServices')
var bleServices = require('./bleServices');
var _ = require('lodash');
let offlineGps = "./offlineGps.json"
let gps = {
  currentTime: 0,
  currentLatitude: 0,
  currentLongitude: 0,
  lastKnCurrentTime: 0,
  lastKnCurrentLatitude: 0,
  lastKnCurrentLongitude: 0,
}

/*Function to fetch the GPS of the device which is connected via USB to the gateway
  This includes latitude, longitude and current timestamp of the GPS device*/
const getGPSDetails = (config) => {
  let trackerID = config.trackerID;
  console.log("CCTITAN: SERVICE :: Inside getGPSDetails function.");
  return new Promise(function(resolve, reject) {
    var coordinates = gpsServices.getLocationCoordinates();
    console.log("CCTITAN : UTC TIME : ", coordinates.utcTime)

    console.log("CCTITAN:  UTC TIME  is Defined", coordinates);
    if (coordinates.utcTime && coordinates.lat && coordinates.long) {
      if (gps.currentLatitude && gps.currentLongitude) {
        gps.lastKnCurrentTime = gps.currentTime;
        gps.lastKnCurrentLatitude = gps.currentLatitude;
        gps.lastKnCurrentLongitude = gps.currentLongitude;
      }
      gps.currentTime = coordinates.utcTime;
      gps.currentLatitude = coordinates.lat / 100;
      gps.currentLongitude = coordinates.long / 100;
      console.log("CCTITAN: Resolving GPS from Local - Non Zero Value", gps);
      resolve(gps);

    } else {
      console.log("CCTITAN: Inside ELSE block of GPS.");
      let networkConn = TRANSACTION.getConnectivity();
      networkConn.then(function(result) {
          networkConn = result;
          if (networkConn === true) {
            console.log("CCTITAN: When networkConn :: TRUE");
            let gpsFromAdditionalSource = TRANSACTION.getGPSFromAnotherDevice(trackerID);
            gpsFromAdditionalSource.then(function(result) {
              gpsFromAdditionalSource = JSON.parse(result);
              if (gps.currentLatitude && gps.currentLongitude) {
                gps.lastKnCurrentTime = gps.currentTime;
                gps.lastKnCurrentLatitude = gps.currentLatitude;
                gps.lastKnCurrentLongitude = gps.currentLongitude;
              }
              gps.currentTime = gpsFromAdditionalSource.TIMESTAMP;
              gps.currentLatitude = gpsFromAdditionalSource.LATITUDE;
              gps.currentLongitude = gpsFromAdditionalSource.LONGITUDE;
              console.log("CCTITAN: Resolving GPS From Azure", gps);
              let gpsData = JSON.stringify({
                currentTime: gps.currentTime,
                currentLatitude: gps.currentLatitude,
                currentLongitude: gps.currentLongitude,
                lastKnCurrentTime: gps.lastKnCurrentTime,
                lastKnCurrentLatitude: gps.lastKnCurrentLatitude,
                lastKnCurrentLongitude: gps.lastKnCurrentLongitude
              });
              console.log("CCTITAN : Writing gpsData in file :", gpsData);
              fs.writeFile(offlineGps, gpsData, 'utf8', function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("CCTITAN : Successfully written GPS data in file", gpsData);
                }
              });
              resolve(gps);
            }, function(gpsErr) {
              console.log("CCTITAN: Error from additional gps ", gpsErr);
            })
          } else {
            fs.readFile(offlineGps, 'utf8', function(err, data) {
              if (err) throw err;
              let json = JSON.parse(data);
              // gps.currentTime = json.lastKnCurrentTime;
              // gps.currentLatitude = json.lastKnCurrentLatitude;
              // gps.currentLongitude = json.lastKnCurrentLongitude;
              gps.lastKnCurrentTime = json.currentTime;
              gps.lastKnCurrentLatitude = json.currentLatitude;
              gps.lastKnCurrentLongitude = json.currentLongitude;
              console.log("CCTITAN: Resolving GPS from Local - since no NW Conn", gps);
              resolve(gps);
            });
            // gps.currentTime = gps.lastKnCurrentTime || 0
            // gps.currentLatitude = gps.lastKnCurrentLatitude || 0
            // gps.currentLongitude = gps.lastKnCurrentLongitude || 0
          }
        },
        function(nwErr) {
          reject(nwErr);
        })
    }
  })
}

const scanBeaconReadings = (config) => {
  console.log("CCTITAN: SERVICE :: Inside scanBeaconReadings function.");
  let macId = config.macId;
  return new Promise(function(resolve, reject) {
    let telemetryData = null;
    telemetryData = {
      alert: false,
      count: 0,
      sensorValues: []
    }
    telemetryData.alert = false;
    delete telemetryData.tempAlert;
    telemetryData.sensorValues = [];
    beacons = config.beaconList;
    //console.log(beacons.Beacons.length)
    setProvisionedBLEs(_.map(beacons.Beacons, 'BeaconID'));
    let sensorData = beacons && beacons.Beacons;
    console.log(sensorData)
    let provisionedBeacons = _.map(sensorData, 'BeaconID')
    console.log("CCTITAN : LIST of Provisioned Beacons : ", provisionedBeacons)
    let newbeacon_check = 1;
    let scanned_beacons = [];
    var pheripherals = bleServices.getBleData()
    console.log("CCTITAN : List of Peripherals : ", _.map(pheripherals, 'uuid'));
    for (let index in pheripherals) {
      let peripheral = pheripherals[index];
      //console.log("pheripheral : ",peripheral)
      var i = provisionedBeacons.indexOf(peripheral.uuid);
      console.log("i :", i)
      if (provisionedBeacons.indexOf(peripheral.uuid) !== -1) {
        let beaconid = peripheral.uuid;
        let rssi = peripheral.rssi;
        let temperature;
        let humidity;
        let measurementData;
        let tamper;
        let shockVibration;
        let data = {
          sensorID: 0,
          temperature: 0,
          humidity: 0,
          temperature_alert: false,
          humidity_alert: false,
          shock_alert: false,
          tamper_alert: false
        };
        measurementData = peripheral.advertisement.manufacturerData;
        humidity = (measurementData[10] + '.' + measurementData[11]) * 1;
        tamper = (measurementData[13]) * 1;
        if (tamper === 1) {
          data.tamper_alert = true;
        }
        shockVibration = (measurementData[12]) * 1;
        if (shockVibration === 1) {
          data.shock_alert = true;
        }
        if ((measurementData[7]) * 1 === 0) {
          temperature = (measurementData[8] + '.' + measurementData[9]) * 1;
        } else {
          temperature = (measurementData[8] + '.' + measurementData[9]) * -1;
        }
        if ((temperature < (sensorData[i].MinTempLimit)) || (temperature > (sensorData[i].MaxTempLimit))) {
          data.temperature_alert = true;
        }
        if ((humidity < (sensorData[i].MinHumLimit)) || (humidity > (sensorData[i].MaxHumLimit))) {
          data.humidity_alert = true;
        }
        data.sensorID = sensorData[i].BeaconID;
        data.temperature = temperature;
        data.humidity = humidity;
        scanned_beacons.push(beaconid);
        telemetryData.count = sensorData.length;
        telemetryData.tempAlert = (data.temperature_alert || data.humidity_alert || data.tamper_alert || data.shock_alert);
        telemetryData.alert = telemetryData.tempAlert || telemetryData.alert || false;
        telemetryData.sensorValues.push(data);
        console.log("CCTITAN: Sensor Values Length::::", telemetryData.sensorValues.length);
      } else {
        console.log("CCTITAN: Skipping pheripherals");
      }
    }
    if (pheripherals.length) {
      resolve(telemetryData);
    } else if (telemetryData.sensorValues.length) {
      resolve(telemetryData);
    }
  }, function(err) {
    reject(err)
    console.log("Error while fetching beacon list", err);
  });
}

var setProvisionedBLEs = function(provisionedBLE) {
  bleServices.setProvisionedBLEs(provisionedBLE);
}

module.exports = {
  getGPSDetails: getGPSDetails,
  scanBeaconReadings: scanBeaconReadings,
  setProvisionedBLEs: setProvisionedBLEs
}