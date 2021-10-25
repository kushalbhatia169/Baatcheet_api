
const User = require('../models/User');
const { Error } = require('mongoose');
const HashPassword = require('../utils/hashPassword');

class UserRegistration {
  async createUserData(body) {
  
  await User.findOne({ username: body.username }, (user) => {
    //console.log(username, user)
    if (user) {
      return new Error('User already exist');
    }
    if (!body) {
      return new Error('You must provide a User');
    }

    if(!user) {
      const user = new User(body);
      const hashPassword = new HashPassword();
      const { hash, salt } = await hashPassword.setPassword(password);
      user.hash = hash;
      user.salt = salt;
      user
        .save()
        .then(() => {
          return user;
        })
        .catch(error => {
          return new Error(error);
        })
 
    }
  })
}
}

module.exports = UserRegistration;

// const base64Auth =  await checkAuthenicaton(req);
//   const [username, password] = base64Auth;
//   const body = req.body;
//   if(!username && !password) {
//     return res.status(401).json({ message: 'Missing Authorization Header' });
//   }
//   if(username !== body.username) {
//     return res.status(400).json({
//       success: false,
//       error: 'body and base auth username does not match',
//     })
//   }