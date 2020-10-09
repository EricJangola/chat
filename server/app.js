const server = require('net').createServer();  
let counter = 0;  
let sockets = {};
let nickNames = [];

function timestamp() {  
  const now = new Date();
  return `${now.getHours()}: ${now.getMinutes()}`;
}

server.on('connection', socket => {  
  socket.id = counter++;

  console.log('A client is connected');
  socket.write(JSON.stringify({
      timestamp: timestamp(),
      message: 'Por favor selecione seu apelido: ',
      id: socket.id
    }
));

  socket.on('data', data => {
        console.log(data)
        const d = JSON.parse(data)
        console.log("received:", d.message)
        const message = d.message
        
        if(!sockets[socket.id]) {

        //Validando apelido
        const isValid = validNickName(message.toString().trim())
        console.log(isValid)
        if(isValid) {
            socket.name = message.toString().trim();
            nickNames.push(socket.name)
            socket.write(writeMessage(socket.id, `Bem vindo ${socket.name}!\n`));
            sockets[socket.id] = socket;
        } else {
            socket.write(writeMessage(socket.id, `Apelido em uso, selecione um novo apelido!\n`));
        }
    } else {
        //Broadcast de mensagem para cada socket
        Object.entries(sockets).forEach(([key, cs]) => {
            if(socket.id == key) return;
            cs.write(writeMessage(timestamp(), `${socket.name}: ${message}`, socket.id));
            //cs.write(message);
          });
    }   
  });

  socket.on('end', () => {
    delete sockets[sockets.id];
    console.log('Client disconnected');
  })
});

function writeMessage(id, message) {
    return JSON.stringify({
        timestamp: timestamp(),
        message,
        id
      }
    )
}

function validNickName(message) {
    return !nickNames.find(element => element == message)
}

server.listen(8000, () => console.log('Server bound'));  