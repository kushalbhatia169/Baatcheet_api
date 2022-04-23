
const User = require('../models/User');
// const { Error } = require('mongoose');
const { setPassword } = require('../utils/hashPassword');
class UserRegistration {
  async createUserData(body) {
    const user = new User(body);
    const { hash, salt } = await setPassword(body.password);
    user.hash = hash;
    user.salt = salt;
    user.emailVerified = false;
    user.phoneVerified = false;
    return user
      .save()
      .then((user) => {
        if (user) {
          return user;
        }
      })
      .catch(error => {
        return new Error(error);
      })
  }
}

module.exports = UserRegistration;