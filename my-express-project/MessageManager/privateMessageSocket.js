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
  
    const connectedUsers = {};
  
    io.on('connection', (socket) => {

      socket.on('userConnected', (id) => {
        console.log(`${id} joined the chat`);
        connectedUsers[id] = socket.id;
        io.emit('userJoined', `${id} joined the chat`);
      });
  
      socket.on('privateMessage', async (sender, receiver, message) => {
        try {
          const time = new Date();
          await pool.query('INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)', [sender, receiver, message, time]);

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
        console.log('User offline');
      });
    });
  };
  