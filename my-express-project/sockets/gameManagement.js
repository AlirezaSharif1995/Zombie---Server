
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

function handlePlayerShooting(data, socket) {

}

function handleZombieUpdate(data, socket, io) {

    const { ZombieId } = data;

    if (gameState.zombies[ZombieId]) {

        gameState.zombies[ZombieId].serverID = data.serverID;
        gameState.zombies[ZombieId].posX = data.posX;
        gameState.zombies[ZombieId].posY = data.posY;
        gameState.zombies[ZombieId].posZ = data.posZ;
        gameState.zombies[ZombieId].rotY = data.rotY;
        gameState.zombies[ZombieId].animationCode1 = data.animationCode1;
        gameState.zombies[ZombieId].animationCode2 = data.animationCode2;
        gameState.zombies[ZombieId].health = data.health;

    } else {

        gameState.zombies[ZombieId] = {
            serverID: data.serverID,
            posX: data.posX,
            posY: data.posY,
            posZ: data.posZ,
            rotY: data.rotY,
            animationCode1: data.animationCode1,
            animationCode2: data.animationCode2,
            health: data.health,
        };
    }
    socket.broadcast.emit('zombieUpdate', gameState.zombies[ZombieId]);
}

function handleMessage(message, socket, io) {
    try {
        const data = (message);
        const messageType = data.type;

        switch (messageType) {
            case 'playerMove':
                handlePlayer(data, socket, io);
                break;
            case 'zombieUpdate':
                handleZombieUpdate(data, socket, io);
                break;
            case 'freeZombie':
                io.emit('freeZombie', data);
                break;
            case 'spawnZombie':
                handleZombieUpdate(data, socket, io)
                break;
            case 'playerShooting':
                handlePlayerShooting(data, socket);
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
            console.log(gameState.zombies)
        });

        socket.on('message', (obj) => {
            handleMessage(obj, socket, io);
        });

        socket.on('disconnect', () => {

            const playerUsernames = Object.values(gameState.players).map(player => player.username);

            for (const playerId in gameState.players) {

                if (playerUsernames.includes(gameState.players[playerId].username)) {
                    delete gameState.players[playerId];
                    console.log('Player with username disconnected');
                    console.log(gameState.players)
                    emitCurrentGameState(io);
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
    console.log(gameStateData);

    playerSocket.emit('currentGameState', gameStateData);
}


function emitEventToAllExcept(eventName, eventData, io) {

    io.emit(eventName, eventData);
}