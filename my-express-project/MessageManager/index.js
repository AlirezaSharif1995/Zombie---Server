
const chatSocket = require('./chatSocket');
const privateMessageSocket = require('./privateMessageSocket');
const voiceChatSocket = require('./voiceChatSocket');

module.exports = {
  setupChatSocket: chatSocket,
  setupPrivateMessageSocket: privateMessageSocket,
  voiceChatSocket: voiceChatSocket
};
