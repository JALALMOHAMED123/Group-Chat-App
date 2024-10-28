const io = require('socket.io')(3000)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

socket.on('file-shared', ({ senderId, fileUrl, originalName }) => {
  const messageElem = document.createElement('div');
  messageElem.innerHTML = `<strong>${senderId}:</strong> <a href="${fileUrl}" target="_blank">${originalName}</a>`;
  document.getElementById('messages').appendChild(messageElem);
});