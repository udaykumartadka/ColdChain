#!/usr/bin/env node

const os = require('os')
const _ = require('lodash');
const fs = require('fs');
const CONFGFILE = require('./config');
const TRANSACTION = require('./transaction');
const SERVICE = require('./service');
const UTIL = require('./util');

const LOG_ERR = 'ERR';
const LOG_SEND = 'SEND';
const LOG_APP = 'APP';
const APP_STATE_RUNNING = 'running';
const APP_STATE_STOPPING = 'stopping';
const APPLICATION_START_TIMEOUT = 10000;
let applicationState = APP_STATE_RUNNING;
let offlineConfig = "./offlineConfig.json"
const sensors = {
  macId: null,
  conString: null,
  beaconList: null,
  trackerID: null,
}
let data = {
  gatewayConfig: []
};

/*This function is for printing the message with the context */
const print = (context, msg, val = '') => {
  if (!context) {
    console.log('=========================');
  } else if (context === LOG_ERR) {
    console.error(msg, val);
  } else {
    console.log(`[${context}] ${msg}`, val);
  }
};

/*Function to load the app with the config details where all the services are initialised*/
const start = (config) => {
  print(LOG_APP, 'Starting the APP... ');
  if (config.macId && config.beaconList && config.conString && config.trackerID) {
    print('Calling function to send heartBeatdata');
    UTIL.startHeartBeatTask(config);
    console.log("Start : ", config)
    print('Calling function to send telemetry data to IoT Hub');
    UTIL.startSendingTask(config);
  }
};

/*Function to stop the app in case of any error*/
const stop = () => {
  if (applicationState === APP_STATE_STOPPING) return;
  applicationState = APP_STATE_STOPPING;
  print();
  print(LOG_APP, 'Stopping ...');
};

/*Function to initialize the app with all the required configurations*/
const init = () => {
  print(LOG_APP, 'Initialize ...');

  let nwConn = TRANSACTION.getConnectivity()
  nwConn.then(function(result) {
    nwConn = result;
    if (nwConn === true) {
      let macId = os.hostname();
      sensors.macId = macId;
      //sensors.macId = 'C031061830-00529';
      print("MacID :", sensors.macId);

      let beaconList = TRANSACTION.fetchBeaconAssociation(sensors.macId);
      beaconList.then(function(result) {
        sensors.beaconList = result;
        print("List of Beacons from Azure :", sensors.beaconList);

        let conString = TRANSACTION.getConnectionString(sensors.macId);
        conString.then(function(result) {
          sensors.conString = result;
          print("Connection String ::", sensors.conString);

          let trackerID = TRANSACTION.getTrackerID(sensors.macId);
          trackerID.then(function(result) {
            sensors.trackerID = result;
            print("Tracker ID ::", sensors.trackerID);

            let configData = JSON.stringify({
              macId: sensors.macId,
              beaconList: sensors.beaconList,
              conString: sensors.conString,
              trackerID: sensors.trackerID
            });
            console.log("CCTITAN : Writing Config data in file :", configData);
            fs.writeFile(offlineConfig, configData, 'utf8', function(err) {
              console.log(err);
            });
          }, function(err) {
            print(LOG_ERR, 'Exception while fetching trackerID', err);
          })
        }, function(err) {
          print(LOG_ERR, 'Exception while fetching Connection String', err);
        })
      }, function(err) {
        print(LOG_ERR, 'Exception while fetching beacons', err);
      })
    } else {
      fs.readFile(offlineConfig, 'utf8', function(err, data) {
        if (err) throw err;
        let json = JSON.parse(data);
        sensors.macId = json.macId;
        sensors.beaconList = json.beaconList;
        sensors.conString = json.conString;
        sensors.trackerID = json.trackerID;
        console.log(JSON.stringify("CCTITAN : Config data from file in case of no Internet :: ", sensors));
      });
    }
  }, function(nwErr) {
    console.log("No Internet Connection : ", nwErr);
  })

  process.on('uncaughtException', (err) => {
    print(LOG_ERR, 'uncaughtException:', err);
    try {
      stop();
    } catch (stopErr) {
      print(LOG_ERR, 'Error while stop:', stopErr);
    } finally {
      process.exit(-1);
    }
  });
  return sensors;
};

/*Start of the application*/
const config = init();
setTimeout(() => {
  start(config);
}, APPLICATION_START_TIMEOUT);