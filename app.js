const express=require('express');
const bodyParser=require('body-parser');
const path = require('path');
const userRoutes=require('./routes/user_routes');
const sequelize=require('./util/db');
// const User=require('./models/user');

const dotenv=require('dotenv');
dotenv.config();
const app=express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname,'public/views')));

app.get('/',(req,res)=>{
    res.redirect('/login.html');
})

app.use(userRoutes);

app.use((req,res)=>{
    console.log('url',req.url);
    res.sendFile(path.join(__dirname,`public/${req.url}`));
  });
  
sequelize
    .sync()
    .then(()=>{
        console.log("Database synced");
        app.listen(process.env.PORT);
    })
    .catch((err)=>{
        console.log(err.message);
    });
