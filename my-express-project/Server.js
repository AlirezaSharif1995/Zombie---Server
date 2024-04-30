const express = require('express');
const bodyParser = require('body-parser');
const registrationRouter = require('./registrationRouter');
const loginRouter = require('./LoginRouter');
const friendHandler = require('./friendHandler');
const http = require('http'); // Import http module
const socketIo = require('socket.io');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());

app.use('/api/auth/register', registrationRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/friendHandler', friendHandler);

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Connected successful....' });
});


const server = http.createServer(app);

const io = socketIo(server);
const connectedUsers = {};


io.on('connection', (socket) => {
  console.log('A user connected');

  
  // Listen for "userConnected" event
  socket.on('userConnected', (username) => {
    connectedUsers[socket.username] = username;
    io.emit('userJoined', `${username} joined the chat`);
  });

  // Listen for chat messages
  socket.on('chatMessage', (message) => {
    const username = connectedUsers[socket.id];
    io.emit('message', `${username}: ${message}`);
  });
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
