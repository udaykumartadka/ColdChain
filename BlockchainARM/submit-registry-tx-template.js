a = eth.accounts[0];
web3.eth.defaultAccount = a;

// Get the start time, and timeout after some amount of milliseconds
d = new Date();
startTime = d.getTime();
timeout = 10 * 60 * 1000; // Timeout set for ten minutes

abi = JSON.parse('[{"constant":false,"inputs":[{"name":"publicKey","type":"string"},{"name":"ipAddress","type":"string"},{"name":"hostName","type":"string"}],"name":"addNode","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNodeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getNode","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"}]');
contract = eth.contract(abi).at("0x2048000000000000000000000000000000000000");
personal.unlockAccount(eth.accounts[0], "#PASSWORD", 99999);
nonce = #NONCE;
nodeCount = contract.getNodeCount();
while (nodeCount < nonce) {
    currentTime = d.getTime();
    if ((currentTime - startTime) >= timeout) {
        throw 'Timeout reached';
    }
    admin.sleepBlocks(1);
    nodeCount = contract.getNodeCount();
}
contract.addNode("#PUBKEY", "#IPADDRESS", "#HOSTNAME", {from: eth.accounts[0], gas: 4000000, nonce: nonce});
