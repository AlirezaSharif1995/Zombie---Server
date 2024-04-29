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

// Helper function to get user by id
async function getUserByID(friendID) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [friendID]);
    return rows[0];
}

// Helper function to get user by email
async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

// Get user endpoint
router.get('/', async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            id: user.id,
            email: user.email,
            recivedRequests: user.recivedRequests,
            friendsList: user.friendsList
        };

        res.status(200).json({ message: 'Data sent successfully', user: userData });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add friend endpoint
router.post('/addFriend', async (req, res) => {
    const { email, friendID } = req.body;

    try {
        // Check if both email and friendID are provided
        if (!email || !friendID) {
            return res.status(400).json({ error: 'Both email and friendID are required' });
        }

        // Check if the friend ID exists in the database
        const [[friend]] = await pool.query('SELECT * FROM users WHERE id = ?', [friendID]);
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Get user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Parse existing friendsList if not null
        const updatedFriendsList = user.friendsList ? JSON.parse(user.friendsList) : [];

        // Check if the friendID already exists in the updatedFriendsList
        if (!updatedFriendsList.includes(friendID)) {
            // Add friend's ID to the list of friends only if it's not already present
            updatedFriendsList.push(friendID);
        } else {
            return res.status(400).json({ error: 'Friend already exists in the list' });
        }

        // Update user's friend list with the updated friendsList
        await pool.query('UPDATE users SET friendsList = ? WHERE email = ?', [JSON.stringify(updatedFriendsList), email]);

        const updatedReceivedRequests = user.recivedRequests ? JSON.parse(user.recivedRequests) : [];
        const updatedReceivedRequestsWithoutFriend = updatedReceivedRequests.filter(request => request !== friendID);
        await pool.query('UPDATE users SET recivedRequests = ? WHERE email = ?', [JSON.stringify(updatedReceivedRequestsWithoutFriend), email]);


        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reject friend endpoint
router.post('/rejectFriend', async (req, res) => {
    const { email, friendID } = req.body;

    try {
        // Check if both email and friendID are provided
        if (!email || !friendID) {
            return res.status(400).json({ error: 'Both email and friendID are required' });
        }

        // Check if the friend ID exists in the database
        const [[friend]] = await pool.query('SELECT * FROM users WHERE id = ?', [friendID]);
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Get user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const updatedReceivedRequests = user.recivedRequests ? JSON.parse(user.recivedRequests) : [];
        const updatedReceivedRequestsWithoutFriend = updatedReceivedRequests.filter(request => request !== friendID);
        await pool.query('UPDATE users SET recivedRequests = ? WHERE email = ?', [JSON.stringify(updatedReceivedRequestsWithoutFriend), email]);

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// request endpoint
router.post('/sendRequest',async(req,res)=>{
    const { email, friendID } = req.body;

 try {
        // Check if both email and friendID are provided
        if (!email || !friendID) {
            return res.status(400).json({ error: 'Both email and friendID are required' });
        }

        // Check if the friend ID exists in the database
        const [[userEmailId]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (!userEmailId) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Get user by email
        const user = await getUserByID(friendID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Parse existing recivedRequests if not null
        const updatedFriendsRequest = user.recivedRequests ? JSON.parse(user.recivedRequests) : [];

        // Check if the friendID already exists in the updatedFriendsRequest
        if (!updatedFriendsRequest.includes(userEmailId.id)) {
            // Add friend's ID to the list of friends only if it's not already present
            updatedFriendsRequest.push(userEmailId.id);
        } else {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Update user's friend list with the updated friendsList
        await pool.query('UPDATE users SET recivedRequests = ? WHERE email = ?', [JSON.stringify(updatedFriendsRequest), user.email]);

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/playerInfo',async(req,res)=>{
    
    const {id} = req.body;
    const [existingUser] = await pool.query('SELECT username FROM users WHERE id = ?', [id])
  
    const user = {
        id: id,
        username: existingUser[0].username
    };

    res.status(200).json({ message: 'user found: ',user});
});

router.post('/removeUser',async(req,res)=>{

    const {userID,friendID} = req.body;
    const user = await getUserByID(userID);

    try{
    const updatedReceivedRequests = user.friendsList ? JSON.parse(user.friendsList) : [];
    const updatedReceivedRequestsWithoutFriend = updatedReceivedRequests.filter(request => request !== friendID);
    await pool.query('UPDATE users SET friendsList = ? WHERE email = ?', [JSON.stringify(updatedReceivedRequestsWithoutFriend), user.email]);

    res.status(200).json({ message: 'Friend removed successfully' });
    
    }catch (error) {
        console.error('Error remove friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    
});

module.exports = router;
