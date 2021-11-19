const express = require('express');
//const path = require('path');]
const getUniqueId = require('./config/config.cjs');
const app = express(),
  port = 8080;
//require('dotenv').config({path: __dirname + '/.env'});

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

http.listen(port, ()=>{
  console.log(`Socket Server listening on the port::8080`);
});

const clients = {};

io.on('connection', (socket) => {
  console.log('Client connected to the WebSocket');
  io.emit('message', 'Hello from the server');
  // Emitting a new message. Will be consumed by the client
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('chat message', async (clientData) => {
    console.log('Message from client: ', clientData);
    io.emit('chat message', {message:clientData.msg, user: clientData.user.username});
  });

});