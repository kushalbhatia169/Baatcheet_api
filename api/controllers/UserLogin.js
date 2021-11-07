const User = require('../models/User');
//const { Error } = require('mongoose');
const {generateJWT} = require('../utils/Jwt');
const {validateHashPassword} = require('../utils/hashPassword');

class UserLogin {   
  async aunthenticateUser(username, password) {
    console.log(username, password)
    return await User.findOne({username: username}, (err) => {
        //console.log(user)
        if (err) {
          // return res.status(400).json({ success: false, error: err })
          return new Error(err)
        }
      })
      .then((user)=> {
        if(!user) {
          return new Error(`user not found`);
        }
        if(!user.emailVerified && !user.phoneVerified) {
          return new Error(`Please verify phone number and email before login. 
          <br></br> An Email sent to your account.|${user._id}|${user.email}`);
        }
        if(!user.emailVerified) {
          return new Error(`Please verify your email before login. 
          <br></br> An Email sent to your account.|${user._id}|${user.email}`);
        }
        if(!user.phoneVerified) {
          return new Error(`Please verify your phone number before login.|${user._id}|false`);
        }
        return (async() => {
          const isPasswordValid = await validateHashPassword(password, user?.salt, user?.hash);
          if(!isPasswordValid) return new Error('incorrect user/password');
          const jwToken = await generateJWT(user);
          const result = {};
          result["x-auth-token"] = jwToken;
          result["user"] = user;
          return result;
        })();
      })
      .catch((e)=>{
        return new Error(e.message);
      })
  }
}
  
module.exports = UserLogin;