  module.exports = function(io) {
    io.on('connection', (socket) => {
      // Event handler for receiving voice data from a client
      socket.on('voice', (data) => {
        // Broadcast the received voice data to all other clients except the sender
        //socket.broadcast.emit('voice', data);
        io.emit('voice', data);
      });
    });
  };