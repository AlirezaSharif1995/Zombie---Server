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

module.exports = function (io) {

  const connectedUsers = {};

  io.on('connection', (socket) => {

    socket.on('userConnected', (id) => {
      console.log(`${id} joined the chat`);
      connectedUsers[id] = socket.id;
      socket.broadcast.emit(`userJoined ${id} joined the chat`);
    });

    socket.on('privateMessage', async (sender, receiver, message) => {
      try {
        const time = new Date();
        const timer = `${time.getHours()} , ${time.getMinutes()} , ${time.getDate()} , ${time.getMonth() + 1} , ${time.getFullYear()}`;

        await pool.query('INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)', [sender, receiver, message, timer]);

        console.log(`${sender} to ${receiver} : ${message} : ${timer}`);

        io.to(connectedUsers[receiver]).emit('privateMessage', `${sender} , ${message} , ${timer}`);

      } catch (error) {
        console.error('Error sending private message:', error);
      }
    });

    socket.on('messageRequest', async (obj) => {

      try {

        const [userId] = await pool.query('SELECT * FROM users WHERE username = ?', obj.receiver);
        const [secondUserId] = await pool.query('SELECT * FROM users WHERE username = ?', obj.sender);

        const time = new Date();
        const timer = `${time.getHours()} , ${time.getMinutes()} , ${time.getDate()} , ${time.getMonth() + 1} , ${time.getFullYear()}`;

        await pool.query('INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)', [secondUserId[0].id, userId[0].id, "Hi", timer]);

        io.emit('messageRequest', obj);

      } catch (error) {
        console.error('Error sending private message:', error);
      }
    });

    socket.on('messageAlarm', (obj) => {

      try {

        io.emit('messageAlarm', obj);

      } catch (error) {
        console.error('Error sending message alarm:', error);
      }
    });

    socket.on('disconnect', () => {
      const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
      if (userId) {
        delete connectedUsers[userId];
        console.log(`${userId} went offline`);
        socket.broadcast.emit(`userDisconnected ${userId} left the chat`);
      }
    });
  });
};
