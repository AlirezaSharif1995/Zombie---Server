  module.exports = function(io) {
    io.on('connection', (socket) => { 
      
      socket.on('signal', (data) => {
        io.to(data.to).emit('signal', data);
    });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
  
    });
  };