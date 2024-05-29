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

router.post('/changeStat', async (req, res) => {

    console.log(req.body)
    const { token, type, value } = req.body;
    try {
        // Define the list of allowed stat types
        const allowedTypes = ['location', 'characterId', 'weaponId', 'coin', 'grenade', 'armor'];

        // Check if the provided type is allowed
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid stat type' });
        }

        // Update the user's stat
        const query = `UPDATE users SET ${type} = ? WHERE id = ?`;
        console.log(value)
        console.log(type)

        await pool.query(query, [value, token]);

        res.status(200).json({ message: 'Data changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
