const net = require('net');

let server
let counter = 0;  
let sockets = {};
let nickNames = [];

init = (callback) => {
    server = net.createServer()
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
              
              //desconstruindo objeto de data
              const {message, private, help} = JSON.parse(data)
              
              console.log("received:", message)
              
              if(!sockets[socket.id]) {
      
              //Validando apelido
              const isValid = validNickName(message.toString().trim())
              
              if(isValid) {
                  socket.name = message.toString().trim();
                  nickNames.push(socket.name)
                  socket.write(writeMessage(socket.id, `Bem vindo ${socket.name}! ao #general`))
                  sendHelpMessage(socket);
                  sockets[socket.id] = socket;
      
                  //Enviando mensagem à todos usuarios do novo usuario
                  sendMessage(socket, `${socket.name} se juntou ao #general\n`, true)
              } else {
                  socket.write(writeMessage(socket.id, `Apelido em uso, selecione um novo apelido!\n`));
              }
          } else {
              //Broadcast de mensagem para unico cliente
              if(private) {
                  const sender = socket
                  
                  Object.entries(sockets).forEach(([key, socket, cs]) => {
                    if(socket.name.toString() == private ) { 
                      socket.write(writeMessage(socket.id, `${sender.name} em privado: ${message.split(' ').splice(2).join(' ')}`)); 
                      return
                    }
                  })
               } else if (help) {
                sendHelpMessage(socket)
               }
                else {
                  sendMessage(socket, message, false)
               }
          }   
        });
      
        socket.on('end', () => {
          delete sockets[socket.id];
          removeNickname(socket.name);
      
          //Mandando mensagem sobre à saida do usuario
          sendMessage(socket, `Usuario ${socket.name} saiu da sala.`, true)
      
          console.log('Client disconnected')
        })
      });
      
    server.listen(process.env.CHAT_PORT || 3000, () => console.log('Server bound'));
    
    //retornando caso o servidor suba sem erros
    callback(true)
}

closeServer = (callback) => {
  callback(server.close())
}

sendHelpMessage = (socket, callback) => {
  callback(socket.write(writeMessage(socket.id, `Segue a lista de comandos existentes:
-mensagem privada: /p nomeUsuario mensagem. Ex: /p take ola, como está?
-sair do chat: /exit
-ajuda: /help assim verá essa mensagem novamente`)))
}

writeMessage = (id, message, callback) => {
    callback(JSON.stringify({
        message,
        id
      }
    ))
}

sendMessage = (socketSender, message, serverMessage = false, callback) => {
  Object.entries(sockets).forEach(([key, socket]) => {
    if(socketSender && socketSender.id != key) {
      socket.write(writeMessage(socketSender.id, `${serverMessage? '' : socketSender.name}: ${message}`));
    }
  });
  callback(true)
}

validNickName = (name, callback) => {
    callback(!nickNames.find(element => element == name))
}

removeNickname = (name, callback) => {
  const i = nickNames.findIndex(element => element == name)
  callback(nickNames.splice(i))
}

module.exports = { init, server, removeNickname, validNickName, sendMessage, writeMessage, closeServer }