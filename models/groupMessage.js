const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const Group = require('./group');
const User = require('./user');

const GroupMessage = sequelize.define('GroupMessage', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

GroupMessage.belongsTo(Group);
GroupMessage.belongsTo(User);

module.exports = GroupMessage;
