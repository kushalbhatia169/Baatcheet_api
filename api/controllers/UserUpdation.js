const User = require('../models/User');
const { Error } = require('mongoose');

class UserUpdation {
    async updateUser(id, req, verify){
        return await User.findOne({ _id: id }, async(err, user) => {
                if (err) {
                    return new Error(err)
                }
                if(!user) {
                    console.log('not found')
                    return new Error(`user not found`);
                }
            })
            .then((user)=>{
                return (async()=>{
                    if(verify === 'phoneVerify') {
                        user.phoneVerified = req.body.phoneVerified;
                    }
                    else {
                        user.phoneNumber = req.body.phoneNumber
                        user.username = req.body.username
                        user.email = req.body.email
                    }
                    return user
                            .save()
                            .then((user) => {
                                return user;
                            })
                            .catch(error => {
                                return new Error(error);
                            })
                })();
            })
            .catch(err => {
                console.log(err)
                return new Error(err)
            }) 
    }
}

module.exports = UserUpdation;