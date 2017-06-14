const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const chat = {
  start: function(){
    server.listen(8000);
    io.set("origins", "*:*");

    io.on('connection', function (socket) {
      socket.on('newMessage', function (data) {
        socket.emit('chatUpdate',data);
        socket.broadcast.emit('chatUpdate',data);
      });
      socket.on('newUser', function (data) {
        socket.emit('chatUpdate',
          {'userName':'','text':data+' has entered the room'});
        socket.broadcast.emit('chatUpdate',
          {'userName':'','text':data+' has entered the room'});
      });
    });
  }
}

module.exports = chat;
