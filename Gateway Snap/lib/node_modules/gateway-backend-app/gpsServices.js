const SerialPort = require('serialport');
const nmea = require('nmea');
const config = require('./config')
const Readline = SerialPort.parsers.Readline;
const parser1 = new Readline();
let lat = null;
let long = null;
let utcTime;
let currentTime;
const port = new SerialPort(config.gps.port, {
  baudRate: config.gps.baudRate
});
port.pipe(parser1);
parser1.on('data', function(line) {
  try {
    if (nmea.parse(line).sentence == "RMC") {
      date = new Date();
      utcTime = nmea.parse(line).timestamp;
      let time = utcTime[0] + utcTime[1] + ':' + utcTime[2] + utcTime[3] + ':' + utcTime[4] + utcTime[5];
      currentTime = (date.toISOString().slice(0, 10)) + 'T' + time + 'Z';
      lat = nmea.parse(line).lat;
      long = nmea.parse(line).lon;
    } else {
      console.log("CCTITAN :: Got bad packet ");
    }
  } catch (error) {
    console.error("CCTITAN :: Got bad packet:", line, error);
  }
});

var getLocationCoordinates = function() {
  return {
    lat: lat,
    long: long,
    utcTime: currentTime
  }
}

module.exports = {
  getLocationCoordinates: getLocationCoordinates
}