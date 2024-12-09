const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const GroupMessage = sequelize.define('GroupMessage', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = GroupMessage;
