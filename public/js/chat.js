document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    async function fetchActiveUsers() {
        try {
            const response = await axios.get('/chat', {
                headers: { "Authorization": token }
            });
            var username = response.data.user.name;
            document.getElementById('username').textContent = `Logged in as: ${username}`;
        } catch (error) {
            console.error('Error fetching active user:', error);
        }
    }

    async function fetchMessages() {
        try {
            const response = await axios.get('/messages', {
                headers: { "Authorization": token }
            });
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = ''; 
            const users=response.data;

            users.forEach(data => {
                const messageElem = document.createElement('div');
                messageElem.textContent = `${data.User.name}: ${data.content}`;
                messagesDiv.appendChild(messageElem);
            });
        } catch (error) {
            console.error('Error fetching messages:', error.message);
        }
    }

    setInterval(fetchMessages, 1000);

    fetchActiveUsers();

    const sendMessageButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    
    sendMessageButton.addEventListener('click', async () => {
        const message = messageInput.value;
        
        await axios.post('/message', { message }, {
            headers: { "Authorization": token }
        });

        messageInput.value = '';
    });
});
