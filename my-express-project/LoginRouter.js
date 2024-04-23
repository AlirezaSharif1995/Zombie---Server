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
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser[0].password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // User authenticated successfully, return user information
        const user = {
            id: existingUser[0].id,
            username: existingUser[0].username,
            email: existingUser[0].email,
            password: password,
            // Add any other user information you want to return
        };

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
