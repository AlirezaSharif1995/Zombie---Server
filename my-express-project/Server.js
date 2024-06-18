const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const { registrationRouter, loginRouter } = require('./authentication');
const { friendHandler, friendsChat } = require('./friends');
const { setupPrivateMessageSocket, voiceChatSocket, chatRequest } = require('./MessageManager');
const socketGateway = require('./sockets/socketGateway');
const testSocket = require('./sockets/testSocket');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());
app.use('/auth/register', registrationRouter);
app.use('/auth/login', loginRouter);
app.use('/friendHandler', friendHandler);
app.use('/friendsChat', friendsChat);
app.use('/socketGateway', socketGateway);
app.use('/chatRequest', chatRequest);

const server = http.createServer(app);
const io = socketIo(server);

setupPrivateMessageSocket(io);
voiceChatSocket(io);
testSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
