/*NPM Modules*/
var lo_ = require('lodash');
var async = require('async')
var CronJob = require('cron').CronJob;
var geobing = require('geobing');

/* System Modules*/
var blockchainServices = require('./blockchain_services.js');
var dbServices = require('./db_services.js');
var notificationservices = require('./notification_services.js');
/*This function is scheduled and invoked by cron scheduler*/
var main = function(){
    dbServices.query("SELECT distinct a.[ID],a.[ShipmentID],a.[GatewayID],a.[BeaconID],a.[Temperature],a.[Humidity],a.[AlertType],a.[LocationLattitude],a.[LocationLongitude],a.[Status],a.[TimeStamp],a.[ShipmasterID],a.[AlertStartTime],a.[AlertEndTime],a.[TemperatureAlert],a.[ShockAlert],a.[HumidityAlert],a.[TamperAlert],a.[BlockChainStatus],b.[ObjectId],b.[ObjectType],c.[ObjectId] as pallet FROM [dbo].[Alert_Process] a INNER JOIN [dbo].[Beacon_Object_Info] b on a.[BeaconID]=b.[BeaconID] INNER JOIN [dbo].[VW_Gateway_Pallet_ShipmentAssociation] c on a.[ShipmentID]=c.[ShipmentID] WHERE (a.BLOCKCHAINSTATUS IS NULL OR a.BLOCKCHAINSTATUS = 'alertinprocess' OR a.BLOCKCHAINSTATUS = '') and a.[ShipmasterID]=b.[ShipmasterID]", function(e, data){
      if(e){
        console.log(e);
        return;
      }else{
	processData(data);  //Array of json objects belongs to Alert Process table
      }

    })
}

/*Cron Scheduler*/
setTimeout(function () {
  new CronJob('*/30 * * * * *', function() {
    main()
  }, null, true, 'America/Los_Angeles');
}, 10000);

var processData = function(data){
  var _tempArr1 = [];
  async.eachSeries(data, function(item, cb){dataIterator(item, _tempArr1, cb)}, function(e){
    if(e){
      console.log(e); //Error in processing Data
      return;
    }
    blockchainServices.makeTxn(_tempArr1, function(err, status){
      console.log("_Txn Process Completed");
    });
  });
}

var dataIterator = function(data, _tempArr1, iterCB){
    if(data['BlockChainStatus'] === null || data['BlockChainStatus'] === "") {
	async.series([
        function(cb){ data.TemperatureAlert ? pushObjToArray( data, "Temperature",  _tempArr1, cb ) : cb(null) },
        function(cb){ data.HumidityAlert ? pushObjToArray( data, "Humidity",  _tempArr1, cb ) : cb(null) },
        function(cb){data.ShockAlert ? pushObjToArray( data, "Shock",  _tempArr1, cb ) : cb(null)},
        function(cb){data.TamperAlert ? pushObjToArray( data, "Tamper",  _tempArr1, cb ) : cb(null)},
	function(cb){geoCodeLocation(data, cb)}
      ], function(err, res){
        //TODO Update to Alert Process Table
	    dbServices.updateTable("UPDATE [dbo].[Alert_Process] SET [BLOCKCHAINSTATUS] = 'alertinprocess', [ALERTLOCATION]='"+res[4]+"' WHERE ID = '"+data.ID+"';", function(e, affectedRows){
            if(e){
              iterCB(e, null);  // Entire iteration operation will break if error occurs in db process
            }else{
              iterCB(null, affectedRows)
            }
        })
      });
    }else if( data['BlockChainStatus'] && (data['BlockChainStatus'].trim().toUpperCase()) == 'ALERTINPROCESS'){
      if(data.Status && (data.Status.trim().toUpperCase() == 'CLOSED')){
        async.series([
          function(cb){ data.TemperatureAlert ? pushObjToArray( data, "Temperature",  _tempArr1, cb ) : cb(null) },
          function(cb){ data.HumidityAlert ? pushObjToArray( data, "Humidity",  _tempArr1, cb ) : cb(null) },
          function(cb){data.ShockAlert ? pushObjToArray( data, "Shock",  _tempArr1, cb ) : cb(null)},
          function(cb){data.TamperAlert ? pushObjToArray( data, "Tamper",  _tempArr1, cb ) : cb(null)}
        ], function(err, res){
          dbServices.updateTable("UPDATE [dbo].[Alert_Process] SET [BLOCKCHAINSTATUS] = 'alertclosed' WHERE ID = '"+data.ID+"';", function(e, affectedRows){
            if(e){
              iterCB(e, null);  // Entire iteration operation will break if error occurs in db process
            }else{
              iterCB(null, affectedRows)
            }
        })
      });

      }else{
        console.log('Alert still in progress');
        iterCB(null, null);
     return;
      }
    }
	
}

var pushObjToArray = function(data, alertType, tempArr, cb){
  async.parallel({
    "Shipment_ID" : function(_cb){ _cb(null,  data.ShipmentID ) },
    "Beacon_ID" : function(_cb){ _cb(null, data.BeaconID ) },
    "Gateway_ID" : function(_cb){ _cb(null, data.GatewayID ) },
    "Object_ID" : function(_cb){ _cb(null, data.ObjectId ) },
    "Pallet_ID" : function(_cb){ _cb(null, data.pallet ) },
    "Object_Type" : function(_cb){ _cb(null, data.ObjectType ) },
    "Alert_Status" : function(_cb){ _cb(null, data.Status ) },
    "Alert_Type" : function(_cb){ _cb(null, alertType ) },
    "Alert_Value" : function(_cb){ _cb(null, data[alertType] || 1 ) },  //TODO check if temp ==0 & Humidity ==0
    "Alert_Lat": function(_cb){ _cb(null, data.LocationLattitude ) },
    "Alert_Long" : function(_cb){ _cb(null, data.LocationLongitude ) },
    "Alert_Loc" : function(_cb){ geoCodeLocation(data, _cb) },
    "Alert_Start_Time" : function(_cb){ _cb(null, data.AlertStartTime ) },
    "Alert_End_Time" : function(_cb){ _cb(null, data.AlertEndTime || ''  ) },
  }, function(err, results) {
      tempArr.push(results);
      cb(null);
  });
}

var geoCodeLocation = function(data, cb){
  if(data.LocationLattitude && data.LocationLongitude){
    geobing.setKey('Ait5cIqk1VP54uASgs8lBo5xyx3mND_ksYExmw547lKKq2RI4rCCUaHA0Ch7uBnm');   //geobing set key for bing maps
    geobing.getInfoFromCoordinates({ lat : data.LocationLattitude, lng : data.LocationLongitude }, function (err, result) {
      if(err){
        cb(null, null);
      }else{
        cb(null, (result && result.name)|| null)
      }
    });

  }else{
    cb(null, null);
  }
}

