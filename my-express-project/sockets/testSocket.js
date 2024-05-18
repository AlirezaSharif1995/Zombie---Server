
let gameState = {
    players: {},
    zombies: {}
}


function handlePlayer(data, socket, io) {

    const { playerId } = data;

    if (gameState.players[playerId]) {

        gameState.players[playerId].posX = data.posX;
        gameState.players[playerId].posY = data.posY;
        gameState.players[playerId].posZ = data.posZ;
        gameState.players[playerId].rotY = data.rotY;
        gameState.players[playerId].animationCode = data.animationCode;
        gameState.players[playerId].health = data.health;

    } else {

        gameState.players[playerId] = {
            username: data.username,
            characterID: data.characterID,
            posX: data.posX,
            posY: data.posY,
            posZ: data.posZ,
            rotY: data.rotY,
            animationCode: data.animationCode,
            health: data.health,
        };
    }
    emitEventToAllExcept('playerMoved', {
        username: data.username,
        posX: data.posX,
        posY: data.posY,
        posZ: data.posZ,
        rotX: data.rotX,
        rotY: data.rotY,
        rotZ: data.rotZ,
        animationCode: data.animationCode,
        health: data.health
    }, io);
}

function handleZombieUpdate(data, socket, io) {

    const { ZombieId } = data;

    if (gameState.zombies[ZombieId]) {

        gameState.zombies[ZombieId].serverID = data.serverID;
        gameState.zombies[ZombieId].targetUsername = data.targetUsername;

    } else {

        gameState.zombies[ZombieId] = {
            serverID: data.serverID,
            targetUsername: data.targetUsername,
        };
    }
    socket.broadcast.emit('setZombieTarget', gameState.zombies[ZombieId]);
}

function handleMessage(message, socket, io) {
    try {
        const data = (message);
        const messageType = data.type;

        switch (messageType) {
            case 'playerMove':
                handlePlayer(data, socket, io);
                break;
            case 'setZombieTarget':
                handleZombieUpdate(data, socket, io);
                break;
            case 'zombieHit':
                io.emit('zombieHit', data);
                break;
            case 'zombieRespawn':
                io.emit('zombieRespawn', data);
                break;
            default:
                console.error('Unknown message type:', messageType);
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
}

module.exports = function (io) {

    io.on('connection', (socket) => {

        socket.on('startGame', (Entry) => {
            const playerId = 'player_' + Math.random().toString(36).substr(2, 9);
            socket.playerId = playerId;
            console.log('New player connected:', playerId);
            io.emit('playerJoined', Entry);
            emitCurrentGameState(socket);
        });

        socket.on('message', (obj) => {
            handleMessage(obj, socket, io);

        });

        socket.on('disconnect', () => {

            const playerUsernames = Object.values(gameState.players).map(player => player.username);

            for (const playerId in gameState.players) {

                if (playerUsernames.includes(gameState.players[playerId].username)) {
                    delete gameState.players[playerId];
                    console.log(`${playerUsernames} disconnected / test socket`);
                    
                    break;
                }
            }

        });
    });
}

function emitCurrentGameState(playerSocket) {

    if (Object.keys(gameState.players).length === 0) {
        return;
    }

    const playerUsernames = Object.values(gameState.players).map(player => player.username);
    const playerCharacterID = Object.values(gameState.players).map(player => player.characterID);

    const gameStateData = {
        players: playerUsernames,
        characterID: playerCharacterID
    };

    playerSocket.emit('currentGameState', gameStateData);
}


function emitEventToAllExcept(eventName, eventData, io) {

    io.emit(eventName, eventData);
}