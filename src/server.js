const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const connections = [];
const users = [];
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

io.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected. Total: ${connections.length}`);
  socket.emit('send-users', users);

  socket.on('send-message', (data) => {
    console.log(data.msg);
    io.emit('message-received', data);
  });

  socket.on('new-user', (data) => {
    console.log(data.username);
    users.push(data);
    io.emit('user-received', data);
  });

  socket.on('disconnect', (socket) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected. Total: ${connections.length}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
