const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const connections = [];
const users = [];
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join('dist')));

app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

io.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected. Total: ${connections.length}`);
  socket.emit('update-users', users);

  socket.on('send-message', (data) => {
    console.log(data.msg);
    io.emit('message-received', data);
  });

  socket.on('new-user', (user) => {
    console.log(user.username);
    socket.username = user.username;
    users.push(socket.username);
    io.emit('update-users', users);
    console.log(`Connected ${socket.username}. All users: ${users}`);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnecting ${socket.username}. Total: ${connections.length}`);
    users.splice(users.indexOf(socket.username), 1);
    console.log(`Disconnected ${socket.username}. All users: ${users}`);
    connections.splice(connections.indexOf(socket), 1);
    io.emit('update-users', users);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
