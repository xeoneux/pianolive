const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const pianists = {};

io.on('connection', socket => {
  socket.on('room', data => {
    let { room, user } = JSON.parse(data);
    room = room || 'default';
    console.log(user, 'joined', room);
    pianists[socket.id] = { user, room };
    socket.join(room);
    socket
      .in(room)
      .emit('usersInRoom', JSON.stringify({ users: fetchUsers(socket, room) }));
  });
  socket.on('noteOn', data => {
    const room = JSON.parse(data).room || 'default';
    console.log(data);
    socket.in(room).broadcast.emit('noteOn', data);
  });
  socket.on('noteOff', data => {
    const room = JSON.parse(data).room || 'default';
    socket.in(room).broadcast.emit('noteOff', data);
  });
  socket.on('disconnect', () => {
    const room = pianists[socket.id].room;
    console.log(pianists[socket.id].user, 'left', room);
    delete pianists[socket.id];
    socket
      .in(room)
      .emit('usersInRoom', JSON.stringify({ users: fetchUsers(socket, room) }));
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`listening on *:4000`);
});

const fetchUsers = (socket, room) => {
  const roomFound = io.sockets.adapter.rooms[room];
  if (roomFound) {
    const ids = Object.keys(roomFound.sockets);
    return ids.map(id => pianists[id].user);
  }
  return [];
};
