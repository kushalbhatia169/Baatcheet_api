const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const messagesReciever = new Schema(
    {
        messageId: {
            type: String,  
            required:[true, "can't be blank"], 
            foreignKey: true,
            // index: true, 
            unique: true,
            foreignKey: true 
        },
        senderId: { 
            type: String, 
            unique:false, 
            foreignKey: true,
            required:[true, "can't be blank"], 
            index: true 
        },
        recieverId: { 
            type: String, 
            unique:false, 
            foreignKey: true,
            required:[true, "can't be blank"], 
            index: true 
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

messagesReciever.plugin(uniqueValidator, {message: `Message is already there.`});
module.exports = mongoose.model('MessagesReciever', messagesReciever)