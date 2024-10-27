const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const User = require('./user');
const Group = require('./group');

const GroupMember = sequelize.define('GroupMember', {});

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

module.exports = GroupMember;
