/*
 * Created by suman.sharma on 21/11/2018
 */
const MQTT = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message;
const connectivity = require('connectivity');
const fs = require('fs');
const CONFGFILE = require('./config');
const TRANSACTION = require('./transaction');
const SERVICE = require('./service');
const SEND_DEVICE_CONNECTED = 'DEVICE_CONNECTED';

let connectionString;
let deviceId;
let client;
let message;
let storage = 'storage.json'
let obj = {
  publishMessage: []
};

/*This function is for printing the output based on the response received */
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

/*This function is to send the data to cloud in JSON format*/
const send = (config, status) => {
  console.log('CCTITAN:SEND :: Inside send function.');
  let data;
  let conn = false;
  let fileEmpty = true;
  var file = './storage.json';

  deviceId = config.macId;
  connectionString = config.conString;
  console.log("CCTITAN: Connection String :", connectionString);

  client = DeviceClient.fromConnectionString(connectionString, MQTT);
  let readings = SERVICE.scanBeaconReadings(config);
  readings.then(function(result) {
      console.log("CCTITAN: Back to Send Function after reading beacons");
      readings = result;
      console.log("CCTITAN: Fetched Sensor readings", readings);
      let gps = SERVICE.getGPSDetails(config);
      gps.then(function(gpsData) {
        gps = gpsData;
        console.log("CCTITAN: Fetched GPS readings", gps);
        data = JSON.stringify({
          gatewayId: config.macId,
          device_status: status,
          alert: readings.alert,
          message_type: readings.alert ? "Alert" : "Telemetry",
          last_recorded_latitude: gps.lastKnCurrentLatitude,
          last_recorded_longitude: gps.lastKnCurrentLongitude,
          last_recorded_gps_time: gps.lastKnCurrentTime,
          current_latitude: gps.currentLatitude,
          current_longitude: gps.currentLongitude,
          current_gps_time: gps.currentTime,
          current_system_time: new Date(),
          sensor_capture_status: "OK",
          sensor_count: readings.sensorValues.length,
          sensor_Values: readings.sensorValues
        });
        conn = TRANSACTION.getConnectivity();
        conn.then(function(res) {
          conn = res
          console.log("CCTITAN: Fetching network coonnection inside send function");
          if (conn === true) {
            console.log("CCTITAN: Network Connectivity :: ", conn);
            let fileCheck = TRANSACTION.checkFileExists(file);
            fileCheck.then(function(res) {
              fileCheck = res;
              console.log("CCTITAN: File Check :: ", fileCheck);
              if (fileCheck === false) {
                message = new Message(data);
                client.sendEvent(message, printResultFor('send'));
                console.log("CCTITAN: =============================");
                console.log(`CCTITAN: Publish to Azure ${data}`);
                console.log("CCTITAN: =============================");
              } else {
                let fileEmpty = TRANSACTION.checkFileEmpty(file);
                fileEmpty.then(function(res) {
                  fileEmpty = res;
                  console.log("CCTITAN: fileEmpty ", fileEmpty);
                  if ((fileCheck === true) && (fileEmpty === true)) {
                    message = new Message(data);
                    client.sendEvent(message, printResultFor('send'));
                    console.log("CCTITAN: =============================");
                    console.log(`CCTITAN: Publish to Azure ${data}`);
                    console.log("CCTITAN: =============================");
                  } else {
                    fs.readFile(file, 'utf8', function(err, data) {
                      if (err) throw err;
                      let json = JSON.parse(data);
                      console.log(json.publishMessage.length);
                      for (let i = 0; i < json.publishMessage.length; i++) {
                        console.log(json.publishMessage[i]);
                        message = new Message(json.publishMessage[i]);
                        client.sendEvent(message, printResultFor('send'));
                        console.log("CCTITAN: =============================");
                        console.log(`CCTITAN: Publish to Azure ${json.publishMessage[i]}`);
                        console.log("CCTITAN: =============================");
                      }
                      fs.writeFile(file, '', function(err) {
                        console.log("CCTITAN: Emptying the file ");
                      });
                    });
                  }
                }, function(empErr) {
                  console.log("CCTITAN: File Empty error");
                })
              }
            }, function(feErr) {
              console.log("CCTITAN: File Exists error");
            })
          } else {
            obj.publishMessage.push(data);
            let json = JSON.stringify(obj);

            fs.writeFile(storage, json, 'utf8', function(err) {
              console.log(err);
            });
            setTimeout(() => {
              fs.readFile(storage, 'utf8', function readFileCallback(err, result) {
                if (err) {
                  console.log("CCTITAN: read error", err);
                } else {
                  obj = JSON.parse(result);
                  obj.publishMessage.push(data);
                  json = JSON.stringify(obj);
                  console.log("CCTITAN: File Storage Data", json);
                  fs.writeFile(storage, json, 'utf8', function(err) {
                    console.log(err);
                  });
                }
              });
            }, 1000);
          }
        }, function(err) {
          console.log("CCTITAN: Error in network connectivity", err);
        })
      }, function(gpsErr) {
        console.log("CCTITAN: Error while fetching GPS", gpsErr);
      })
    }),
    function(err) {
      console.log("CCTITAN: sensor data not available");
    }
};

module.exports = {
  send: send
}