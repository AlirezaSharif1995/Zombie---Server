const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'zombie-City-database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get('/',async (req,res)=>{

    const userId = req.body.id;

    try {
        const [messages] = await pool.query('SELECT * FROM messages WHERE sender = ? OR receiver = ?', [userId, userId]);
        res.send(messages);

      } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Internal Server Error');
      }
});

module.exports = router;