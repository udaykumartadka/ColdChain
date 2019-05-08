/*
 * Created by suman.sharma on 26/10/2018
 */
const MQTT = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message;
const connectivity = require('connectivity');
const fs = require('fs');

const CONFGFILE = require('./config');
const TRANSACTION = require('./transaction');
const SERVICE = require('./service');
const SEND = require('./send');
const SEND_DEVICE_CONNECTED = 'DEVICE_CONNECTED';

/*This function is for printing the output based on the response received */
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

/*This function is to send the keep alive information of the devices for every 5 seconds to IoT Hub*/
const sendHeartBeatState = (config, status) => {
  console.log("CCTITAN: UTIL :: Inside sendHeartBeatState function.");
  let heartBeatdata;
  let deviceId = config.macId;
  let connectionString = config.conString;
  let client = DeviceClient.fromConnectionString(connectionString, MQTT);
  heartBeatdata = JSON.stringify({
    gatewayId: config.macId,
    device_status: status,
    message_type: "HeartBeat",
    current_system_time: new Date()
  });
  let message = new Message(heartBeatdata);
  client.sendEvent(message, printResultFor('sendHeartBeatState'));
  console.log("CCTITAN: =============================");
  console.log(`CCTITAN: Publish to Azure ${heartBeatdata}`);
  console.log("CCTITAN: =============================");
};

/*Function to send the data to cloud*/
const sendDeviceState = (config, data) => {
  console.log("CCTITAN: UTIL :: Inside sendDeviceState function.");
  SEND.send(config, data, SEND_DEVICE_CONNECTED);
};

/*Function to send the data to cloud after certain interval of time*/
const startSendingTask = (config) => {
  console.log("CCTITAN: UTIL :: Inside startSendingTask function.");
  return setInterval(() => {
    sendDeviceState(config);
  }, 119000);
};

/*Function to send the heartbeat data to cloud after certain interval of time*/
const startHeartBeatTask = (config) => {
  console.log("CCTITAN: UTIL :: Inside startHeartBeatTask function.");
  return setInterval(() => {
    sendHeartBeatState(config, SEND_DEVICE_CONNECTED);
  }, 60000);
};

module.exports = {
  sendDeviceState: sendDeviceState,
  startSendingTask: startSendingTask,
  startHeartBeatTask: startHeartBeatTask,
  sendHeartBeatState: sendHeartBeatState
}