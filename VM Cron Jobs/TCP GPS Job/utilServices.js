var hexToDec = require('hex-to-dec');
var bitwise = require('bitwise');

var getLatitudeFromHex = function(rawData){
  var self = this;
  return self.rawData.readInt32BE(23)/10000000

}

var getLongitudeFromHex = function(buffer){

  var self = this;
  return self.rawData.readInt32BE(19)/10000000

}

module.exports = {
  getLatitudeFromHex : getLatitudeFromHex,
  getLongitudeFromHex : getLongitudeFromHex
}


