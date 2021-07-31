const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/config');

const My_App = new Schema(
  {
    phoneNumber: { type: Number, required: true, unique:true, required:[true, "can't be blank"], match: [/^[0-9]+$/, 'is invalid'], index: true },
    username: {type: String, lowercase: true, unique:true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique:true ,required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    hash: String,
    salt: String,
    token: String,
  },
  { timestamps: true },
)

My_App.methods.setPassword = (password) =>{
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return {
    salt,
    hash,
  }
};

My_App.methods.validPassword = async(password, salt, user_hash) =>{ 
  //console.log(password, salt, user_hash)
  if(!password){
    return false;
  } 
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return user_hash === hash;
};

My_App.methods.generateJWT = (user) =>{
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

My_App.methods.toAuthJSON = (user) =>{
  return {
    phoneNumber: user.phoneNumber,
    username: user.username,
    email: user.email,
    _id: user._id,
    token: user.generateJWT(user),
  };
};

My_App.methods.checkExpireJWT = async (token) => {
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
My_App.plugin(uniqueValidator, {message: `User is already taken.`});
module.exports = mongoose.model('my-app', My_App)