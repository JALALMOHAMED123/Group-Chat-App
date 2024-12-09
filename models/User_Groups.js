const sequelize = require('../util/db');
const Datatype=require('sequelize');

const User_Groups = sequelize.define('User_Groups', {
    isAdmin: {
        type: Datatype.BOOLEAN,
        defaultValue: false,
        autoNull: false
    }
});



module.exports = User_Groups;
