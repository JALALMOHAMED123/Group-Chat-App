const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

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



module.exports = Group;
