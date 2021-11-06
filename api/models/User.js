const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const User = new Schema(
  {
    phoneNumber: { 
      type: Number, 
      required: true, 
      unique:true, 
      required:[true, "can't be blank"], 
      match: [/^[0-9]+$/, 'is invalid'], 
      index: true 
    },
    username: {
      type: String, 
      lowercase: true, 
      unique:true, 
      required: [true, "can't be blank"], 
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      index: true
    },
    email: {
      type: String, 
      lowercase: true, 
      unique:true ,
      required: [true, "can't be blank"], 
      match: [/\S+@\S+\.\S+/, 'is invalid'], 
      index: true
    },
    hash: String,
    salt: String,
    emailVerified: { 
      type: Boolean,
      default: false,
    },
    phoneVerified: { 
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

User.plugin(uniqueValidator, {message: `User is already taken.`});
module.exports = mongoose.model('user', User)