const User = require('../models/user');
const {Op} = require('sequelize');

exports.searchUser=async(req,res)=>{
    const searchInput=req.params.searchInput.trim();
    try{
        let condition={};
        if(!isNaN(searchInput) && searchInput!==''){
            condition={number: { [Op.like]: `%${searchInput}%`, }}
        }
        else if(searchInput.includes('@') && searchInput.includes('.')){
            condition={email: { [Op.like]: `%${searchInput}%`, }}
        }
        else{
            condition={name: { [Op.like]: `%${searchInput}%`, }}
        }
        const users=await User.findAll({where: condition});
        res.status(200).json({users});
    }
    catch(err){
        res.status(500).json({ error: err.message});
    }
}

exports.getUser=async(req,res)=>{
    try{
        const username=req.user.name;
        return res.status(200).json({ username, id: req.user.id});
    }
    catch(err){ req.status(500).json({ error: err.message})};
}