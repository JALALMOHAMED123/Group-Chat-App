const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const ArchivedChat = sequelize.define('ArchivedChat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    GroupId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ArchivedChat;
