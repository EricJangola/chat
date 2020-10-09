const server = require('net').createServer();  
let counter = 0;  
let sockets = {};
let nicknames = {};

function timestamp() {  
  const now = new Date();
  return `${now.getHours()}: ${now.getMinutes()}`;
}

server.on('connection', socket => {  
  socket.id = counter++;

  console.log('A client is connected');
  socket.write('Please type your name: ');

  socket.on('data', data => {
    console.log("received:", data)

    if(!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}!\n`);
      sockets[socket.id] = socket;
      return;
    }

    Object.entries(sockets).forEach(([key, cs]) => {
      if(socket.id == key) return;
      cs.write(`${socket.name} ${timestamp()}: `);
      cs.write(data);
    });
  });

  socket.on('end', () => {
    delete sockets[sockets.id];
    console.log('Client disconnected');
  })
});

server.listen(8000, () => console.log('Server bound'));  