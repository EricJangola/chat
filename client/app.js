let net = require('net');
const crypto = require("crypto");
const readline = require("readline");

let nickname = ''
const id = crypto.randomBytes(16).toString("hex");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client = new net.Socket();
client.connect(8000, '127.0.0.1', function() {
	console.log('Connected');
	//client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
    const {timestamp, message, id, trueNickname} = JSON.parse(data)
    if(trueNickname) nickname = trueNickname
    console.log(timestamp + ' - ' + message);
});

client.on('close', function() {
	console.log('Connection closed');
});

rl.on('line', (input) => {
    client.write(JSON.stringify({id, nickname, message: input }))
  });