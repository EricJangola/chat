const server = require('net').createServer();  
let counter = 0;  
let sockets = {};
let nickNames = [];

server.on('connection', socket => {  
  socket.id = counter++;

  console.log('A client is connected');
  socket.write(JSON.stringify({
      message: 'Por favor selecione seu apelido: ',
      id: socket.id
    }
));

  socket.on('data', data => {
        console.log(data)
        const {message, private} = JSON.parse(data)
        console.log("received:", message)
        
        if(!sockets[socket.id]) {

        //Validando apelido
        const isValid = validNickName(message.toString().trim())
        console.log(isValid)
        if(isValid) {
            socket.name = message.toString().trim();
            nickNames.push(socket.name)
            socket.write(writeMessage(socket.id, `Bem vindo ${socket.name}! ao #general\n`));
            sockets[socket.id] = socket;

            //Enviando mensagem à todos usuarios do novo usuario
            sendToAllExcept(socket.id, `${socket.name} se juntou ao #general\n`)
        } else {
            socket.write(writeMessage(socket.id, `Apelido em uso, selecione um novo apelido!\n`));
        }
    } else {
        //Broadcast de mensagem para cada socket
        if(private) {
            const sender = socket
            Object.entries(sockets).forEach(([key, socket, cs]) => {
              if(socket.name.toString() == private ) { 
                socket.write(writeMessage(socket.id, `${sender.name}: ${message.split(' ').splice(2).join(' ')}`)); 
                return
              }
            })
         } else {
            Object.entries(sockets).forEach(([key, cs]) => {
                if(socket.id == key) return;
                cs.write(writeMessage(socket.id, `${socket.name}: ${message}`));
                //cs.write(message);
              });
         }
    }   
  });

  socket.on('end', () => {
    delete sockets[sockets.id];
    console.log('Client disconnected');
  })
});

function writeMessage(id, message) {
    return JSON.stringify({
        message,
        id
      }
    )
}

function sendToAllExcept(socketId, message) {
  Object.entries(sockets).forEach(([key, socket]) => {
    if(socketId != key) socket.write(writeMessage(key, `${socket.name}: ${message}`));
  });
}

function validNickName(message) {
    return !nickNames.find(element => element == message)
}

server.listen(8000, () => console.log('Server bound'));  