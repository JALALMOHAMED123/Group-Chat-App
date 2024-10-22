const express= require('express');
const usercontroller=require('../controllers/usercontroller');
const router= express.Router();

router.post('/signup', usercontroller.postsignup);

module.exports=router;

