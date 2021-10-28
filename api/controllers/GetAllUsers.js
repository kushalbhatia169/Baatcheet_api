const User = require('../models/User');
const { Error } = require('mongoose');

class GetAllUsers {
    async getUsers() {
        return await User.find({}, (err, users) => {
                if (err) {
                return new Error(err);
                }
                if (!users.length) {
                return new Error(`User not found`);
                }
            })
            .then((users)=>{
                const data = [];
                users.map((item, index)=>{
                    const { _id, username, phoneNumber, email } = item;
                    data.push({
                        _id,
                        username, 
                        phoneNumber, 
                        email
                    })
                    return item;
                })
                return data;
            })
            .catch(err => {return new Error(err) }) 
    }
}

module.exports = GetAllUsers;