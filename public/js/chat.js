document.addEventListener('DOMContentLoaded', async function () {
    const socket = io();
    const token = localStorage.getItem('token');
    const response = await axios.get('/chat', {
        headers: { "Authorization": token }
    });
    const username = response.data.user.name;

    socket.emit('userLoggedIn', { username });

    socket.on('activeUsers', (users) => {
        const usersList = document.getElementById('activeUsers');
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.user.username;
            usersList.appendChild(li);
        });
    });

    const sendMessageButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    sendMessageButton.addEventListener('click', async () => {
        const message = messageInput.value;
        
        await axios.post('/message', { message }, {
            headers: { "Authorization": token }
        });


        socket.emit('message', { user: username, message });
        messageInput.value = ''; 
    });

    socket.on('message', (data) => {
        const messagesDiv = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.textContent = `${data.user}: ${data.message}`;
        messagesDiv.appendChild(messageElem);
    });
});
