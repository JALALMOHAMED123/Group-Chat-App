const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user_routes');
const chatRoutes = require('./routes/chat_routes');
const groupRoutes = require('./routes/group_routes');

const sequelize = require('./util/db');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupMember = require('./models/groupMember');
const GroupMessage = require('./models/groupMessage');

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000/" }));
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

User.hasMany(Message);
Message.belongsTo(User);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err.message);
});
