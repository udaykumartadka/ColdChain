/* Modules */

var tcpServer = require('./TCPServer');
var msgServices = require('./MSG_Services');
tcpServer.init(msgServices.dataHandler);
