/*NPM Modules*/
var Connection = require('tedious').Connection,
  Request = require('tedious').Request,
  TYPES = require('tedious').TYPES;
var cron = require('node-cron');

/* System Modules*/
var config = require('./config.js')


/*Cron Scheduler*/
cron.schedule('*/2 * * * *', () => {

var connection = new Connection(config);
connection.on('connect', function(err) {
  if(err)
  {
    console.log(err);
  }
  else{
  var request = new Request('SP_AutoAlertProcessor',
    function(err) {
      if (err) {
        console.log(err);
      }
      console.log('Successfully started SP_AutoAlertProcessor stored procedure.');
	autoincidentupdate();
    });
  connection.callProcedure(request);
}
});
function autoincidentupdate(){
 var request = new Request('SP_AutoIncidentUpdate',
    function(err) {
      if (err) {
        console.log(err);
      }
      console.log('Successfully started SP_AutoIncidentUpdate stored procedure.');
      connection.close();
    });
  connection.callProcedure(request);

}
});
