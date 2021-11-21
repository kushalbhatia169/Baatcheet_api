const Contacts = require("../models/Contacts");

class GetContacts {
    async getAllContacts(req){
        return await Contacts.find({clientId: req.params.clientId},(users, err)=>{
            if(err){
                return new Error(err);
            }
            if(!users.length){
                return new Error("No contacts found");
            }
        })
        .then((users)=>{
            return users;
        })
        .catch((err)=>{
            return new Error(err);
        });
    }
}

module.exports = GetContacts;