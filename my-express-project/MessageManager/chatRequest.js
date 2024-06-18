const express = require('express');
const mysql = require('mysql2/promise');
const { post } = require('../authentication/registrationRouter');
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


router.post('/', async (req, res) => {
    const { fromName, toName } = req.body;

    try {
        const [firstuser] = await pool.query('SELECT * FROM users WHERE username = ?', [fromName]);
        if (!firstuser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [secondPlayer] = await pool.query('SELECT * FROM users WHERE username = ?', [toName]);
        if (!secondPlayer) {
            return res.status(404).json({ error: 'User not found' });
        }


        if (secondPlayer[0].chatRequest.includes(firstuser[0].id)) {
            return res.status(404).json({ error: 'Request is already exist' });
        }

        const updatedchatRequest = secondPlayer[0].chatRequest ? JSON.parse(secondPlayer[0].chatRequest) : [];

        if (!updatedchatRequest.includes(firstuser[0].id)) {
            updatedchatRequest.push(firstuser[0].id);
        } else {
            return res.status(400).json({ error: 'Request is already sent' });
        }
        await pool.query('UPDATE users SET chatRequest = ? WHERE username = ?', [JSON.stringify(updatedchatRequest), toName]);

        res.status(200).json({ message: 'Chat request sent successfully' });
    } catch (error) {
        console.error('Error chat request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

router.post('/rejectChatRequest', async (req, res) => {
    const { fromName, toName } = req.body;

    try {
        const [firstuser] = await pool.query('SELECT * FROM users WHERE username = ?', [fromName]);
        if (!firstuser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [secondPlayer] = await pool.query('SELECT * FROM users WHERE username = ?', [toName]);
        if (!secondPlayer) {
            return res.status(404).json({ error: 'User not found' });
        }

        updatedReceivedRequests = secondPlayer[0].chatRequest;
        if (typeof updatedReceivedRequests === 'string') {
            updatedReceivedRequests = JSON.parse(updatedReceivedRequests);
        }
        const chatRequest = updatedReceivedRequests.filter(request => request !== firstuser[0].id);
        await pool.query('UPDATE users SET chatRequest = ? WHERE username = ?', [JSON.stringify(chatRequest), toName]);

        res.status(200).json({ message: 'Friend removed successfully' });

    } catch (error) {
        console.error('Error chat request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.get('/getChatRequest', async (req, res) => {
    const { token } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [token]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        receivedRequests = user[0].chatRequest;
        res.status(200).json( receivedRequests );

    } catch (error) {
        console.error('Error chat request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


module.exports = router;