const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'zombie-City-database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
  
  module.exports = function(io) {
    io.on('connection', (socket) => {
      connectedUsers[username] = socket.username;
  
      socket.on('call',async (fromName,toName)=>{

        try {
          io.to(connectedUsers[toName]).emit('call',fromName);
          console.log(`${fromName} calling to ${toName} ...`);

          const time = new Date();
          const timer = `${time.getHours()} , ${time.getMinutes()} , ${time.getDate()} , ${time.getMonth() +1 } , ${time.getFullYear()}`;
          const randomToken = generateRandomToken();

          await pool.query('INSERT INTO callLog (Id, sender, receiver, date) VALUES (?, ?, ?, ?)', [randomToken, fromName, toName, timer]);

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

  function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}