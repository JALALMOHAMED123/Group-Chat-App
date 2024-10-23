const User=require('../models/user');
const jwt=require('jsonwebtoken');

exports.authenticate=(req, res, next)=>{
    try{
        const token=req.header('Authorization');
        console.log(token);
        const user=jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("userId >>> ",user.userId);
        User.findByPk(user.userId)
        .then(user=>{
            req.user=user;
            next();
        })
        .catch(err=> res.status(401).json({error: err}));
    } 
    catch(err){
        console.log(err);
        res.status(401).json({error: err.message});
    }
}