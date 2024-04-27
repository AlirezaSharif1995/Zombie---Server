const express = require('express');
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

router.post('/addFriend', async (req, res) => {
    const { email, friendEmail } = req.body;

    try {
        // Check if both email and friendEmail are provided
        if (!email || !friendEmail) {
            return res.status(400).json({ error: 'Both email and friendEmail are required' });
        }

        // Get user ID from email
        const [[user]] = await pool.query('SELECT id, friendsList FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get friend's ID from friendEmail
        const [[friend]] = await pool.query('SELECT id FROM users WHERE email = ?', [friendEmail]);
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Parse existing friendsList if not null
        let updatedFriendsList = user.friendsList ? JSON.parse(user.friendsList) : [];
        
        // Add friend's ID to the list of friends
        updatedFriendsList.push(friend.id);

        // Update user's friend list with the updated friendsList
        await pool.query('UPDATE users SET friendsList = ? WHERE email = ?', [JSON.stringify(updatedFriendsList), email]);

        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {

    const {email} = req.body;

    if(email!=null){
        const [existingUser] = await pool.query('SELECT * FROM friendHandler WHERE email = ?', [email]);

        const user = {
            email: existingUser[0].email,
            sentRequests: existingUser[0].sentRequests,
            recivedRequests: existingUser[0].recivedRequests,
            friendsList:existingUser[0].friendsList
        };

        res.status(200).json({ message: 'friendHandler successful', user });
    }else{
        return res.status(404).json({ error: 'User not found' });
    }

});


    module.exports=router;