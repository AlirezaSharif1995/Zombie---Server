const express = require('express');
const bodyParser = require('body-parser');
const registrationRouter = require('./registrationRouter');
const loginRouter = require('./LoginRouter');
const friendHandler = require('./friendHandler');
const http = require('http');
const socketIo = require('socket.io');
const { setupChatSocket, setupPrivateMessageSocket } = require('./sockets');

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

setupChatSocket(io);
setupPrivateMessageSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
