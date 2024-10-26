const Datatype=require('sequelize');
const sequelize=require('../util/db');

const Message=sequelize.define('Message',{
    id:{
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: Datatype.STRING,
        allowNull: false
    }
});

module.exports=Message;