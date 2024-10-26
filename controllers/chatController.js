const path = require('path');
const Message=require('../models/message');
const User=require('../models/user');

exports.loadChat = async(req, res) => {
    try{
        const user=await User.findOne( { where:{ id: req.user.id }});
        return res.status(201).json({user});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.createMessage=async(req,res)=>{
    const { message } = req.body;
    try{
        const savedMessage=await Message.create({
            content: message
        });
        res.status(200).json({savedMessage});
        
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}
