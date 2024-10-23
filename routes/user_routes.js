const express= require('express');
const usercontroller=require('../controllers/usercontroller');
const router= express.Router();

router.post('/signup', usercontroller.postsignup);

router.post('/login', usercontroller.postLogin);

module.exports=router;

