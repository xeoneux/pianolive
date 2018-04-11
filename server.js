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
    let { room, user, color } = JSON.parse(data);
    room = room || 'default';
    console.log(user, 'joined', room);
    pianists[socket.id] = { room, user, color };
    socket.join(room);
    socket.emit('usersInRoom', fetchUsers(socket, room));
    socket.in(room).emit('usersInRoom', fetchUsers(socket, room));
  });
  socket.on('noteOn', data => {
    const room = JSON.parse(data).room || 'default';
    socket.in(room).broadcast.emit('noteOn', data);
  });
  socket.on('noteOff', data => {
    const room = JSON.parse(data).room || 'default';
    socket.in(room).broadcast.emit('noteOff', data);
  });
  socket.on('nameChange', name => {
    const pianist = pianists[socket.id];
    if (pianist) {
      pianist.user = name;
      socket
        .in(pianist.room)
        .emit('usersInRoom', fetchUsers(socket, pianist.room));
    }
  });
  socket.on('disconnect', () => {
    const user = pianists[socket.id];
    if (user) {
      const room = pianists[socket.id].room;
      console.log(pianists[socket.id].user, 'left', room);
      delete pianists[socket.id];
      socket.in(room).emit('usersInRoom', fetchUsers(socket, room));
    }
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`listening on *:4000`);
});

const fetchUsers = (socket, room) => {
  const roomFound = io.sockets.adapter.rooms[room];
  let users = [];
  if (roomFound) {
    const ids = Object.keys(roomFound.sockets);
    users = ids.map(id => pianists[id]);
  }
  return JSON.stringify({ users });
};
