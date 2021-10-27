const User = require('../models/User');
const { Error } = require('mongoose');
const {generateJWT} = require('../utils/Jwt');
const {validateHashPassword} = require('../utils/hashPassword');

class UserLogin {   
  async aunthenticateUser(username, password) {
    console.log(username, password)
    return await User.findOne({username: username}, (err, user) => {
        //console.log(user)
        if (err) {
          // return res.status(400).json({ success: false, error: err })
          return new Error(err)
        }
        if(!user) {
          return new Error(`user not found`);
        }
      })
      .then((user)=> {
        const userData = (async() => {
          const isPasswordValid = await validateHashPassword(password, user?.salt, user?.hash);
          if(!isPasswordValid) return new Error('incorrect user/password');
          const jwToken = await generateJWT(user);
          console.log(jwToken)
          const result = {};
          result["x-auth-token"] = jwToken;
          result["user"] = user;
          return result;
        })();
        return userData;
      })
      .catch((e)=>{
        return new Error(e.message);
      })
  }
}
  
module.exports = UserLogin;