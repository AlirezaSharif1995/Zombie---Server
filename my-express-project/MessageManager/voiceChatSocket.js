  module.exports = function(io) {
    io.on('connection', (socket) => {

      socket.on('voice', (data) => {

        // io.emit('voice',data);

        socket.broadcast.emit('voice', data);
      });

    });
  };