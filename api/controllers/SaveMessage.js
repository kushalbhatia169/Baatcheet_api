const Message = require('../models/Message');4
const MessagesReciever = require('../models/MessagesReciever');

class SaveMessage {
    async saveMessage(messageData) {
        const usermsg = {
            msg : messageData.message,
        };
        console.log(usermsg);
        const message = new Message(usermsg);
        await message
            .save()
            .then(async (msg)=>{
                console.log(msg);
                const messageReciever = new MessagesReciever();
                const messageId = msg._id;
                messageReciever.chats = messageId;
                messageReciever.recieverId = messageData.recieverId;
                messageReciever.senderId = messageData.senderId;
                await messageReciever
                    .save()
                    .then(()=>{
                        return true;
                    })
                    .catch((e)=>{
                        console.log(e)
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
