const Message = require('../models/Message');4
const MessagesReciever = require('../models/MessagesReciever');

class SaveMessage {
    async saveMessage(messageData) {
        const usermsg = {
            msg : messageData.message,
        };
        const message = new Message(usermsg);
        return await message
            .save()
            .then(async (msg)=>{
                console.log(messageData);
                const messageReciever = new MessagesReciever();
                const messageId = msg._id;
                messageReciever.chats = messageId;
                messageReciever.recieverId = messageData.recieverId;
                messageReciever.senderId = messageData.senderId;
                messageReciever.isRead = messageData.isRead;
                return await messageReciever
                    .save()
                    .then(()=>{
                        console.log('Message saved');
                        return msg._id;
                    })
                    .catch((e)=>{
                        console.log(e)
                        return false;
                    });
                
            })
            .catch(err=>{
                console.log(err);
            });
    }
}

module.exports = SaveMessage;
