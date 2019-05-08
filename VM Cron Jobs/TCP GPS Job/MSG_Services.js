var async = require('async');
var hexToDec = require('hex-to-dec');
var utilServices = require('./utilServices');
var config = require('./application_config');
var async = require('async');
var hexToDec = require('hex-to-dec');
var utilServices = require('./utilServices');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var connection = new Connection(config.db);
connection.on('connect', function(err) {
     if (err){
          console.log(err)
      }
   }
 );

/*Handle Raw Messages from Tracker Devices*/
var dataHandler = function(socket, data){
    new MsgServices().init(socket, data).process();
};

var MsgServices = function(){}
MsgServices.prototype.init = function(socket, rawData){
  console.log('[RAW_MSG: ]',"[",  rawData.length,"]: ", rawData.toString('hex'));
  this.socket = socket;
  this.rawData = rawData;
  return this;
}

MsgServices.prototype.process = function(){
    var self = this;
    async.waterfall([
        function(cb){ self.identifyMsgType(cb)},
        function(msgType, cb){ self.decodeData(msgType, cb)},
        function(decodedData, cb){ self.validateDevice(decodedData, cb)},
        function(decodedData, cb){ self.acknowledgeToDevice(decodedData, cb)},
        function(decodedData, cb){ self.pushToCloud(decodedData, cb)},
//	function(decodedData, cb){ self.deletefromCloud(decodedData, cb)},
    ], function(err, response){
        console.log(err, response);

    })
}

MsgServices.prototype.identifyMsgType = function(cb){
    var self = this;
    self.rawData.length < 18 ? cb(null, 'DEV_SELF_REG_MSG') : cb(null, 'PERIODIC_MSG');
}

MsgServices.prototype.decodeData = function(msgType, cb){
    var self = this;
    console.log(cb);
    if(msgType === 'DEV_SELF_REG_MSG'){
        self.decodeDeviceDetails(cb);
    }else{
        self.decodePeriodicMessage(cb)
    }
}

MsgServices.prototype.decodeDeviceDetails = function(cb){
    var self = this;
    var deviceInfo = {
      msgType : 'DEV_SELF_REG_MSG',
      msg_seq_id:'01',
      imei : self.rawData.toString('ascii', 2)
    };
    self.socket.imei = deviceInfo.imei;
    cb(null, deviceInfo);
}

MsgServices.prototype.decodePeriodicMessage = function(cb){
    var self = this;
    if(!self.socket.imei){
      cb("INVALID_MSG_SEQ | NOT_REG", null);
      return;
    }

    var msg = {
      msgType : 'PERIODIC_MSG',
      msg_seq_id : self.rawData.toString('hex', 9, 10),
      Timestamp : new Date(hexToDec(self.rawData.toString('hex', 10, 18))),
      imei : self.socket.imei,
      Latitude : utilServices.getLatitudeFromHex.apply(self),
      Longitude: utilServices.getLongitudeFromHex.apply(self)
    }
    cb(null, msg);
}

MsgServices.prototype.validateDevice = function(decodedData, cb){
  cb(null, decodedData)
}

MsgServices.prototype.acknowledgeToDevice = function(decodedData, cb){
  var self = this;
    if(decodedData.msgType === 'DEV_SELF_REG_MSG'){
      self.socket.write(Buffer.alloc(1,'01','hex'));
    }else{
        self.socket.write(Buffer.alloc(4,'000000'+decodedData.msg_seq_id,'hex'));
    }

  cb(null, decodedData)
}

MsgServices.prototype.pushToCloud = function(decodedData, cb){
	
		  if(decodedData.msgType === 'DEV_SELF_REG_MSG')
		  {
			cb(null, decodedData)
		  }
		  else{
			  console.log('Inserting Rows...')
			  console.log(decodedData.imei.toString());
		  console.log(decodedData.Latitude);
		  console.log(decodedData.Longitude);
		  console.log(JSON.stringify(decodedData.Timestamp));
			    request = new Request(
        "INSERT INTO [dbo].[GPS_data]([TrackerId],[Latitude],[Longitude],[Timestamp]) VALUES(@TrackerId, @Latitude, @Longitude, @Timestamp);",
        function(err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' row(s) inserted');
           cb(null, decodedData)
        }});
    request.addParameter('TrackerId', TYPES.NVarChar, decodedData.imei.toString());
    request.addParameter('Latitude',  TYPES.Float, decodedData.Latitude);
	request.addParameter('Longitude', TYPES.Float, decodedData.Longitude);
    request.addParameter('Timestamp', TYPES.DateTime, decodedData.Timestamp);

    // Execute SQL statement
    connection.execSql(request);
}

}
/*MsgServices.prototype.deletefromCloud = function(decodedData, cb){

		  if(decodedData.msgType === 'DEV_SELF_REG_MSG')
		  {
			cb(null, decodedData)
		  }
		  else{
			  console.log('Deleting Rows...')
			    request = new Request(
        "DELETE FROM [dbo].[GPS_Data] WHERE id<(select max(id)-100  FROM [dbo].[GPS_Data])",
        function(err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' row(s) deleted');
           cb(null, decodedData)
        }});
    // Execute SQL statement
    connection.execSql(request);

		}
}*/


module.exports = {
  dataHandler : dataHandler
};
