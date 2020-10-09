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
});

client.on('data', function(data) {
    const {message, trueNickname} = JSON.parse(data)
    if(trueNickname) nickname = trueNickname
    console.log(message);
});

client.on('close', function() {
	console.log('Connection closed');
});

rl.on('line', (input) => {
    client.write(JSON.stringify({id, nickname, message: input }))
    rl.write('', { ctrl: true, name: 'u' });
    console.log(input)
  });
  
  var log = console.log;
  console.log = function () {
      var first_parameter = arguments[0];
      var other_parameters = Array.prototype.slice.call(arguments, 1);
  
      function formatConsoleDate (date) {
          var hour = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          var milliseconds = date.getMilliseconds();
  
          return '[' +
                 ((hour < 10) ? '0' + hour: hour) +
                 ':' +
                 ((minutes < 10) ? '0' + minutes: minutes) +
                 ':' +
                 ((seconds < 10) ? '0' + seconds: seconds) +
                 '.' +
                 ('00' + milliseconds).slice(-3) +
                 '] ';
      }
  
      log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
  };