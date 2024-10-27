const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/auth');

router.post('/group', userAuth.authenticate, groupController.createGroup);
router.post('/group/:groupId/join', userAuth.authenticate, groupController.joinGroup);
router.get('/groups', userAuth.authenticate, groupController.getGroups);
router.get('/group/:groupId/messages', userAuth.authenticate, groupController.getGroupMessages);
router.post('/group/:groupId/message', userAuth.authenticate, groupController.createGroupMessage);

module.exports = router;
