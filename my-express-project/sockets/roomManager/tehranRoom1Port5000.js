const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server);

const connectedSockets = new Set();

let gameState = {
    players: {},
    zombies: {}
}

function handlePlayer(data, socket) {

    const { playerId } = data;

    if (gameState.players[playerId]) {

        gameState.players[playerId].posX = data.posX;
        gameState.players[playerId].posY = data.posY;
        gameState.players[playerId].posZ = data.posZ;
        gameState.players[playerId].rotX = data.rotX;
        gameState.players[playerId].rotY = data.rotY;
        gameState.players[playerId].rotZ = data.rotZ;
        gameState.players[playerId].animationCode = data.animationCode;
        gameState.players[playerId].health = data.health;

    } else {

        gameState.players[playerId] = {
            username: data.username,
            posX: data.posX,
            posY: data.posY,
            posZ: data.posZ,
            rotX: data.rotX,
            rotY: data.rotY,
            rotZ: data.rotZ,
            animationCode: data.animationCode,
            health: data.health,
        };
    }
    emitEventToAllExcept(socket, 'playerMoved', {
        username: data.username,
        posX: data.posX,
        posY: data.posY,
        posZ: data.posZ,
        rotX: data.rotX,
        rotY: data.rotY,
        rotZ: data.rotZ,
        animationCode: data.animationCode,
        health: data.health
    });
}

function handlePlayerShooting(data, socket) {

}

function handleZombieUpdate(zoneName, socket) {
    
}

function handleMessage(message, socket) {
    try {
        // const data = JSON.parse(message);
        const data = (message);
        const messageType = data.type;

        switch (messageType) {
            case 'playerMove':
                handlePlayer(data, socket);
                break;
            case 'zombieUpdate':
                handleZombieUpdate(data, socket);
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

        connectedSockets.add(socket);

        socket.on('startGame', (Entry) => {
            const playerId = 'player_' + Math.random().toString(36).substr(2, 9);
            socket.playerId = playerId;
            console.log('New player connected:', playerId);
            socket.emit('playerJoined', Entry);
        });

        socket.on('message', (obj) => {
            handleMessage(obj, socket);
        });

        socket.on('close', () => {
            console.log('room tehran disconnected:', playerId);
            connectedSockets.delete(socket);
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

    senderSocket.emit(eventName, eventData);
}

server.listen(PORT, () => {
    console.log(`tehranRoom1 is running on port ${PORT}`);
  });