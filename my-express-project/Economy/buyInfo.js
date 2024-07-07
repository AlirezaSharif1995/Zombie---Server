const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

router.get('/',(req,res)=>{
    console.log(req.body);

});

module.exports = router;
