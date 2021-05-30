const express = require('express');
const path = require('path');
const app = express(),
      //bodyParser = require("body-parser");
      port = 3000,
      cors = require('cors');
      db = require('./db');
// place holder for the data
const userRouter = require('./routes/router');

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

/*
const users = [
  {
    firstName: "first",
    lastName: "last",
    email: "abc@gmail.com"
  },
  {
    firstName: "first2",
    lastName: "last2",
    email: "abc@gmail.com"
  },
  {
    firstName: "first3",
    lastName: "last3",
    email: "abc@gmail.com"
  }
];

app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});
console.log(users[1]);
app.delete('/api/deleteUser', (req, res) => {
  const user = req.body.user;
  console.log('Deleting user:::::', user);
  const index = users.indexOf(user);
  console.log(index, users.firstName)
  users.pop();
  res.json("user deleted");
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});
*/
