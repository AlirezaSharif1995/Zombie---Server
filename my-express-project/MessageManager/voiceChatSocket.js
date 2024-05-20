  module.exports = function(io) {
    io.on('connection', (socket) => { 
      
      socket.on('voiceData', (data) => {
      socket.broadcast.emit('voiceData', data);
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
  
    });
  };