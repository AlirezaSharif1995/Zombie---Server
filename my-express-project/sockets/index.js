// sockets/index.js
const chatSocket = require('./chatSocket');
const privateMessageSocket = require('./privateMessageSocket');

module.exports = {
  setupChatSocket: chatSocket,
  setupPrivateMessageSocket: privateMessageSocket
};
