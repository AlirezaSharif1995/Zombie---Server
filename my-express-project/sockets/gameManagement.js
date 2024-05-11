let gameState = {
    players: {},
    zombies: {}
}

const zones = {
    zone1: {
        zombies: [], 
    },
    zone2: {
        zombies: [],
    },
    zone3: {
        zombies: [],
    }
}


function handlePlayer(data, socket) {
    const { playerId } = data;
    
    if (gameState.players[playerId]) {

        gameState.players[playerId].position = data.position;
        gameState.players[playerId].rotation = data.rotation;
        gameState.players[playerId].animationCode = data.animationCode;
        gameState.players[playerId].health = data.health;

    } else {
        
        gameState.players[playerId] = {
            position: data.position,
            rotation: data.rotation,
            animationCode: data.animationCode,
            health: data.health,
        };
         }

        emitEventToAllExcept(socket, 'playerMoved', {
            playerId,
            position: data.position,
            rotation: data.rotation,
            animationCode: data.animationCode,
            health: data.health
        });     
}

function handlePlayerShooting(data, socket) {

}

function handleZombieUpdate(zoneName, socket) {
    const zone = zones[zoneName];
    const zoneZombies = zone.zombies.map(zombie => ({
        position: zombie.position,
        rotation: zombie.rotation,
        animationCode: zombie.animationCode
    }));
    socket.emit('zoneZombieUpdates', zoneZombies);
}

function handleMessage(message, socket) {
    try {
        const data = JSON.parse(message);
        const messageType = data.type;

        switch (messageType) {
            case 'playerMove':
                handlePlayer(data,socket);
                break;
            case 'zombieUpdate':
                handleZombieUpdate(data,socket);
                break;
            case 'playerShooting':
                handlePlayerShooting(data,socket);
                break;
            default:
                console.error('Unknown message type:', messageType);
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
}

module.exports = function(io) {
   

io.on('connection', (socket) => {

    console.log(` joined the chat`);
  
    socket.on('startGame',(username)=>{
  
      const playerId = 'player_' + Math.random().toString(36).substr(2, 9);
      socket.playerId = playerId;
      console.log('New player connected:', playerId);
      socket.emit('playerJoined',username);
    });
    
    socket.on('message', async (obj) => {
          handleMessage(obj,socket);
      });
    
    socket.on('close', () => {
          console.log('Player disconnected:', playerId);
          delete gameState.players[playerId];
      });
    });
}

function emitCurrentGameState(playerSocket) {

    const gameStateData = {
        players: gameState.players,
    };

    playerSocket.emit('currentGameState', gameStateData);
}

function emitEventToAllExcept(senderSocket, eventName, eventData) {
    
    senderSocket.clients.forEach((client) => {
        if (client !== senderSocket) {
            client.emit(eventName, eventData);
        }
    });

}