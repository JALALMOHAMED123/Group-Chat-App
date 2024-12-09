const token = localStorage.getItem('token');
let currentGroupId = null;
let currentGroupName=null;

let currentUserId=null;

async function fetchUserProfile() {
    try {
        const response = await axios.get('/getUser', { headers: { "Authorization": token } });
        currentUserId=response.data.id;
        return response.data; 
    } catch (err) {
        console.error(err.message);
    }
}

let count=0;
async function storeRecentMessage(message) {
        try{
            const response=await axios.post(`/group/${currentGroupId}/message`,{
                message },  { headers: { "Authorization": token } } );
            console.log(response.data);
        }
        catch(err){
            console.error('Error while remove group messages:', err);
        }
}

async function displayGroupMessages(groupId,groupName) {
    currentGroupId = groupId;
    currentGroupName=groupName;
    const deleteButton = document.getElementById('delete_group');
    if(deleteButton)    deleteButton.remove();
    console.log(`Fetching and displaying messages for group ID: ${groupId}`);

    const mainContent = document.getElementById("main-content");
    document.getElementById('search-users-container').style.display='none';
    document.getElementById('userList').innerHTML='';

    if (currentGroupId) mainContent.style.display = 'flex'; 

    try {
        const messagesDiv = document.getElementById('message-container');
        messagesDiv.innerHTML = ''; // Clear all previous messages
        document.getElementById('message-input').value='';

        const response = await axios.get(`/group/${groupId}/messages`, { headers: { "Authorization": token } });
        const { allMessages, isAdmin } = response.data;
        console.log(allMessages);
        const groupName = document.querySelector(`#groupNames li[data-group-id="${groupId}"]`).textContent;
        if (groupName) {
            document.getElementById('selectedGroupName').textContent = `Chatting in: ${groupName}`;
        } else {
            console.error(`Group with ID ${groupId} not found in the group list.`);
        }

        allMessages.forEach((message) => {
            const messageElem = document.createElement('div');
            messageElem.innerHTML = `${message.User.name || "You"}: ${message.content}`;
            messagesDiv.appendChild(messageElem);
        });

        const menu_options=document.getElementById('menu-options');
        if (isAdmin) {
            const deleteButton = document.createElement('div');
            deleteButton.id = 'delete_group';
            deleteButton.textContent = 'Delete Group';
            deleteButton.onclick = () => deleteGroup(groupId);
            menu_options.insertBefore(deleteButton, menu_options.firstChild);
        }

    } catch (error) {
        console.error('Error fetching group messages:', error.message);
    }
}

async function fetchGroups() {
    try {
        const response = await axios.get('/groups', { headers: { "Authorization": token } });
        console.log('Response from server:', response); 
        const groups = response.data.groups;
        const groupList = document.getElementById('groupNames');
        groupList.innerHTML = '';

        if (groups.length === 0) {
            console.log("No groups found. Create a new group to start chatting.");
            const groupName=prompt("Create group name to chat...");
            createGroup(groupName);

            groupList.appendChild(groupName);
        }
        else{
            groups.forEach(group => {
                const groupElem = document.createElement('li');
                groupElem.textContent = group.name;
                groupElem.dataset.groupId = group.id;
                groupElem.addEventListener('click', () => {
                    displayGroupMessages(group.id,group.name);
                });

                groupList.appendChild(groupElem);

            });
        }

    } catch (error) {
        console.error('Error fetching groups:', error.message);
    }
}

async function deleteGroup(groupId){
    try{
        const res=await axios.delete(`/deleteGroup/${groupId}`, { headers: { "Authorization": token } });
        console.log(res.data.message);
        alert('Group deleted successfully');
        await fetchGroups();
            currentGroupId = null;
            currentGroupName = null;
            document.getElementById("main-content").style.display = 'none';
    }
    catch(err){
        console.log(err.message);
    }
}

async function showGroupUsers() {
    const groupUsersMenu = document.getElementById('group-users-menu');
    const menuOptions = document.getElementById('menu-options');

    // Hide other menus and show users list
    menuOptions.style.display = 'none'; // Hide menu options
    groupUsersMenu.style.display = 'block'; // Show users list

    try {
        const response = await axios.get(`/group/${currentGroupId}/users`, {
            headers: { Authorization: token },
        });
        const {users, currentUserIsAdmin} = response.data;
        console.log("showGroupUsers()",users, "Admin Status", currentUserIsAdmin);

        // Clear previous list
        groupUsersMenu.innerHTML = '';

        // Create a list of users
        const userList = document.createElement('ul');
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user.name;

            if(!user.isAdmin && currentUserIsAdmin){
            const adminIcon = document.createElement('i');
            adminIcon.className = 'fa fa-user-shield';
            adminIcon.title = 'Make Admin';
            adminIcon.style.cursor = 'pointer';
            adminIcon.style.marginLeft = '10px';
            adminIcon.onclick = async () => {
                try {
                    const res = await axios.post(
                        `/group/${currentGroupId}/makeAdmin`,
                        { userId: user.id },
                        { headers: { Authorization: token } }
                    );
                    alert(`${user.name} is now an admin.`);
                    showGroupUsers();
                } catch (error) {
                    console.error('Error making user admin:', error.message);
                }
            };
            userItem.appendChild(adminIcon);
            } else if(currentUserIsAdmin && user.id !== currentUserId) {
                const removeAdmin = document.createElement('i');
                removeAdmin.className = 'fa fa-user-times';
                removeAdmin.title = 'Remove Admin';
                removeAdmin.style.cursor = 'pointer';
                removeAdmin.style.marginLeft = '10px';
                removeAdmin.onclick = async () => {
                    try {
                        const res = await axios.post(
                            `/group/${currentGroupId}/removeAdmin`,{ userId: user.id },{ 
                            headers: { Authorization: token } }
                        );
                        alert(`${user.name} has been removed from Admin.`);
                        // Refresh the user list
                        showGroupUsers();
                    } catch (error) {
                        console.error('Error removing user:', error.message);
                    }
                };
                userItem.appendChild(removeAdmin);
            }
            if(currentUserIsAdmin && user.id !== currentUserId){
            //remove user
                const removeIcon = document.createElement('i');
                removeIcon.className = 'fa fa-trash';
                removeIcon.title = 'Remove User';
                removeIcon.style.cursor = 'pointer';
                removeIcon.style.marginLeft = '10px';
                removeIcon.onclick = async () => {
                    try {
                        const res = await axios.delete(
                            `/group/${currentGroupId}/removeUser/${user.id}`,
                            { headers: { Authorization: token } }
                        );
                        alert(`${user.name} has been removed from the group.`);
                        // Refresh the user list
                        showGroupUsers();
                    } catch (error) {
                        console.error('Error removing user:', error.message);
                    }
                };
                userItem.appendChild(removeIcon);
            }

            userList.appendChild(userItem);
        });

        groupUsersMenu.appendChild(userList);

        // Display the menu
        groupUsersMenu.style.display = 'block';
    } catch (error) {
        console.error('Error fetching group users:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const menuIcon = document.getElementById('menu-icon');
    const menuOptions = document.getElementById('menu-options');
    const menuContainer = document.getElementById('menu-container');
    const usersmenu = document.getElementById('group-users-menu');
    const usersList = document.getElementById('users-list');

    // Toggle menu visibility
    menuIcon.addEventListener('click', () => {
        menuOptions.style.display = menuOptions.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target)) {
            menuOptions.style.display = 'none';
        }
        
        if (!usersmenu.contains(event.target) && !usersList.contains(event.target)) {
            usersmenu.style.display = 'none';
        }

    });

    //Initial Load
    console.log('Page loaded');
    fetchUserProfile();
    fetchGroups();

    socket();

    document.getElementById('create-btn').addEventListener('click',()=>{
        const groupName=prompt("Group name to chat...");
        if (groupName) {
            createGroup(groupName);

            const groupItem = document.createElement('li');
            groupItem.textContent = groupName;
            const groupList = document.getElementById('groupNames');
            groupList.appendChild(groupItem);
        }
    });
    // showGroupUsers();
    document.getElementById('share_group').addEventListener('click', ()=>{
        const searchUserContainer=document.getElementById('search-users-container');
        if (searchUserContainer.style.display === 'none') searchUserContainer.style.display = 'block';
        document.getElementById('search_user').focus(); 

    }); 
    document.getElementById('search-btn').addEventListener('click',async (event)=>{
        event.preventDefault();
        const searchInput=document.getElementById('search_user').value.trim();
        try{
            const response=await axios.get(`/search/${searchInput}`, { headers: { "Authorization": token } }); //need to add headers
            const users=response.data.users;
            document.getElementById('search_user').value='';
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Clear previous results

            if (!users || users.length === 0) {
              userList.innerHTML = '<p>No users found.</p>';
              return;
            }
        
            users.forEach((user) => {
              const userItem = document.createElement('li');
              userItem.setAttribute('id', 'searchUser');
              
              //chekbox
              const checkbox= document.createElement('input');
              checkbox.type='checkbox';
              checkbox.value=user.id;

              const label=document.createElement('label');
              label.textContent=user.name;

              userItem.appendChild(checkbox);
              userItem.appendChild(label);
              userList.appendChild(userItem);
            });
            document.getElementById('add-users-btn').style.display='block';
        }
        catch(error){
            console.log("Error: ",error.message);
        }
    });

    document.getElementById('add-users-btn').addEventListener('click', async()=>{
        const selectedUsersIds=[];
        const checkboxs= document.querySelectorAll('#userList input[type="checkbox"]:checked');

        checkboxs.forEach((checkbox)=>{
          selectedUsersIds.push(checkbox.value);
        })

        if (selectedUsersIds.length === 0) {
            alert('Please select at least one user.');
            return;
          }
        
        try {
            const response=await axios.post(`/group/${currentGroupId}/addUsers`,  
                { userIds: selectedUsersIds },
                {  headers: { "Authorization": token }  });

            if (response.status === 200) {
            alert('Users successfully added to the group!');
            document.getElementById('userList').innerHTML = '';
            document.getElementById('search-users-container').style.display = 'none';
            }
        }
        catch(err){
            console.log(err.message);
        }

    })
});

async function addUserToGroup(groupId){
    try{
        
        console.log(res);
    }
    catch(err){
        console.log(err.message);
    }
}
async function createGroup(groupName){
    try {
        const response = await axios.post('/group', { name: groupName }, { headers: { "Authorization": token } });
        console.log('Group created:', response.data);
        fetchGroups();
    } catch (error) {
        console.error('Error creating group:', error.message);
    }
} 
async function addUser(groupId, searchQuery) {
    try {
        const response = await axios.post(`/group/${groupId}/addUser`, {
            searchQuery,
            adminId
        }, {
            headers: { "Authorization": token }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}
const fileInput = document.getElementById('fileInput');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let selectedFile = null;

// Update message input when a file is selected
fileInput.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        messageInput.value = `${selectedFile.name}`; // Show the file name
    }
});
async function uploadFile(groupId) {

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`/group/${groupId}/upload`, formData, {
            headers: {
                "Authorization": token,
                "Content-Type": "multipart/form-data" 
            }
        });
        const fileurl=response.data.fileurl;
        console.log("File uploaded:", fileurl);
        let filename=messageInput.value;
        messageInput.value = `<a href='${fileurl}'>${filename}</a>`; // Show the file name

    } catch (error) {
        console.error("File upload failed:", error);
    }
}


function logout(){
    localStorage.removeItem('token');
    window.location.href='/login.html';
}
async function socket(){
    const socket = io('http://localhost:3000')
    const messageContainer = document.getElementById('message-container')
    const messageInput = document.getElementById('message-input')

    let username = await fetchUserProfile();
    username=username.username;
    console.log(username);

    appendMessage('You joined')
    socket.emit('new-user', username);

    socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
    })

    socket.on('user-connected', username => {
    appendMessage(`${username} connected`)
    })

    socket.on('user-disconnected', username => {
    appendMessage(`${username} disconnected`)
    })

    document.getElementById('action-container').addEventListener('submit', async function (e) {
        e.preventDefault();

        if (selectedFile) {
            await uploadFile(currentGroupId);
            selectedFile = null; // Clear the selected file after upload
        }
        const message = messageInput.value
        storeRecentMessage(message)
        appendMessage(`You: ${message}`)
        socket.emit('send-chat-message', message)
        messageInput.value = ''
    });

    function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerHTML = message
    messageContainer.append(messageElement)
    }
}

