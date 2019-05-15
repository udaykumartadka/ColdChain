var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var dns = require('dns');
var Web3 = require('web3');
var moment = require('moment');
var Promise = require('promise');

/*
 * Parameters
 */
var listenPort           = process.argv[2]
var gethIPCPath          = process.argv[3];
var coinbase             = process.argv[4];
var coinbasePw           = process.argv[5];
var bmNodePrefix         = process.argv[6];
var numBlockmakers       = process.argv[7];
var vnNodePrefix         = process.argv[8];
var numVoters            = process.argv[9];
var obNodePrefix         = process.argv[10];
var numObservers         = process.argv[11];
var cakeshopFqdn         = process.argv[12];
var cakeshopStartingPort = process.argv[13];

/*
 * Constants
 */
var gethRPCPort = "8545";
var refreshInterval = 10000;

var app = express();
var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
var quorumRegistryABI = JSON.parse('[{"constant":false,"inputs":[{"name":"publicKey","type":"string"},{"name":"ipAddress","type":"string"},{"name":"hostName","type":"string"}],"name":"addNode","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNodeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getNode","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"}]');
var quorumRegistry = web3IPC.eth.contract(quorumRegistryABI).at("0x2048000000000000000000000000000000000000");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: coinbasePw,
  resave: false,
  saveUninitialized: true
}))

var nodeInfoArray = [];
var timeStamp;

function getNodeInfo(hostName, nodeNum) {
  var cakeShopURL = "http://" + cakeshopFqdn + ":" + (parseInt(cakeshopStartingPort) + parseInt(nodeNum)) + "/cakeshop";
  return new Promise(function (resolve, reject){
    try {
      var web3RPC = new Web3(new Web3.providers.HttpProvider("http://" + hostName + ":" + gethRPCPort));
    }
    catch(err) {
      console.log(err);
    }
    var promiseArray = [];
    promiseArray.push(new Promise(function(resolve, reject) {
      web3RPC.net.getPeerCount(function(error, result) {
        if(!error)
        {
          resolve(result);
        }
        else {
          resolve("Not running");
        }
      });
    }));
    promiseArray.push(new Promise(function(resolve, reject) {
      web3RPC.eth.getBlockNumber(function(error, result) {
        if(!error)
        {
          resolve(result);
        }
        else {
          resolve("Not running");
        }
      });
    }));
    promiseArray.push(new Promise(function(resolve, reject) {
      quorumRegistry.getNode(nodeNum, function(error, result) {
        if(!error)
        {
          resolve(result);
        }
        else {
          resolve("Node not registered");
        }
      });
    }));

    Promise.all(promiseArray).then(function(values){
      var peerCount = values[0];
      var blockNumber = values[1];
      var nodeRegistryEntry = values[2];
      console.log(JSON.stringify(nodeRegistryEntry));
      var nodeInfo = {hostname: hostName, cakeshopurl: cakeShopURL, peercount: peerCount, blocknumber: blockNumber, publicKey: nodeRegistryEntry[0]};
      resolve(nodeInfo);
    });
  });
}

function getNodesInfo() {
  console.time("getNodesInfo");
  var promiseArray = [];

  for(var i = 0; i < numBlockmakers; i++) {
    promiseArray.push(getNodeInfo(bmNodePrefix.concat(i), i));
  }
  for(var i = 0; i < numVoters; i++) {
    promiseArray.push(getNodeInfo(vnNodePrefix.concat(i), i + parseInt(numBlockmakers)));
  }
  for(var i = 0; i < numObservers; i++) {
    promiseArray.push(getNodeInfo(obNodePrefix.concat(i), i + parseInt(numBlockmakers) + parseInt(numVoters)));
  }

  Promise.all(promiseArray).then(function(values) {
    nodeInfoArray = [];
    var arrLen = values.length;
    for(var i = 0; i< arrLen; ++i) {
      nodeInfoArray.push(values[i]);
    }

    timeStamp = moment().format('h:mm:ss A UTC,  MMM Do YYYY');
    console.timeEnd("getNodesInfo");
    // Schedule next refresh
    setTimeout(getNodesInfo, refreshInterval);
  });
}

// Kick-off refresh cycle
getNodesInfo();

// Check if we've mined a block yet
function minedABlock () {
  var result = nodeInfoArray.filter(function(item) {
    return item.blocknumber > 0;
  });

  return result.length > 0;
}

app.get('/', function (req, res) {
  // Check if the IPC endpoint is up and running
  if(fs.existsSync(gethIPCPath)) {
    var hasNodeRows = nodeInfoArray.length > 0;
    var data = { isSent: req.session.isSent, error: req.session.error, hasNodeRows: hasNodeRows, nodeRows: nodeInfoArray, minedABlock: minedABlock(), timestamp: timeStamp, refreshinterval: (refreshInterval/1000) };
    req.session.isSent = false;
    req.session.error = false;

    res.render('etheradmin', data);
  }
  else {
    res.render('etherstartup');
  }
});

app.post('/', function(req, res) {
  var address = req.body.etherAddress;

  if(web3IPC.isAddress(address)) {
    web3IPC.personal.unlockAccount(coinbase, coinbasePw, function(err, res) {
      console.log(res);
      web3IPC.eth.sendTransaction({from: coinbase, to: address, value: web3IPC.toWei(1000, 'ether')}, function(err, res){ console.log(address)});
    });

    req.session.isSent = true;
  } else {
    req.session.error = "Not a valid Ethereum address";
  }

  res.redirect('/');
});

app.listen(listenPort, function () {
  console.log('Admin webserver listening on port ' + listenPort);
});
