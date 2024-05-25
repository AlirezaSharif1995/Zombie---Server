const mysql = require('mysql2/promise');

let gameState = {
    players: {},
    zombies: {}
}

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'zombie-City-database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function handlePlayer(data, socket) {

    const { playerId } = data;

    if (gameState.players[playerId]) {

        gameState.players[playerId].posX = data.posX;
        gameState.players[playerId].posY = data.posY;
        gameState.players[playerId].posZ = data.posZ;
        gameState.players[playerId].rotY = data.rotY;
        gameState.players[playerId].weaponCode = data.weaponCode;
        gameState.players[playerId].animationCode = data.animationCode;
        gameState.players[playerId].health = data.health;

    } else {

        gameState.players[playerId] = {
            weaponCode: data.weaponCode,
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

    socket.broadcast.emit('playerMoved', {
        username: data.username,
        posX: data.posX,
        posY: data.posY,
        posZ: data.posZ,
        rotX: data.rotX,
        rotY: data.rotY,
        rotZ: data.rotZ,
        weaponCode: data.weaponCode,
        animationCode: data.animationCode,
        health: data.health
    });
}

function handleZombieUpdate(data, socket) {

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

async function handleMessage(message, socket, io) {
    try {
        const data = (message);
        const messageType = data.type;

        switch (messageType) {
            case 'playerMove':
                handlePlayer(data, socket);
                break;
            case 'setZombieTarget':
                handleZombieUpdate(data, socket);
                break;
            case 'zombieHit':
                io.emit('zombieHit', data);
                break;
            case 'zombieRespawn':
                io.emit('zombieRespawn', data);
                break;
            case 'grenade':
                io.emit('grenade', data);
                break;
            case 'left':
                io.emit('left', data);
                break;
            case 'coin':
                const username = data.username;
                const coin = data.coin;
                const [existingUser] = await pool.query('SELECT coin FROM users WHERE username = ?', username);

                try {
                    const user = {
                        coin: existingUser[0].coin
                    }
                    if (coin == 0) {
                        socket.emit('coin', user);
                    } else {
                        updatedCoin = existingUser[0].coin + coin;
                        console.log(username)
                        await pool.query('UPDATE users SET coin = ? WHERE username = ?', [updatedCoin, username]);
                        console.log(username,existingUser)
                    }
                } catch (error) {

                }
                break
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
            username = Object.values(gameState.players).map(player => player.username);

            for (const playerId in gameState.players) {

                if (playerUsernames.includes(gameState.players[playerId].username)) {
                    delete gameState.players[playerId];
                    console.log(`${playerUsernames} disconnected / test socket`);
                    //io.emit('left', username);

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