const express = require('express');
const router = express.Router();

const dsp=require('../controllers/getelect')

router.get('/get',dsp);

module.exports=router;