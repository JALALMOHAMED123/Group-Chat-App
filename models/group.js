const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('./user'); 
const GroupMember = require('./groupMember');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
Group.belongsToMany(User, { through: GroupMember });
module.exports = Group;
