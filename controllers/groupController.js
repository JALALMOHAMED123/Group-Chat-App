const Group = require('../models/group');
const User_Groups = require('../models/User_Groups');
const GroupMessage = require('../models/groupMessage');
const ArchivedChat = require('../models/archieved_chat');
const User = require('../models/user');
const {Op} = require('sequelize');
const sequelize = require('../util/db');

const S3services=require('../services/S3services');


exports.createGroup = async (req, res) => {
    const t=await sequelize.transaction();
    try {
        const group = await Group.create({ name: req.body.name, UserId: req.user.id }, {transaction: t});
        await User_Groups.create({ UserId: req.user.id, GroupId: group.id, isAdmin: true }, {transaction: t}); 
        await t.commit();
        res.status(201).json({group});
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    const GroupId=req.params.groupId;
    const { userIds }=req.body;
    console.log(req.body);
    try {
    for (const userId of userIds) {
        const alreadyMember = await User_Groups.findOne({ where: { GroupId, UserId: userId } });
        if (!alreadyMember) {
            await User_Groups.create({ GroupId, UserId: userId });
        }
    }
        res.status(200).json({ message: "Users added to the group" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGroups = async (req, res) => {
    
    try {
        const groups = await Group.findAll({
            include: {
                model: User,
                where: {id: req.user.id }
            }
        });
        res.status(200).json({groups});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get messages for a specific group
exports.getGroupMessages = async (req, res) => {
    try {
        const allMessages = await GroupMessage.findAll({
            where: { GroupId: req.params.groupId },
            include: [{ model: User}],
            order: [['createdAt', 'ASC']]
        });

        const isAdmin=await User_Groups.findOne({
            where: {
               GroupId: req.params.groupId,
               UserId: req.user.id,
               isAdmin: true
           }
        });
        res.status(200).json( {allMessages, isAdmin: !!isAdmin} );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new message in a group
exports.createGroupMessage = async (req, res) => {
    try {
        const message = await GroupMessage.create({
            content: req.body.message,
            GroupId: req.params.groupId,
            UserId: req.user.id
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGroup= async(req,res)=>{
    const id=req.params.groupId;
    const t=await sequelize.transaction();
    console.log(id);
    try{

        await GroupMessage.destroy({ where: { GroupId: id}}, {transaction: t})
        await User_Groups.destroy({ where: { GroupId: id}}, {transaction: t})
        await Group.destroy({ where: { id }}, {transaction: t})
        await t.commit();
        res.status(200).json({ message: "Group destroyed"});
    }
    catch(error){
        await t.rollback();
        res.status(500).json({ error: error.message});
    }
}

exports.getGroupUsers=async(req,res)=>{
    try{
        const users=await User.findAll( { 
            include: [{
            model: Group,
            where: {id: req.params.groupId},
            through: { attributes: ['isAdmin'] } 
         }]
        });

        const isAdmin=await User_Groups.findOne({
            where: {
               GroupId: req.params.groupId,
               UserId: req.user.id,
               isAdmin: true
           }
        });


        res.status(200).json({ users: users.map(user =>({
            id: user.id,
            name: user.name,
            isAdmin: user.Groups[0]?.User_Groups?.isAdmin 
            })),
            currentUserIsAdmin: !!isAdmin
        });
    }
    catch(error){
        res.status(500).json({ error: error.message});
    }
}

exports.addAdminToGroup=async(req,res)=>{
    try{
        await User_Groups.update( {isAdmin: true}, {
            where: { GroupId: req.params.groupId, UserId: req.body.userId }
        })
        res.status(200).json({ message: `User ${req.body.userId} added as Admin`});
    }
    catch(error){
        res.status(500).json({ error: error.message});
    }
}

exports.removeAdminToGroup=async(req,res)=>{
    try{
        await User_Groups.update( {isAdmin: false}, {
            where: { GroupId: req.params.groupId, UserId: req.body.userId }
        })
        res.status(200).json({ message: `User ${req.body.userId} removed as Admin`});
    }
    catch(error){
        res.status(500).json({ error: error.message});
    }
}

exports.removeUser=async(req,res)=>{
    try{
        await User_Groups.destroy({
            where: { GroupId: req.params.groupId, UserId: req.params.userId }
        })
        res.status(200).json({ message: `User removed from the group`});
    }
    catch(error){
        res.status(500).json({ error: error.message});
    }
}

exports.uploadToS3 = async (req, res) => {
    try {
        const file = req.file;

        if(!file){
            return res.status(400).json({error: "No file provided"});
        }

        const fileContent=file.buffer;
        const fileName = `${req.user.id}-${Date.now()}-${file.originalname}`;

        const fileurl=await S3services.uploadToS3(fileContent, fileName);
        console.log("File updloaded to S3:", fileurl);
        res.status(200).json({fileurl});

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.archiveOldMessages = async(req,res)=>{
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const oldMessages = await GroupMessage.findAll({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            }
        });
        if (oldMessages.length > 0) {
            const archiveData = oldMessages.map(message => ({
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                GroupId: message.GroupId,
                UserId: message.UserId,
            }));

            await ArchivedChat.bulkCreate(archiveData);

            await GroupMessage.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: oneDayAgo
                    }
                }
            });
        } else {
            console.log("No messages older than 1 day to archive.");
        }
        console.log('Archiving completed successfully.');
    } catch (error) {
        console.error('Error archiving messages:', error);
    }
}