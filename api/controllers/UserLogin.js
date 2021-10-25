const User = require('../models/User');
const { Error } = require('mongoose');
const JWT = require('../utils/Jwt');
const HashPassword = require('../utils/hashPassword');

class UserLogin {   
  async aunthenticateUser(username, password) {
    await User.findOne({username: username}, (err, user) => {
      console.log(user)
      if (err) {
        // return res.status(400).json({ success: false, error: err })
        return new Error(err)
      }
      if(!user) {
        return new Error(`user not found`);
      }
      const isPasswordValid = await HashPassword.validateHashPassword(password, user.salt, user.hash);
      if(isPasswordValid) return new Error('incorrect user/password');
      const jwToken = JWT.generateJWT(user);
      const result = {};
      result["x-auth-token"] = jwToken;
      return result;
    })
      .catch((e)=>{console.error('An error occured',e.message), new Error(e.message)})
  }
}
  
module.exports = UserLogin;

// user
//   .save()
//   .then(()=>{
//     if (result instanceof Error) throw result;
//     console.log(result);
//     res.cookie("jwt", result["x-auth-token"], {
//       secure: false,
//       httpOnly: true,
//     });
//     return res.status(200).json({ 
//       success: true, message:"User logged in", data: user, res
//     })
//   })