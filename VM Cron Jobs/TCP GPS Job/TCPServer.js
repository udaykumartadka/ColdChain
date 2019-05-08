var config = require('./application_config');
const net = require('net');


var init = function(cb){
    console.log("INIT", config.tcp);
    const server = net.createServer((socket) => {
      socket.on('data', function(data){ cb(socket, data)});
    });
    server.on('error', (err) => {console.log(err)});
    server.listen(config.tcp.PORT, () => { console.log("TCP listening @ ", config.tcp.PORT) })
};

module.exports = { init : init};
