const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/auth');
const S3services =require('../services/S3services');

router.post('/group', userAuth.authenticate, groupController.createGroup);

router.post('/group/:groupId/addUsers', userAuth.authenticate, groupController.joinGroup);

router.post('/group/:groupId/makeAdmin', userAuth.authenticate, groupController.addAdminToGroup);

router.post('/group/:groupId/removeAdmin', userAuth.authenticate, groupController.removeAdminToGroup);

router.delete('/group/:groupId/removeUser/:userId', userAuth.authenticate, groupController.removeUser);

router.get('/groups', userAuth.authenticate, groupController.getGroups);

//send to S3 AWS
router.post('/group/:groupId/upload', userAuth.authenticate,S3services.uploadSingleFile,  groupController.uploadToS3);

router.get('/group/:groupId/users', userAuth.authenticate, groupController.getGroupUsers);

router.get('/group/:groupId/messages', userAuth.authenticate, groupController.getGroupMessages);

router.post('/group/:groupId/message', userAuth.authenticate, groupController.createGroupMessage);

router.delete('/deleteGroup/:groupId', userAuth.authenticate, groupController.deleteGroup); 

module.exports = router;
