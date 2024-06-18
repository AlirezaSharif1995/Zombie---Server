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

  io.on('connection', (socket) => {

    socket.on('call', async (Data) => {

      try {
        io.emit('call', Data);
        console.log("call", Data);
        //const time = new Date();
        //const timer = `${time.getHours()} , ${time.getMinutes()} , ${time.getDate()} , ${time.getMonth() + 1} , ${time.getFullYear()}`;
        //const randomToken = generateRandomToken();

        //await pool.query('INSERT INTO callLog (Id, sender, receiver, date) VALUES (?, ?, ?, ?)', [randomToken, fromName, toName, timer]);

      } catch (error) {
        console.log(error);
      }

    });

    socket.on('friendJoin', async (Data) => {

      try {
        io.emit('friendJoin', Data);
        console.log("friendJoin", Data);
      } catch (error) {
        console.log(error);
      }

    });

    socket.on('friendLeft', async (Data) => {

      try {
        io.emit('friendLeft', Data);
        console.log("friendLeft", Data);
      } catch (error) {
        console.log(error);
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