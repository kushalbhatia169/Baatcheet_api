const express = require('express');
const path = require('path');
const app = express(),
      //bodyParser = require("body-parser");
      port = 3000,
      cors = require('cors');
      db = require('./db');
      require('dotenv').config({path: __dirname + '/.env'});
// place holder for the data
const userRouter = require('./routes/router');

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, '../my-app/build')));

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', userRouter)

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});