const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const messagesReciever = new Schema(
    {
        chats: {
            type: Schema.Types.ObjectId,  
            required:[true, "can't be blank"], 
            foreignKey: true,
            // index: true, 
            ref: 'Message',
            unique: true,
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
        isRead: {
            type: Boolean,
            default: false,
        }
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
module.exports = mongoose.model('MessagesReciever', messagesReciever, 'messagesrecievers')