const Contacts = require("../models/Contacts");

class GetChatId {

    constructor(senderId, receiverId) {
        this.getChatId = this.getChatId.bind(this);
        this.senderId = senderId;
        this.receiverId = receiverId;
    };

    async getChatId() {
        console.log(this.senderId, this.receiverId);
        return await Contacts.find({
            $or: [
                { clientId: this.receiverId, userId: this.senderId }
            ]
        }, (user, err) => {
            if (err) {
                return new Error(err);
            }
            if (!user?.length) {
                return new Error("No contacts found");
            }
        })
            .then(user => {
                return user[0]._id;
            })
            .catch((err) => {
                return new Error(err);
            });
    }
}

module.exports = GetChatId;