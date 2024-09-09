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

router.post('/', async (req, res) => {
    const token = req.body.token;
    console.log(`${token} is logged in`);

    try {
        console.log(req.body)

        const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [token]);
        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = {
            username: existingUser[0].username
        };

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/loginWithEmail', async (req, res) => {
    const { email, password } = req.body;

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, existingUser[0].password_hash);

        if (!match) {
            return res.status(404).json({ error: 'Password is incorect' });
        }
        const user = {
            token: existingUser[0].id
        };
        console.log(user);

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {

        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeStat', async (req, res) => {

    const { token, type, value, valueString } = req.body;
    try {

        const allowedTypes = ['location', 'characterId', 'weaponId', 'coin', 'grenade', 'armor', 'username', 'premium'];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid stat type' });
        }

        if (type == 'username') {
            console.log(type)
            console.log(valueString)

            const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', valueString);

            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'Username is already registered' });
            }
            const query = `UPDATE users SET ${type} = ? WHERE id = ?`;
            await pool.query(query, [valueString, token]);
            return res.status(200).json({ message: 'username changed successfully' });
        }

        const query = `UPDATE users SET ${type} = ? WHERE id = ?`;
        await pool.query(query, [value, token]);

        res.status(200).json({ message: 'Data changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/premium',async(req,res)=>{
    const { token } = req.body;

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [token]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = {
            premium: existingUser[0].premium
        };

        res.status(200).json({ user });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;
