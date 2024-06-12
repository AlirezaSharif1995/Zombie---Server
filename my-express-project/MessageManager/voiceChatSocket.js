  module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('start_chat', (audioBytes) => {
          // Handle the incoming audio bytes
          console.log('Received audio data');
          console.log(audioBytes)
  
          // Broadcast the audio data to other clients
          io.emit('audio_data', audioBytes);
          // socket.broadcast.emit('audio_data', audioBytes);
      });
    });
  };