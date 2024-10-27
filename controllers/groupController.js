const Group = require('../models/group');
const GroupMember = require('../models/groupMember');
const GroupMessage = require('../models/groupMessage');
const User = require('../models/user');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const group = await Group.create({ name: req.body.name });
        await GroupMember.create({ GroupId: group.id, UserId: req.user.id }); // Add creator to group
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other controller functions...


// Join a group
exports.joinGroup = async (req, res) => {
    try {
        await GroupMember.create({ GroupId: req.params.groupId, UserId: req.user.id });
        res.status(200).json({ message: "Joined group successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all groups the user is a part of
exports.getGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const groups = await Group.findAll({
            include: {
                model: GroupMember,
                where: { UserId: userId },
                attributes: [],
            }
        });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error); // Log error on server
        res.status(500).json({ error: error.message });
    }
};
// Get messages for a specific group
exports.getGroupMessages = async (req, res) => {
    try {
        const messages = await GroupMessage.findAll({
            where: { GroupId: req.params.groupId },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
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
