const User = require('../models/User');
// const { Error } = require('mongoose');
class UserDeletion {
    async deleteUser (req) {
        return await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
                if (err) {
                    return new Error(err);
                }
                if (!user) {
                    return new Error(`User not found`);
                }
            })
            .then(() => { return 'User Deleted' })
            .catch(err => { return new Error(err) });
    }
}
  
module.exports = UserDeletion;