const Message = require('../models/Message');4
const MessagesReciever = require('../models/MessagesReciever');

class GetChats {
    async getChats(req) {
        const { clientId,  userId } = req.body;
        return await MessagesReciever.find({ $or: [
                { senderId: userId, recieverId: clientId },
                { senderId: clientId, recieverId: userId }
            ]},)
            .populate('chats') // multiple path names in one requires mongoose >= 3.6
            .then(async (usersDocuments) => {
                return usersDocuments;
            })
        .catch(err => {
            return new Error(err);
        })
    }
}

module.exports = GetChats;