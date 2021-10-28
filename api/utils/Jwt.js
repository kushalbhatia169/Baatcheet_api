const jwt = require('jsonwebtoken');
//will use dynamic secret it in production but not in development 
// const secret = require('../config/config');

generateJWT = async(user) =>{
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  //will use dynamic secret it in production but not in development 
  // process.env['secret'] = secret();
  return jwt.sign({
    id: user._id,
    username: user.username,
    exp: parseInt(exp.getTime() / 1000),
  }, '54ef8c4e-b8e7-4cf7-b4e5-35643f814fa6' /* process.env['secret'] */);
};  

module.exports = {
  generateJWT
}