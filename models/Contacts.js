const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const Contacts = new Schema(
  {
    clientId: {
        type: String,  
        required:[true, "can't be blank"], 
        // index: true, 
        unique:false,
        foreignKey: true 
    },
    userId: { 
      type: String, 
      unique:true, 
      required:[true, "can't be blank"], 
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
    chats: Array,
  },
  { timestamps: true },
)

Contacts.plugin(uniqueValidator, {message: `User is already taken.`});
module.exports = mongoose.model('contacts', Contacts)