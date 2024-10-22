const Datatype=require('sequelize');
const sequelize=require('../util/db');

const User=sequelize.define('User',{
    id:{
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Datatype.STRING,
        allowNull: false
    },
    email: {
        type: Datatype.STRING,
        unique: true,
        allowNull: false
    },
    number: {
        type: Datatype.STRING,
        unique:true,
        allowNull:false
    },
    password: {
        type: Datatype.STRING,
        allowNull: false
    }
});

module.exports=User;