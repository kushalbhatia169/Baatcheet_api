const User = require('../models/User');
// const { Error } = require('mongoose');

class GetSingleUserByName {
    async getUserByName(searchText){
        console.log(searchText);
        return await User.findOne({ username: searchText}, (err, user) => {
                if (err) {
                    return new Error(err);
                }

                if (!user) {
                    return new Error(`User not found`);
                }
            })
            .then((user)=>{ return user })
            .catch(err =>{ return new Error(err) }) 
    }
}

module.exports = GetSingleUserByName;