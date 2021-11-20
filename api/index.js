const express = require('express');
//const path = require('path');]
const getUniqueId = require('./config/config.cjs');
const GetSingleUserByName = require('./controllers/GetSingleUserByName');
const app = express(),
db = require('./models/index');
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

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

  socket.on('getUser', async(clientData) => {
    if(clientData?.user?.username){
      const getUserInfo = new GetSingleUserByName();
      try {
        const user = await getUserInfo.getUserByName(clientData?.searchText);
        user && io.emit('getUser', {user: user.username, _id: user._id});
      } catch (error) {
        console.log(error);
      }
    }
  })
});