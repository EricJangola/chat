let net = require('net');
const crypto = require("crypto");
const readline = require("readline");

let nickname = ''
let client
const id = crypto.randomBytes(16).toString("hex");

init = () => {
    client = new net.Socket();

    client.connect(process.env.CHAT_PORT || 3000, process.env.CHAT_URL || '127.0.0.1', function() {
        console.log('Connected');
    });
    
    client.on('data', function(data) {
        const {message, trueNickname} = JSON.parse(data)
        if(trueNickname) nickname = trueNickname
        console.log(message);
    });
    
    client.on('close', function() {
        console.log('Desconectado');
    });
    
    client.on('error', function() {
        //TODO: tratar erros
        console.log('Ocorreu um erro inesperado')
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', (input) => {
    
    // Verificando primeiro se ele está saindo do chat 
    if(input.startsWith('/exit')) killConnection()
    else {
        const private = input.startsWith('/p ') ?  input.replace('/p ', '').split(' ')[0]: null
        sendMessage(id, nickname, input, private)
        console.log(`você:${input}`)
    }
  });
  
  let log = console.log;
  console.log = function () {
      let first_parameter = arguments[0];
      let other_parameters = Array.prototype.slice.call(arguments, 1);
  
      function formatConsoleDate (date) {
          let hour = date.getHours();
          let minutes = date.getMinutes();
          let seconds = date.getSeconds();
          let milliseconds = date.getMilliseconds();
  
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

function killConnection() {
    client.destroy()
}

//handling control + c ( desconectar cliente )
rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
  
process.on("SIGINT", function () {
    //graceful shutdown
    killConnection()
    process.exit();
});


sendMessage = (id, nickname, message, private ) => {
    client.write(JSON.stringify({id, nickname, message, private }))
}

module.exports = init