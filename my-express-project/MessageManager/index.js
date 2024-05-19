const privateMessageSocket = require('./privateMessageSocket');
const voiceChatSocket = require('./voiceChatSocket');

module.exports = {
  setupPrivateMessageSocket: privateMessageSocket,
  voiceChatSocket: voiceChatSocket
};
