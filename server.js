const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const GetSingleUserByName = require('./controllers/GetSingleUserByName');
const SaveMessage = require('./controllers/SaveMessage');
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
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, './server.bundle.js')));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

app.use('/api/user', userRouter)

if ( process.env.NODE_ENV == "production"){ 
  app.use(express.static("client/build")); 
  const path = require("path"); 
  app.get("*", (req, res) => { 
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
 }
)};

server.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

io.on('connection', (socket) => {
  console.log('Client connected to the WebSocket');
  io.emit('message', 'Hello from the server');

  // Emitting a new message. Will be consumed by the client
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('chat message', async (clientData) => {
    console.log('Message from client: ', clientData);
    const saveMsg = new SaveMessage();
    try {
      const messageData = {
        message: clientData.msg,
        senderId: clientData.senderId,
        recieverId: clientData.recieverId,
      }
      await saveMsg.saveMessage(messageData)
        .then((id)=>{
          console.log(id)
          io.emit('chat message', { msgId: id, message: clientData.msg, user: clientData.user,  
            senderId: clientData.senderId, recieverId: clientData.recieverId });
        })
        .catch((err)=>{
          throw new Error(err);
        });
    } catch (error) {
        console.log(error);
    }
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