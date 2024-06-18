const privateMessageSocket = require('./privateMessageSocket');
const voiceChatSocket = require('./voiceChatSocket');
const chatRequest = require('./chatRequest');

module.exports = {
  setupPrivateMessageSocket: privateMessageSocket,
  voiceChatSocket: voiceChatSocket,
  chatRequest: chatRequest
};
