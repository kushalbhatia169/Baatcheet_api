const jwt = require('jsonwebtoken');
const secret = require('../config/config');

generateJWT = async(user) =>{
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  process.env['secret'] = secret();
  //console.log('secret',process.env['secret'])
  return jwt.sign({
    id: user._id,
    username: user.username,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env['secret']);
};
  
toAuthJSON = (user) =>{
  return {
    phoneNumber: user.phoneNumber,
    username: user.username,
    email: user.email,
    _id: user._id,
    token: user.generateJWT(user),
  };
};
  
checkExpireJWT = (token) =>{
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  const secret = process.env['secret'];
  return jwt.verify(token, secret, (err) => {
    if (err) {
      return err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: parseInt(exp.getTime() / 1000),
      }      
    }
  });
}  

module.exports = {
  generateJWT,
  toAuthJSON,
  checkExpireJWT
}