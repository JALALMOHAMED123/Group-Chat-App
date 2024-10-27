const Message = require('../models/message');
const User = require('../models/user');

exports.loadChat = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMessage = async (req, res) => {
    const { message } = req.body;
    try {
        const savedMessage = await Message.create({
            content: message,
            UserId: req.user.id 
        });
        res.status(201).json(savedMessage); // Respond with the created message
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
