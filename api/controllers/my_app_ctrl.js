const User = require('../models/my_app_model')

userLogin = async(req, res) =>{
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a User',
        })
    }

    await User.findOne({ username: body.username}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        const isValidate = user.validPassword(body.password, user.salt, user.hash);
        if(isValidate){
            const data = user.toAuthJSON(user);
            const { token } = data;
            user.token = token;
            user
                .save()
                .then(()=>{
                    return res.status(200).json({ 
                        success: true, message:"User logged in", data: data 
                    })
                })
                .catch((e)=>{console.error('An error occured',e.message)})
        }
        else{
            return res
                .status(404)
                .json({ success: false, error: `Invalid UserName or Password` })
        }
    }).catch(err => console.log(err))
}

createUser = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a User',
        })
    }
    User.findOne({ username: body.username }, (user) => {
        if (user) {
            return res.status(404).json({
                err,
                message: 'User already exist!',
            })
        }
        else {
            if (!body) {
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a User',
                })
            }

            const user = new User(body);

            if (!user) {
                return res.status(400).json({ success: false, error: err })
            }

            const password = user.setPassword(body.password);
            const data = user.toAuthJSON(user);
            user.hash = password.hash;
            user.salt = password.salt;
            user.token = data.token;
            user
                .save()
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        data: data, 
                        message: 'User created!',
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'User not created!',
                    })
                })
        }
    })
}

updateUser = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        user.phoneNumber = body.phoneNumber
        user.username = body.username
        user.email = body.email
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        if (user.token !== body.token) {
            return res
                .status(404)
                .json({ success: false, error: `Can not delete user` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    const body  = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await User.findOne({ _id: req.params.id}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        if (user.token !== body.token) {
            return res
                .status(404)
                .json({ success: false, error: `Can not retrive user` })
        }

        const data = {
            phoneNumber : user.phoneNumber,
            username : user.username,
            email : user.email,
        }
        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

getUsers = async ( res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

module.exports = {
    userLogin,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
}
