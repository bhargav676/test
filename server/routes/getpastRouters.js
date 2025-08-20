const express=require('express');
const router=express();
const getpast=require('../controllers/getpastController');
const { 
    getPastEventsByClub 
} = require('../controllers/publicViewsController');

router.get('/getpast',getpast);
router.get('/getpast/club/:clubName', getPastEventsByClub);

module.exports=router