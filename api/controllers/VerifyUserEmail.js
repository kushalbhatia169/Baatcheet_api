const User = require('../models/User');
const Token = require('../models/token');
const { Error } = require('mongoose');

class VerifyUserEmail {
    async verifyUserEmail(req) {
        return await User.findOne({ _id: req.params.id }, async(err, user) => {
            if(err) {return new Error(err);}
            if (!user) return new Error('User not found');
        })
        .then((user)=> {
            return (async()=>{
                const token = await Token.findOne({
                    userId: user._id,
                    token: req.params.token,
                });
                console.log(token);
                if (!token) return new Error('Invalid token');
                    user.emailVerified= true;
                    return user
                            .save()
                            .then((user) => {
                                (async()=>{await Token.findByIdAndRemove(token._id)})();
                                return user;
                            })
                            .catch(error => {
                                return new Error(error);
                            })
                })();
            // })()
        })
        .catch((err)=>{
            return new Error(err);
        });
    }  
}

module.exports = VerifyUserEmail;