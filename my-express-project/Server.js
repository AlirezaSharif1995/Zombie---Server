const express = require('express');
const bodyParser = require('body-parser');
const registrationRouter = require('./registrationRouter');
const loginRouter = require('./LoginRouter');
const friendHandler = require('./friendHandler');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());

app.use('/api/auth/register', registrationRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/friendHandler', friendHandler);


app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Connected successful....' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
