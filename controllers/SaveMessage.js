const Message = require('../models/Message'); 4
const MessagesReciever = require('../models/MessagesReciever');
const Contacts = require('../models/Contacts');
class SaveMessage {
    async saveMessage(req) {
        console.log(req.body)
        const { senderId, recieverId, message: clientMessage, isRead } = req.body;
        const userMsg = {
            msg: clientMessage,
        };
        const message = new Message(userMsg);
        // message = await message.populate("senderId").execPopulate();
        // message = await message.populate("chat").execPopulate();
        return await message
            .save()
            .then(async (msg) => {
                const messageReciever = new MessagesReciever();
                const messageId = msg._id;
                messageReciever.chats = messageId;
                messageReciever.recieverId = recieverId;
                messageReciever.senderId = senderId;
                messageReciever.isRead = isRead;
                messageReciever.users = await Contacts.populate(senderId, {
                    path: "messageReciever.users",
                    select: "userId username",
                });
                return await messageReciever
                    .save()
                    .then(() => {
                        console.log('Message saved');
                        return {
                            senderId, recieverId, message: clientMessage, isRead,
                            users: messageReciever.users
                        };
                    })
                    .catch((e) => {
                        console.log(e);
                        return false;
                    });

            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = SaveMessage;
