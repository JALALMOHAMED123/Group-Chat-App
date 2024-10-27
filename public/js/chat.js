const token = localStorage.getItem('token');

function storeRecentMessagesInLocalStorage(messages) {
  console.log('Storing recent messages in local storage:', messages);
  const limitedMessages = messages.slice(-10); 
  localStorage.setItem('messages', JSON.stringify(limitedMessages));
}

async function displayAllMessages() {
  console.log('Fetching and displaying all messages from the backend');
  try {
    const response = await axios.get('/messages', { headers: { "Authorization": token } });
    const allMessages = response.data;
    
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; 

    allMessages.forEach((message) => {
      const messageElem = document.createElement('div');
      messageElem.textContent = `${message.User.name || "You"}: ${message.content}`;
      messagesDiv.appendChild(messageElem);
    });

    storeRecentMessagesInLocalStorage(allMessages);

  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  try {
    const response = await axios.post('/message', { message }, { headers: { "Authorization": token } });
    console.log('Message sent:', response.data);
    messageInput.value = ''; 

    displayAllMessages();
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('Page loaded');
  displayAllMessages(); 

  const sendMessageButton = document.getElementById('sendMessage');
  sendMessageButton.addEventListener('click', sendMessage);
});
