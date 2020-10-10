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
            sendToAllExcept(socket, `${socket.name} se juntou ao #general\n`, true)
        } else {
            socket.write(writeMessage(socket.id, `Apelido em uso, selecione um novo apelido!\n`));
        }
    } else {
        //Broadcast de mensagem para cada socket
        if(private) {
            const sender = socket
            Object.entries(sockets).forEach(([key, socket, cs]) => {
              if(socket.name.toString() == private ) { 
                socket.write(writeMessage(socket.id, `${sender.name} em privado: ${message.split(' ').splice(2).join(' ')}`)); 
                return
              }
            })
         } else {
           sendToAllExcept(socket, message, false)
         }
    }   
  });

  socket.on('end', () => {
    delete sockets[socket.id];
    removeNickname(socket.name);

    //Mandando mensagem sobre à saida do usuario
    sendToAllExcept(socket, `Usuario ${socket.name} saiu da sala.`, true)

    console.log('Client disconnected')
  })
});

function writeMessage(id, message) {
    return JSON.stringify({
        message,
        id
      }
    )
}

function sendToAllExcept(socketSender, message, serverMessage = false) {
  Object.entries(sockets).forEach(([key, socket]) => {
    if(socketSender && socketSender.id != key) {
      socket.write(writeMessage(socketSender.id, `${serverMessage? '' : socketSender.name}: ${message}`));
    }
  });
}

function validNickName(name) {
    return !nickNames.find(element => element == name)
}

function removeNickname(name) {
  const i = nickNames.findIndex(element => element == name)
  nickNames.splice(i)
}

server.listen(process.env.CHAT_PORT || 3000, () => console.log('Server bound'));  