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

router.get('/', async (req, res) => {

  const { token } = req.body;
  try {
    const [messages] = await pool.query('SELECT * FROM messages WHERE sender = ? OR receiver = ?', [token, token]);
    res.send(messages);

  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/getMessageUsers', async (req, res) => {

  const { token } = req.body;

  try {
    // SQL query to get distinct sender and receiver IDs except the self user
    const query = `
      SELECT DISTINCT id 
      FROM (
        SELECT sender AS id 
        FROM messages 
        WHERE receiver = ? AND sender != ?
        UNION
        SELECT receiver AS id 
        FROM messages 
        WHERE sender = ? AND receiver != ?
      ) AS ids
    `;

    const [results] = await pool.query(query, [token, token, token, token]);

    // Extract IDs from results
    const userIds = results.map(row => row.id);

    res.send(userIds);

  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;