
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = require('./config.js')


var connection = new Connection(config);
connection.on('connect', function(err) {
     if (err){
          console.log(err)
      }
     else{
   	 }
});


var query = function(query, callback){
      var arr = [];
      var request = new Request(query,
        function(err, rowCount, rows){
          if(err){
               console.log(err);
		  cb(err,null);//added
          }else if(rowCount == 0){
                   console.log(rowCount + ' row(s) returned from ALERT PROCESS TABLE');
		 //  connection.close();
            }
            else{
              console.log(rowCount + ' row(s) returned from ALERT PROCESS TABLE');
             // connection.close();
              callback(err,arr);
          }
      });

      request.on('row', function(columns) {
        var obj = {}
        columns.forEach(function(column) {
          obj[column.metadata.colName] = column.value;
        });
        arr.push(obj);
      });
      request.on('requestCompleted', function () { });
      connection.execSql(request);
}

/*var updateTable = function(query, cb){
    var request = new Request(query,cb);
    connection.execSql(request);
   // connection.close();
}
var updategeocoding = function(query, cb){
    var request = new Request(query,cb);
    connection.execSql(request);
}*/

var updateTable = function(query, cb){
    var request = new Request(query,
      function(err, rowCount, rows){
        if(err){
             console.log(err);
             cb(err,null);
        }
          else{
            console.log(rowCount + ' row(s) updated from ALERT PROCESS TABLE');
            cb(err,rowCount);
        }
    });
    connection.execSql(request);
 }

module.exports = {
  'query': query,
  'updateTable' : updateTable
}
