const token = localStorage.getItem('token');
let currentGroupId = null;

// Store only the 10 most recent messages in local storage for the selected group
function storeRecentMessagesInLocalStorage(messages) {
    const limitedMessages = messages.slice(-10);
    localStorage.setItem(`messages_${currentGroupId}`, JSON.stringify(limitedMessages));
}

// Display messages for the selected group and store recent messages
async function displayGroupMessages(groupId) {
    currentGroupId = groupId;
    console.log(`Fetching and displaying messages for group ID: ${groupId}`);

    try {
        const response = await axios.get(`/group/${groupId}/messages`, { headers: { "Authorization": token } });
        const allMessages = response.data;

        // Set the selected group name
        const groupName = document.querySelector(`#groupNames li[data-group-id="${groupId}"]`).textContent;
        document.getElementById('selectedGroupName').textContent = `Chatting in: ${groupName}`;

        // Display messages
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        allMessages.forEach((message) => {
            const messageElem = document.createElement('div');
            messageElem.textContent = `${message.User.name || "You"}: ${message.content}`;
            messagesDiv.appendChild(messageElem);
        });

        // Store the last 10 messages for the group in local storage
        storeRecentMessagesInLocalStorage(allMessages);
    } catch (error) {
        console.error('Error fetching group messages:', error);
    }
}

// Fetch and display user's groups
async function fetchGroups() {
    console.log('Fetching groups for the user');
    try {
        const response = await axios.get('/groups', { headers: { "Authorization": token } });
        const groups = response.data;
        const groupList = document.getElementById('groupNames');
        groupList.innerHTML = '';

        if (groups.length === 0) {
            console.log("No groups found. Create a new group to start chatting.");
        }

        // Display each group on the left and add click event to switch between groups
        groups.forEach(group => {
            const groupElem = document.createElement('li');
            groupElem.textContent = group.name;
            groupElem.dataset.groupId = group.id;
            groupElem.addEventListener('click', () => {
                displayGroupMessages(group.id);
            });
            groupList.appendChild(groupElem);
        });

    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

// Create a new group
async function createGroup() {
    const groupNameInput = document.getElementById('groupNameInput');
    const groupName = groupNameInput.value;
    if (!groupName) {
        alert("Group name cannot be empty.");
        return;
    }

    try {
        const response = await axios.post('/group', { name: groupName }, { headers: { "Authorization": token } });
        console.log('Group created:', response.data);
        groupNameInput.value = '';

        // Refresh the group list to include the new group
        fetchGroups();
    } catch (error) {
        console.error('Error creating group:', error.message);
    }
}

// Send a message to the current group
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (!currentGroupId) {
        alert("Please select a group first.");
        return;
    }

    try {
        const response = await axios.post(`/group/${currentGroupId}/message`, { message }, { headers: { "Authorization": token } });
        console.log('Message sent:', response.data);
        messageInput.value = '';

        // Refresh messages for the current group to include the newly sent message
        displayGroupMessages(currentGroupId);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded');
    fetchGroups();

    const sendMessageButton = document.getElementById('sendMessage');
    sendMessageButton.addEventListener('click', sendMessage);

    const createGroupButton = document.getElementById('createGroup');
    createGroupButton.addEventListener('click', createGroup);
});
