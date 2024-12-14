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

async function getUserByID(token) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [token]);
    return rows[0];
}

router.get('/', async (req, res) => {
    const { token } = req.body;

    try {
        const user = await getUserByID(token);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            id: user.id,
            recivedRequests: user.recivedRequests,
            friendsList: user.friendsList
        };

        res.status(200).json({ message: 'Data sent successfully', user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addFriend', async (req, res) => {
    console.log(req.body);

    const { token, friendID } = req.body;
    try {

        const user = await getUserByID(token);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friend = await getUserByID(friendID);
        if (!friend) {
            return res.status(404).json({ error: 'User not found' });
        }
    

        // Parse existing friendsList if not null
        const updatedFriendsList = JSON.parse(user.friendsList);
        const updateUserList = JSON.parse(friend.friendsList);

        console.log(friend.friendsList)
        console.log(updateUserList)
        
        if (!updatedFriendsList.includes(friendID)) {
            updatedFriendsList.push(friendID);
            updateUserList.push(user.id);

        } else {
            return res.status(400).json({ error: 'Friend already exists in the list' });
        }

        await pool.query('UPDATE users SET friendsList = ? WHERE id = ?', [JSON.stringify(updatedFriendsList), token]);
        await pool.query('UPDATE users SET friendsList = ? WHERE id = ?', [JSON.stringify(updateUserList), friendID]);

        const updatedReceivedRequests = user.recivedRequests ? JSON.parse(user.recivedRequests) : [];
        const updatedReceivedRequestsWithoutFriend = updatedReceivedRequests.filter(request => request !== friendID);
        await pool.query('UPDATE users SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedReceivedRequestsWithoutFriend), token]);

        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/rejectFriend', async (req, res) => {
    const { token, friendID } = req.body;

    try {

        const [[friend]] = await pool.query('SELECT * FROM users WHERE id = ?', [friendID]);
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        const user = await getUserByID(token);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedReceivedRequests = user.recivedRequests ? JSON.parse(user.recivedRequests) : [];
        const updatedReceivedRequestsWithoutFriend = updatedReceivedRequests.filter(request => request !== friendID);
        await pool.query('UPDATE users SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedReceivedRequestsWithoutFriend), token]);

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/sendRequest', async (req, res) => {
    const { token, username } = req.body;
console.log(req.body)
    try {
        const firstuser = await getUserByID(token);
        if (!firstuser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (!user[0]) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user[0].friendsList.includes(token)) {
            return res.status(404).json({ error: 'Friend is already exist' });
        }
        const updatedFriendsRequest = user[0].recivedRequests ? JSON.parse(user[0].recivedRequests) : [];
        if (!updatedFriendsRequest.includes(token)) {
            updatedFriendsRequest.push(firstuser.id);
        } else {
            return res.status(400).json({ error: 'Friend request already sent' });
        }
        await pool.query('UPDATE users SET recivedRequests = ? WHERE username = ?', [JSON.stringify(updatedFriendsRequest), username]);

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/playerInfo', async (req, res) => {

    try {
        
    const {id} = req.body;
    const [existingUser] = await pool.query('SELECT username FROM users WHERE id = ?', [id]);

    const user = {
        token: id,
        username: existingUser[0].username
    };

    res.status(200).json({ message: 'user found: ', user });
    } catch (error) {
        console.error('Error remove friend:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
});

router.post('/removeUser', async (req, res) => {

    const { token, friendID } = req.body;
    const user = await getUserByID(token);
    const friend = await getUserByID(friendID);
    console.log(req.body);
    try {

        const friendslist = user.friendsList ? JSON.parse(user.friendsList) : [];
        const updateFriendslist = friendslist.filter(request => request !== friendID);
        await pool.query('UPDATE users SET friendsList = ? WHERE id = ?', [JSON.stringify(updateFriendslist), user.id]);

        const otherFriendslist = friend.friendsList ? JSON.parse(friend.friendsList) : [];
        const updatedOtherFriendslist = otherFriendslist.filter(request => request !== token);
        await pool.query('UPDATE users SET friendsList = ? WHERE id = ?', [JSON.stringify(updatedOtherFriendslist), friend.id]);

        res.status(200).json({ message: 'Friend removed successfully' });

    } catch (error) {
        console.error('Error remove friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

module.exports = router;
