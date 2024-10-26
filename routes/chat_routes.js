const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const userauth=require('../middleware/auth');

router.get('/chat', userauth.authenticate, chatController.loadChat);

router.post('/message', userauth.authenticate, chatController.createMessage);

router.get('/messages', userauth.authenticate, chatController.getMessages);

module.exports = router;
