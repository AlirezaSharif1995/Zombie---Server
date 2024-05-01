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

  const privateMessages = {};

  
  // Listen for "userConnected" event
  socket.on('userConnected', (username) => {
    console.log(username);
    connectedUsers[socket.username] = username;
    io.emit('userJoined', `${username} joined the chat`);
  });

  socket.on('privateMessage', async ({ sender, receiver, message }) => {

    try {
        // Save the message to the database
        //const newMessage = new Message({ sender, receiver, message });
        //await newMessage.save();

        // Check if the receiver is connected
        if (connectedUsers[receiver]) {
            // Emit the private message to the receiver
            io.to(connectedUsers[receiver]).emit('privateMessage', { sender, message });
        }
    } catch (error) {
        console.error('Error saving message:', error);
    }
    
});

  // Listen for chat messages
  socket.on('chatMessage', (message) => {
    const username = connectedUsers[socket.username];
    io.emit('message', `${username}: ${message}`);
  });
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
