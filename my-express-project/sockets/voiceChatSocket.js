  module.exports = function(io) {
    io.on('connection', (socket) => {

      socket.on('voice', (data) => {
        // Broadcast the received voice data to all other clients except the sender
        //socket.broadcast.emit('voice', data);
        io.emit('voice', data);
      });
    });
  };