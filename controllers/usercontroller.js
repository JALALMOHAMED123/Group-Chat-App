const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.postsignup=async(req,res)=>{
    try{
        const {name, email, number, password}=req.body;
        console.log(name);
        const userexist=await User.findOne({ where: {email}});
        const usernumber=await User.findOne({ where: {number}});

        if(userexist || usernumber){
            return res.status(400).json({error: "User already exists, Please Login"});
        }
        else
        {
            const saltrounds=10;
            bcrypt.hash(password, saltrounds, async(err, hash)=>{
                console.log(err);
                await User.create({name, email, number, password: hash});
                res.status(201).json({ message: "Successfuly signed up"});
            }) 
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

function webtoken(id){
    return jwt.sign({ userId: id}, process.env.TOKEN_SECRET);
}
exports.postLogin=async(req,res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findAll({ where: {email}});
        if(user){
            bcrypt.compare(password, user[0].password, (err,result)=>{
                if(err){
                    throw new Error("something went wrong");
                }
                if(result==true) {
                    return res.json({ redirect: '/chat.html', token: webtoken(user[0].id)});
                }
                else{
                    res.status(401).json({error: "User not authorized"});
                }
            });
        }
    }
    catch(err){
        res.status(404).json({error: "User not found"});
    }
}