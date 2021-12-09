const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const message = new Schema(
    {
        msg: {
            type: String,  
            required:[true, "can't be blank"], 
            unique: false,
            index: false,
            ref: 'messagesReciever',
        },
        // groupId: {
        //     type: String, 
        //     lowercase: true, 
        //     unique:true,
        //     foreignKey: true, 
        //     required: [true, "can't be blank"], 
        //     match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        //     index: true
        // },
    },
    { timestamps: true },
)

message.plugin(uniqueValidator, {message: `User is already taken.`});
module.exports = mongoose.model('Message', message, 'messages')