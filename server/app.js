const server = require('http').Server();
const socketIO = require("socket.io");
const io = socketIO.listen(server);

io.sockets.on('connection', function(socket){
    console.log('Connect...');
})

server.listen(3000);