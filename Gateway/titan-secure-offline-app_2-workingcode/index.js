#!/usr/bin/env node
const async = require('async');
const noble = require('noble');
const MQTT = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message;
const connectivity = require('connectivity');
const _ = require('lodash')
const OS = require('os')
const request = require('request');
const config = require('./config');
const logger = console;
const fs = require('fs');
let storage = 'storage.json';
const file = './storage.json';

//****************************************
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

//****************************************





let obj = {
  publishMessage: []
};


let opInit = function() {
  async.series({
    resetFile : fileReset,
    networkStatus: _.bind(isNetworkAvailable, config),
    macId: _.bind(getSystemHostname, config),
    conString: _.bind(getConnectionString, config),
    beacons: _.bind(getAssociatedBeacons, config)

  }, _process)
}

setTimeout(opInit, 2000);


let fileReset = function (cb) {
  try {
      fs.writeFile(storage, '', function(){console.log('RESETTING FILE IS DONE')})
  } catch (e) {
    console.log("ERROR @ RESETTING THE File", e);
  }
  cb(null);
}

//******Get System hostname*******
let getSystemHostname = function(cb) {
  this && (this.macId = OS.hostname());
  cb(null, OS.hostname());
  // this && (this.macId = "");
  // cb(null, "");
}

// Getting Connection String from cloud services
let getConnectionString = function(cb) {
  logger.info("CCTITAN: Getting Connection String");
  request.get({
    url: config.azureFunction.connectionString + this.macId
  }, (e, resp, body) => {
    if (e) {
      logger.error("CCTITAN: ERR_FETCH_CONN_STR", e);
      cb("ERR_FETCH_CONN_STR", null);
      return;
    } else if (resp.statusCode == 200) {
      let azureIoTString = config.azureFunction.connStringPrefix + this.macId + ";SharedAccessKey=" + JSON.parse(JSON.parse(body));
      this && (this.conString = azureIoTString)
      cb(null, azureIoTString);
    } else {
      logger.error("CCTITAN: ERR_FETCH_CONN_STR", null);
      cb("ERR_FETCH_CONN_STR", e);
      return;
    }
  })
  //cb(null, "HostName=TitanIOTHub.azure-devices.net;DeviceId=mohammad-HP-ProBook-430-G2;SharedAccessKey=hWiw7oZU9HUSUZDU5285s0cKljTqn9/TMoNsdFJ2d1E=");
   //cb(null, null);
};

// Getting associated Beacon ID's for this gateway from Cloud services
let getAssociatedBeacons = function(cb) {
  logger.info("CCTITAN: Getting Associated Beacons");
  request.get({
    url: config.azureFunction.gateway_beacon_data + this.macId
    //url: config.azureFunction.gateway_beacon_data + "C031051823-00112"
  }, (e, resp, body) => {
    if (e) {
      logger.error("CCTITAN: ERR_GETTING_ASSOCIATED_BEACONS_LIST", e);
      cb("ERR_GETTING_ASSOCIATED_BEACONS_LIST", null);
      return;
    } else if (resp.statusCode == 200) {

      this && (this.beacons = getFormatedBeaconList(JSON.parse(body)));
      cb(null, getFormatedBeaconList(JSON.parse(body)));
    } else {
      logger.error("CCTITAN: ERR_GETTING_ASSOCIATED_BEACONS_LIST", null);
      cb("ERR_GETTING_ASSOCIATED_BEACONS_LIST", e);
      return;
    }
  })

  // this && (this.beacons = getFormatedBeaconList(beaconList))
  // cb(null, getFormatedBeaconList(beaconList));
};

//Check Network statusCode
let isNetworkAvailable = function(cb) {
  //TODO check network status
  cb(null, true)
}

// Initiating process after receiving necessary data from Cloud services
let _process = function(e, properties) {

  if (e) {
    console.log("ERR_INITIATING_PROCESS", e);
    return;
  }
  let _arr = [];
  for (_beaconId of _.keys(properties.beacons)) {
    console.log(_beaconId);
    _arr.push(properties.beacons[_beaconId]);
  }

   properties.beacons = getFormatedBeaconList({"Beacons" : _arr});
  console.log("Properties : ", properties, _.keys(properties.beacons));
  async.eachSeries(_.keys(properties.beacons), _.bind(beaconsIterator, properties), function(e) {

    console.log("SCANNING ALL BEACONS Completed");
    let send = _.bind(sendToCloud, properties)(function () {
      console.log("COMPLETED OPERATION and NEXT ITERATION starts after 60 min");
      setTimeout(opInit, 1000*60*60);
    }
    );
    //process.exit(0);
           //
             //TODO enable it during production deployment

  })
}

let beaconsIterator = function(beacon, cb) {
  console.log("Iterating Beacon : ", beacon);
  noble.removeAllListeners("discover")
  let _o = {
    cb: cb,
    beacon: beacon,
    properties: this,
    cbState: false,
    stopScanState: false
  }
  noble.on('discover', _.bind(discoverService, _o))
  noble.startScanning();

  setTimeout(function() {
    noble.removeAllListeners("discover")
    if (!this.stopScanState) {
      this.stopScanState = true;
      noble.stopScanning();
    }
    try {
      if (!this.cbState) {
        this.cbState = true;
        cb(null, null)
      }

    } catch (e) {
      console.log("ALREADY CB CALLED");
    }
  }, 1000*3*60);
  //}, 1000*30*1);

}

let discoverService = function(peripheral) {


  if (peripheral.uuid != this.beacon) {
    console.log("Matching ", this.beacon, " with ", peripheral.uuid);
    return
  } else {
    console.log("Matched ", peripheral.uuid);
    this.peripheral = peripheral;
    if (!this.stopScanState) {
      this.stopScanState = true;
      noble.stopScanning();
    }
  }
  peripheral.on('disconnect', () => {
    console.log("Peripheral ", this.peripheral.uuid, " Disconnected");
  });
  peripheral.connect(_.bind(peripheralOnConnect, this));
}

let peripheralOnConnect = function(e) {
  if (e) {
    console.log("Peripheral Connect ERR - ", e);
    this.peripheral.disconnect();
    return;
  }
  console.log("Connected to Peripheral ", this.peripheral,this.peripheral.uuid);
  this.peripheral.discoverServices(['b410'], (e, services) => {
    if (e) {
      console.log("ERROR_AT_DISCOVERY_SERVICES", e);
      return
    }
    // this.peripheral.disconnect();
    // this.cb(null);
    //console.log(e, "Discovered Services: ",services);
    services && services[0] && services[0].discoverCharacteristics([], _.bind(writeAndReadBleData, this));
  })
}


let writeAndReadBleData = function(error, characteristics) {
console.log("READ/WRITE STEP");
  this.count = 0;
  this.readCharacteristics = characteristics[0]
  this.writeCharacteristics = characteristics[1]

  async.whilst(
    () => this.count < 1000,

    (_cb) => {
      async.series({
        write: _.bind(writeData, this),
        read: _.bind(readData, this)
      }, (e, data) => {
        this.count++;
        _cb(null)
      })
    },

    (err, n) => {
      console.log("READ COMPLETED TO Peripheral : ", this.peripheral.uuid);
    //  let sendToCloudfn = sendToCloud();

      if (this[this.peripheral.uuid] && this[this.peripheral.uuid].dataAvailability) { //TODO Check
        //TODO reset stored data in device;
      }
      this.peripheral.disconnect();
      try {
        if (!this.cbState) {
          this.cbState = true;
          this.cb(null, null)
        }
      } catch (e) {
        console.log("2 ALREADY CB CALLED");
      }


    }
  );
}


let writeData = function(cb) {
  let buff = Buffer.from([0, 0])
  buff.writeUInt16BE(this.count, 0)
  // console.log(this.count, '55AA1202' + buff.toString('hex'));
  let payload = new Buffer('55AA1202' + buff.toString('hex'), 'hex');
  //let payload = new Buffer('55AA120000', 'hex');
  this.writeCharacteristics.write(payload, false, function(error) {
    console.log("Written successfully");
    cb();
  });
}

let readData = function(cb) {
  this.readCharacteristics.read((error, data) => {
    console.log(data.readUInt16BE(4, 6), " - MSG PACKETS : ", data );
    if (data.length === 20 && (Number(data.slice(19, 20).toString('hex')[1]) !== 0)) {
      this[this.peripheral.uuid] = { //TODO Check
        dataAvailability: true
      }




      let msg = _.bind(getMessagePacket, this)(data)
      _.bind(writeToFile, this)(msg, cb)
    } else {
      this[this.peripheral.uuid] = { //TODO Check
        dataAvailability: true
      }
      this.count = 1000;
      cb()
    }

  });
}

let writeToFile = function(msg, cb) {
  //TODO Push to Cloud
  obj.publishMessage.push(msg);
              let json = JSON.stringify(obj);
              fs.writeFile(storage, json, 'utf8', function(err) {
                if(err)
                {
                  console.log(err);
                }
                else {
                  console.log("written to file");
                  cb(null);
                }

              });

}





  //client.sendEvent(message, printResultFor('send'));
// console.log("Data sent:", msg);
// cb(null);
//}

//
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

//**********MSG PROCESS SECTION***********

let getTimestamp = function(buff) {
  let ts = "20" + (buff.readUInt8(0).toString()).padStart(2, "0") + "-" + (buff.readUInt8(1).toString()).padStart(2, "0") + "-" + (buff.readUInt8(2).toString()).padStart(2, "0") + "T" +
    (buff.readUInt8(3).toString()).padStart(2, "0") + ":" + (buff.readUInt8(4).toString()).padStart(2, "0") + ":" + (buff.readUInt8(5).toString()).padStart(2, "0") + ".000Z"
  return new Date(ts);
}

let isAlertData = function(buff) {
  return buff.toString('hex')[1] === "f" ? 0 : 1
}

let getAlertType = function(buff) {
  let msgTypeCode = buff.toString('hex')[1]
  switch (msgTypeCode) {
    case '1':
      return "TEMPERATURE";
      break;
    case '2':
      return "HUMIDITY";
      break;
    case '4':
      return "VIBRATION";
      break;
    case '8':
      return "TAMPER";
      break;
    case 'f':
      return "STORED_DATA";
      break;
  }
}

let getTemperatureData = function(buff) {
  let tempValue = Number(buff.readUInt8(13, 14) + "." + buff.readUInt8(14, 15))
  return tempValue * (buff.readUInt8(12, 13) ? -1 : 1);
}

let getHumidityData = function(buff) {
  return (buff.readUInt8(15, 16) + "." + buff.readUInt8(16, 17)) * 1
}

let getMessagePacket = function(buff) {
  let msg = {
    gatewayId: this.properties.macId,
    alert: isAlertData(buff.slice(19, 20)),
    message_type: isAlertData(buff.slice(19, 20)) ? "Stored_Alert" : "Stored_Telemetry",
    last_recorded_latitude: 0,
    last_recorded_longitude: 0,
    last_recorded_gps_time: 0,
    current_latitude: 0,
    current_longitude: 0,
    current_gps_time: 0,
    current_system_time: getTimestamp(buff.slice(6, 12)),
    sensor_capture_status: "OK",
    sensor_count: 1,
    sensor_Values: [{
      sensorID: this.peripheral.uuid,
      temperature: getTemperatureData(buff),
      humidity: getHumidityData(buff),
      temperature_alert: getAlertType(buff.slice(19, 20)) === "TEMPERATURE" ? 1 : 0,
      humidity_alert: getAlertType(buff.slice(19, 20)) === "HUMIDITY" ? 1 : 0,
      shock_alert: getAlertType(buff.slice(19, 20)) === "VIBRATION" ? 1 : 0,
      tamper_alert: getAlertType(buff.slice(19, 20)) === "TAMPER" ? 1 : 0
    }]
  };
  return msg
}



let sendToCloud = function(cb) {
console.log("SEND TO CLOUD.......", this);
  let connectionString = this.conString;
  console.log("Conn String :", this.conString, connectionString);
  client = DeviceClient.fromConnectionString(connectionString, MQTT);
console.log("inside send to cloud");
  //TODO Push to Cloud
  fs.readFile(storage, 'utf8', function(err, data) {
                      //console.log("Inside file read :", err,data);;
                      if (err) {
                        console.log("ERR_READING_STORED_FILE:",err);
                        cb(null)
                        return;
                      }
                      if(data){
                      let json = JSON.parse(data);
                      console.log(json.publishMessage.length);
                      for (let i = 0; i < json.publishMessage.length; i++) {
                        //console.log(json.publishMessage[i]);
                        message = new Message(JSON.stringify(json.publishMessage[i]));
                        client.sendEvent(message, (err, res) => {
                          if (err) console.log(' error: ' + err.toString());
                          if (res) console.log(' status: ' + res.constructor.name);
                          console.log(i, "Data sent:", json.publishMessage[i].sensor_Values[0].sensorID);

                        })
                      }
                      fs.writeFile(file, '', function(err) {
                        console.log("CCTITAN: Emptying the file ");
                        cb(null);
                      });
                    }else{
                      console.log("File Empty");
                      cb(null);
                    }
});

}
let getFormatedBeaconList = function(beaconList) {
  let _o = {}
  for (beacon of beaconList.Beacons) {
    _o[beacon.BeaconID] = beacon
  }
  return _o;
}







// Uncaught Exception Handling

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
})
