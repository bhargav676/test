const express=require('express');
const router=express();
const getpast=require('../controllers/getupcomming');

router.get('/getupcomming',getpast);  

module.exports=router 