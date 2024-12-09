const express = require('express');
const router = express.Router();
const { Group, User, User_Groups } = require('../models');
const { Op } = require('sequelize');

router.post('/group/:groupId/addUser', async (req, res) => {
    const { groupId } = req.params;
    const { searchQuery, adminId } = req.body;

    try {
        const group = await Group.findByPk(groupId);
        const admin = await User_Groups.findOne({ where: { groupId, userId: adminId, isAdmin: true } });

        if (!admin) return res.status(403).send("Only admins can add users");

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { name: searchQuery },
                    { email: searchQuery },
                    { phone: searchQuery }
                ]
            }
        });

        if (!user) return res.status(404).send("User not found");

        await User_Groups.create({ userId: user.id, groupId, isAdmin: false });
        res.status(200).send("User added to group");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/group/:groupId/promoteUser', async (req, res) => {
    const { groupId } = req.params;
    const { userId, adminId } = req.body;

    try {
        const admin = await User_Groups.findOne({ where: { groupId, userId: adminId, isAdmin: true } });

        if (!admin) return res.status(403).send("Only admins can promote users");

        await User_Groups.update({ isAdmin: true }, { where: { groupId, userId } });
        res.status(200).send("User promoted to admin");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/group/:groupId/removeUser', async (req, res) => {
    const { groupId } = req.params;
    const { userId, adminId } = req.body;

    try {
        const admin = await User_Groups.findOne({ where: { groupId, userId: adminId, isAdmin: true } });

        if (!admin) return res.status(403).send("Only admins can remove users");

        await User_Groups.destroy({ where: { groupId, userId } });
        res.status(200).send("User removed from group");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
