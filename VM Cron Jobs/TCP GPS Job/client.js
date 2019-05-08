const net = require('net');
let counter = 0;
const client = net.createConnection({ip : '40.76.42.243', port: 21684 }, () => {
  // 'connect' listener
  console.log('connected to server!');

      client.write( Buffer.from('000f333532303933303835363636313034', 'hex'));


});
client.on('data', (data) => {
  console.log(data);
  counter==0 &&  client.write( Buffer.from('000000000000003c080100000166a5b1dcc8002e498e0007a6d08200000000000000f00b06f00050011505c8004502740105b50000b6000042130918000043105300000100008401', 'hex'));
  counter ++
  if(counter>0){
    client.end();  
  }
});
