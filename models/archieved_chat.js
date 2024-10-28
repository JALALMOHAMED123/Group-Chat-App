const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('user.js'); 

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
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = ArchivedChat;
