module.exports = function(io) {
    const connectedUsers = {};
  
    io.on('connection', (socket) => {
  
      socket.on('userConnected', (id) => {
        console.log(`${id} joined the chat`);
        connectedUsers[id] = socket.id;
        io.emit('userJoined', `${id} joined the chat`);
      });
  
      socket.on('privateMessage', async (sender, receiver, message) => {
        try {
          if (connectedUsers[receiver]) {
            console.log(`${sender} to ${receiver} : ${message}`);
            io.to(connectedUsers[receiver]).emit('privateMessage', `${sender} : ${message}`);
          } else {
            console.log('Receiver is not online');
          }
        } catch (error) {
          console.error('Error sending private message:', error);
        }
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  };
  