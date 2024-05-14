const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');

const router = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'zombie-City-database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get('/', async (req,res)=>{

    const { token } = req.body;

    try {
    const [user] = await pool.query('SELECT location FROM users WHERE id = ?', token);
    const [availableRooms] = await pool.query('SELECT socketPort FROM roomSockets WHERE location = ?', user[0].location);

    if (availableRooms.length > 0) {
        const socketPorts = availableRooms.map(room => room.socketPort);
        console.log('Socket ports for rooms with the same location:', socketPorts);
        res.json({ socketPorts }); // Sending the socket ports as a response
    } else {
        console.log('No rooms found with the same location');
        res.json({ message: 'No rooms found with the same location' });
    }
    
    } catch(error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

module.exports = router;