const { Socket } = require('dgram');
const net = require('net');

let server
let counter = 0;  
let sockets = {};
let nickNames = [];
let rooms = ['general']
''
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
              const {message, private, help, createRoom, room} = JSON.parse(data)
              console.log("received:", message)
              
              if(!sockets[socket.id]) {
      
              
              //Validando apelido
              validNickName(message.toString().trim(), isValid => {
                  if(isValid) {
                    socket.name = message.toString().trim();
                    nickNames.push(socket.name)
                    writeMessage(socket.id, `Bem vindo ${socket.name}! ao #general`, message => {
                      //Adicionando na linha de sockets
                      socket.room = 'general'
                      sockets[socket.id] = socket;

                      socket.write(message)

                      //Enviando mensagem com comandos para o novo usuario
                      sendHelpMessage(socket, () => {

                        //Enviando mensagem à todos usuarios do novo usuario
                        sendMessage(socket, `${socket.name} se juntou ao #general\n`, true, () =>{})  
                      });
                    })
                } else {
                    //Se o apelido não for válido, enviar mensagem requerindo um novo
                    writeMessage(socket.id, `Apelido em uso, selecione um novo apelido!\n`, message => {
                      socket.write(socket.id, message)
                    });
                }
              })
          } else {
              //TODO: refactor com switch case e funções separadas para cada ação
              //Mensagem para unico cliente
              if(private) {
                  const sender = socket
                  Object.entries(sockets).forEach(([key, socket, cs]) => {
                    if(socket.name.toString() == private ) { 
                      writeMessage(socket.id, `${sender.name} em privado: ${message.split(' ').splice(2).join(' ')}`, res => {
                        socket.write(res)
                      }); 
                    }
                  })
               } else if (help) {
                  // Usuario pedindo comandos 
                  sendHelpMessage(socket, ()=>{})
               } else if (createRoom) {
                  // add sala
                  addRoom(createRoom, (res, err) => {
                    if(err) {
                      writeMessage(socket.id, `Sala já existente'`, message => {
                        socket.write(message)
                      })
                    } else { 
                      // broadcast de mensagem criada com msg pro criador 
                      sendMessage(socket, `Sala ${createRoom} criada com sucesso por ${socket.name}`, true, res => { }) 
                      writeMessage(socket.id, `Sala ${createRoom} criada com sucesso`, (res) => {
                        socket.write(res)
                      })
                    }
                  })
                } else if (room) {
                  //usuario mudando de sala
                  validRoom(room, res => {
                    let mess = `Bem vindo à sala ${room}`
                    if(res) {
                      socket.room = room
                    } else {
                      mess = `Sala ${room} inexistente`
                    }
                    writeMessage(socket.id, mess, (res) => {
                      socket.write(res)
                    })
                  })
                }else {
                  //Mensagem para todos
                  sendMessage(socket, message, false, () => {})
               }
          }   
        });
      
        socket.on('end', () => {
          delete sockets[socket.id];
          removeNickname(socket.name, res => {
            //Mandando mensagem sobre à saida do usuario
            sendMessage(socket, `Usuario ${socket.name} saiu da sala.`, true, ()=>{
              console.log(`Client ${socket} disconnected`)
            })
          });         
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
    writeMessage(socket.id, `Segue a lista de comandos existentes:
  -mensagem privada: /p nomeUsuario mensagem. Ex: /p take ola, como está?
  -sair do chat: /exit
  -ajuda: /help assim verá essa mensagem novamente`, message => {
    callback(socket.write(message))
  })
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
      writeMessage(socketSender.id, `${serverMessage? '' : socketSender.name}: ${message}`, res =>{
        socket.write(res)
      });
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

addRoom = (room, callback) => {
  validRoom(rooms.find(element => element == room), res => {
    const exists = res
    if(exists) callback(null, exists)
    else callback(rooms.push(room))
  })
}

removeRoom = (room, callback) => {
  const i = rooms.findIndex(element => element == room)
  callback(rooms.splice(i))
}

validRoom = (room, callback) => {
  callback(rooms.find(element => element == room))
}

module.exports = { init, server, removeNickname, validNickName, sendMessage, writeMessage, closeServer, addRoom, removeRoom }