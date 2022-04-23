const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const GetSingleUserByName = require('./controllers/getSingleUserByName');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const db = require('./models/index');
require('dotenv').config();   //to read the .env file

// require('dotenv').config({path: __dirname + '/.env'});
const userRouter = require('./routes/router');
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, './server.bundle.js')));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  }
});

app.use('/api/user', userRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
  )
};

server.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

io.on('connection', (socket) => {
  console.log('Client connected to the WebSocket');
  io.emit('message', 'Hello from the server');
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  // Emitting a new message. Will be consumed by the client
  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  // });

  socket.on('new message', async (clientData) => {
    try {

      const newMessageRecieved = {
        senderId: clientData.senderId,
        recieverId: clientData.recieverId,
        msgId: clientData.id,
        message: clientData.message,
        user: clientData.user,
        isRead: false,
      }
      io.to(clientData.roomId).emit("message received", newMessageRecieved);
      // io.to(`${clientData.senderId}|${clientData.recieverId}`).emit("message received", newMessageRecieved);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('getUser', async (clientData) => {
    if (clientData?.user?.username) {
      const getUserInfo = new GetSingleUserByName();
      try {
        const user = await getUserInfo.getUserByName(clientData?.searchText);
        user && io.emit('getUser', { user: user.username, _id: user._id });
      } catch (error) {
        console.log(error);
      }
    }
  })
});