const token = localStorage.getItem('token');
let currentGroupId = null;

function storeRecentMessagesInLocalStorage(messages) {
    const limitedMessages = messages.slice(-10);
    localStorage.setItem(`messages_${currentGroupId}`, JSON.stringify(limitedMessages));
}

async function displayGroupMessages(groupId) {
    currentGroupId = groupId;
    console.log(`Fetching and displaying messages for group ID: ${groupId}`);

    try {
        const response = await axios.get(`/group/${groupId}/messages`, { headers: { "Authorization": token } });
        const allMessages = response.data;

        const groupName = document.querySelector(`#groupNames li[data-group-id="${groupId}"]`).textContent;
        document.getElementById('selectedGroupName').textContent = `Chatting in: ${groupName}`;

        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        allMessages.forEach((message) => {
            const messageElem = document.createElement('div');
            messageElem.textContent = `${message.User.name || "You"}: ${message.content}`;
            messagesDiv.appendChild(messageElem);
        });

        storeRecentMessagesInLocalStorage(allMessages);
    } catch (error) {
        console.error('Error fetching group messages:', error);
    }
}

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

        fetchGroups();
    } catch (error) {
        console.error('Error creating group:', error.message);
    }
}

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

        displayGroupMessages(currentGroupId);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded');
    fetchGroups();

    const sendMessageButton = document.getElementById('sendMessage');
    sendMessageButton.addEventListener('click', sendMessage);

    const createGroupButton = document.getElementById('createGroup');
    createGroupButton.addEventListener('click', createGroup);
});

async function addUserToGroup(groupId, searchQuery) {
    try {
        const response = await axios.post(`/group/${groupId}/addUser`, {
            searchQuery,
            adminId: 
        }, {
            headers: { "Authorization": token }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

