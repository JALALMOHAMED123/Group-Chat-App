const User=require('../models/user');
const bcrypt=require('bcrypt');

exports.postsignup=async(req,res)=>{
    try{
        const {name, email, number, password}=req.body;
        console.log(name);
        const userexist=await User.findOne({ where: {email}});
        const usernumber=await User.findOne({ where: {number}});

        if(userexist){
            return res.status(400).json({error: "Email already exists"});
        }
        else if(usernumber){
            return res.status(400).json({error: "Phone number already exists"});
        }
        else
        {
            const saltrounds=10;
            bcrypt.hash(password, saltrounds, async(err, hash)=>{
                console.log(err);
                await User.create({name, email, number, password: hash});
                res.status(201).json({ message: "User created successfully"});
            }) 
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
}