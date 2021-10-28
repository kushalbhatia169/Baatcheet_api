const User = require('../models/User');
const { Error } = require('mongoose');

class GetSingleUser {
    async getUserById(req){
        console.log(req.params)
        return await User.findOne({ _id: req.params.id}, (err, user) => {
                if (err) {
                    return new Error(err);
                }

                if (!user) {
                    return new Error(`Can not retrive user``User not found`);
                }
            })
            .then((user)=>{ return user })
            .catch(err =>{ return new Error(err) }) 
    }
}

module.exports = GetSingleUser;