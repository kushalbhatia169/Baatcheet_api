const Message = require('../models/Message');4
const MessagesReciever = require('../models/MessagesReciever');

class SaveMessage {
    async saveMessage(messageData) {
        const usermsg = {
            msg : messageData.message,
        };
        console.log(usermsg);
        const message = new Message(usermsg);
        const messageReciever = new MessagesReciever();
        await message
            .save()
            .then(async (msg)=>{
                console.log(msg);
                const messageId = msg._id;
                messageReciever.messageId = messageId;
                messageReciever.recieverId = messageData.recieverId;
                messageReciever.senderId = messageData.senderId;
                await messageReciever
                    .save()
                    .then(()=>{
                        return true;
                    })
                    .catch(()=>{
                        return false;
                    });
                console.log('Message saved');
            })
            .catch(err=>{
                console.log(err);
            });
    }
}

module.exports = SaveMessage;
