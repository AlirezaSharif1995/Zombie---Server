const express = require('express');
const bodyParser = require('body-parser');
const registrationRouter = require('./authentication/registrationRouter');
const loginRouter = require('./authentication/LoginRouter');
const friendHandler = require('./friends/friendHandler');
const friendsChat = require('./friends/friendsChat');
const http = require('http');
const socketIo = require('socket.io');
const { setupChatSocket, setupPrivateMessageSocket, voiceChatSocket, gameManagement } = require('./sockets');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());

app.use('/api/auth/register', registrationRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/friendHandler', friendHandler);
app.use('/friends/friendsChat', friendsChat);


app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Connected successful....' });
});

const server = http.createServer(app);
const io = socketIo(server);

setupChatSocket(io);
setupPrivateMessageSocket(io);
voiceChatSocket(io);
gameManagement(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
