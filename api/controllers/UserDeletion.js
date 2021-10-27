class UserDeletion {
    async deleteUser (req) {
        const isTokenExpired = await validateJWT(req?.cookies?.jwt);
        if(isTokenExpired) return new Error('session expired');
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