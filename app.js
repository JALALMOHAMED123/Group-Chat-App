const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user_routes');
const chatRoutes = require('./routes/chat_routes');
const sequelize = require('./util/db');
const cors = require('cors');
const http = require('http'); 
const socketIo = require('socket.io');
const User=require('./models/user');
const Message=require('./models/message');
const dotenv = require('dotenv');
dotenv.config();
const app = express();


app.use(cors({
    origin: "http://127.0.0.1:5500/"
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/views')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use(userRoutes); 
app.use(chatRoutes); 

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500/"
        // methods: ["GET", "POST"]
    }
});

let activeUsers = [];

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('userLoggedIn', (userData) => {
        activeUsers.push({ id: socket.id, user: userData });
        io.emit('activeUsers', activeUsers); 
    });

    socket.on('message', (messageData) => {
        io.emit('message', messageData); 
    });

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.id !== socket.id); 
        io.emit('activeUsers', activeUsers);
    });
});

User.hasMany(Message);
Message.belongsTo(User);

sequelize.sync().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err.message);
});
