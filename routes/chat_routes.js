const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const userauth=require('../middleware/auth');

router.get('/search/:searchInput', userauth.authenticate, chatController.searchUser); //userauth.authenticate,

router.get('/getUser', userauth.authenticate, chatController.getUser); 

module.exports = router;
