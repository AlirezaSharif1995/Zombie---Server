
const chatSocket = require('./chatSocket');
const privateMessageSocket = require('./privateMessageSocket');
const voiceChatSocket = require('./voiceChatSocket');
const gameManagement = require('./gameManagement');

module.exports = {
  setupChatSocket: chatSocket,
  setupPrivateMessageSocket: privateMessageSocket,
  voiceChatSocket: voiceChatSocket,
  gameManagement: gameManagement
};
