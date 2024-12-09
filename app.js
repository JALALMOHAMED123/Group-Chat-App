const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user_routes');
const chatRoutes = require('./routes/chat_routes');
const groupRoutes = require('./routes/group_routes');
const groupController = require('./controllers/groupController');
const sequelize = require('./util/db');
const User = require('./models/user');
const Group = require('./models/group');
const User_Groups = require('./models/User_Groups');
const GroupMessage = require('./models/groupMessage');
const cron = require('node-cron');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:3000/", "http://127.0.0.1:5500/"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/views')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use(userRoutes);
app.use(chatRoutes);
app.use(groupRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

Group.belongsToMany(User, { through: User_Groups});
User.belongsToMany(Group, { through: User_Groups});

GroupMessage.belongsTo(Group);
GroupMessage.belongsTo(User);

const port=process.env.PORT;
cron.schedule('0 0 * * *', () => {
    console.log('Running the archive job');
    groupController.archiveOldMessages();
});

sequelize.sync().then(() => {
    const server= app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        const io = require('socket.io')(server)

        const users = {}

        io.on('connection', socket => {
        socket.on('new-user', username  => {
            users[socket.id] = username 
            socket.broadcast.emit('user-connected', username )
        })
        socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })

        })
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', users[socket.id])
            delete users[socket.id]
        })
        })

        // io.on('file-shared', ({ senderId, fileUrl, originalName }) => {
        // const messageElem = document.createElement('div');
        // messageElem.innerHTML = `<strong>${senderId}:</strong> <a href="${fileUrl}" target="_blank">${originalName}</a>`;
        // document.getElementById('messages').appendChild(messageElem);
        // });

    });
}).catch((err) => {
    console.log(err.message);
});

