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


router.post('/sendFriendRequest', async (req, res) => {

    const { email, friends = [] } = req.body;

    if(email!=null){
        await pool.query('UPDATE users SET friendsList = ? WHERE email = ?', [JSON.stringify(friends), email]);
        res.status(201).json({ message: 'Add Friends succesfull' });

    }else{
        return res.status(404).json({ error: 'User not found' });
    }

})

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