const express = require('express');
const router = express.Router();

const dsps=require('../controllers/getgov')

router.get('/getgov',dsps);

module.exports=router;