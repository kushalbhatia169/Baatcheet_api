const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const app = express(),
  port = 8000,
  cors = require('cors');
  db = require('./models/index');
require('dotenv').config({path: __dirname + '/.env'});
const userRouter = require('./routes/router');
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));
app.use(cookieParser());

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api/user', userRouter)
app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});