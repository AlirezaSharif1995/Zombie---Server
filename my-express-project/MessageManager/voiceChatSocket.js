  module.exports = function(io) {
    io.on('connection', (socket) => {
      connectedUsers[username] = socket.username;
  
      socket.on('call',(fromName,toName)=>{

        try {
          io.to(connectedUsers[toName]).emit('call',fromName);
          console.log(`${fromName} calling to ${toName} ...`);
        } catch (error) {
          console.log(error);
        }

      });

      socket.on('friendJoin',(fromName)=>{

        try {
          io.to(connectedUsers[fromName]).emit('friendJoin',fromName);
          console.log(`${fromName} joined call`);          
        } catch (error) {
          console.log(error);
        }

      });

      socket.on('friendLeft', (fromName) =>{

        try {
          io.to(connectedUsers[fromName]).emit('friendLeft',fromName);
          console.log(`${fromName} left call`);          
        } catch (error) {
          console.log(error);
        }
      });

      socket.on('disconnect', () => {
        const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.username);
        if (userId) {
          delete connectedUsers[userId];
          console.log(`${userId} went offline`);
          socket.broadcast.emit(`userDisconnected ${userId} left the chat`);
        }
      });

    });
  };