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

router.post('/validator', async (req, res) => {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        console.log(email);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }


        res.status(201).json({ message: 'validation succesfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { email, password, location, username } = req.body;


    try {

        const [existingUser2] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser2.length > 0) {
            return res.status(400).json({ error: 'Username is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = generateRandomToken();
        console.log(token);

        await pool.query('INSERT INTO users (id, email, password_hash, location, username) VALUES (?, ?, ?, ?, ?)', [token, email, hashedPassword, location, username]);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


function isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password.length >= 8;
}

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

module.exports = router;