const express = require('express');
const router = express.Router();
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

router.post('/', async (req, res) => {
    const token = req.body.token;
    console.log(`${token} is logged in`);

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [token]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = {
            username: existingUser[0].username
        };

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
