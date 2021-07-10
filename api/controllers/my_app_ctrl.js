const { user } = require('../db');
const User = require('../models/my_app_model')

checkAuthenicator = async(req, res) =>{
    // check for basic auth header
    //console.log(req.headers.authorization)
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        // return res.status(401).json({ message: 'Missing Authorization Header' });
        return false;
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    // console.log(username, password);
    const user = await authenticate({ username, password })
        .then((user)=>{
            const { isValidate, user : userData } = user
            if (!isValidate) {
                return userData;
            }
            if(isValidate){
                return userData;
            }
            return userData;
        });
    return user;
}

const authenticate = async({ username, password }) => {
    const user = await User.findOne({username: username}, (err, user) => {
        // console.log(user)
        if (err) {
            return false;
        }
        if (!user) {
            return false;
        }
    });

    const validate = {};
    if(user){
        user
            .validPassword(password, user.salt, user.hash)
            .then((isValidate)=>{
                if(isValidate) {
                    validate.isValidate = true;
                    validate.user = user;
                }
                else {
                    validate.isValidate = false;
                    validate.user = null;
                }
            })
            .catch(err => console.log(err))
    }
    return validate;
}

userLogin = async(req, res) => {
    const checkUser = await checkAuthenicator(req, res)
        .then((checkUser)=>{
            if (!checkUser) {
                return res.status(400).json({ success: false, error: `Invalid or missing credentials` })
            }
            return checkUser;
        })
    //console.log(checkUser?.username, checkUser?.phoneNumber, checkUser?.email);
    if(checkUser?.username){
        //console.log(checkUser?.username, checkUser?.phoneNumber, checkUser?.email);
        const user = checkUser;
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
}

createUser = async(req, res) => {
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a User',
        })
    }
    if(!username && !password) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    if(username !== body.username) {
        return res.status(400).json({
            success: false,
            error: 'body and base auth username does not match',
        })
    }
    const user = await User.findOne({ username: username }, (user) => {
        //console.log(username, user)
        if (user) {
            //console.log('here')
            return res.status(404).json({
                err,
                message: 'User already exist!',
            })
            
        }
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a User',
            })
        }
    })

    if(!user){
        const user = new User(body);

        if (!user) {
            return res.status(400).json({ success: false, error: err })
        }

        const user_password = user.setPassword(password);
        const data = user.toAuthJSON(user);
        user.hash = user_password.hash;
        user.salt = user_password.salt;
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
    } else{
        return res.status(404).json({
            message: 'User already exist!',
        })
    }
}

updateUser = async (req, res) => {
    const checkUser = await checkAuthenicator(req, res)
        .then((checkUser)=>{
            if (!checkUser) {
                return res.status(400).json({ success: false, error: `Invalid or missing credentials` })
            }
            return checkUser;
        })
    //console.log(checkUser?.username, checkUser?.phoneNumber, checkUser?.email);
    if(checkUser?.username) {
        //console.log(checkUser?.username, checkUser?.phoneNumber, checkUser?.email);
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
            const isTokenExpired = user.checkExpireJWT(body.token);
            if(isTokenExpired){
                return res.status(404).json({
                    err,
                    message: 'session expired',
                })
            }
            if (body.token !== user.token) {
                return res.status(404).json({
                    err,
                    message: 'Invalid token',
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
}

deleteUser = async (req, res) => {
    const checkUser = await checkAuthenicator(req, res)
        .then((checkUser)=>{
            if (!checkUser) {
                return res.status(400).json({ success: false, error: `Invalid or missing credentials` })
            }
            return checkUser;
        })
    //console.log(checkUser?.username, checkUser?.phoneNumber, checkUser?.email);
    if(checkUser?.username) {
        await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` })
            }
            return res.status(200).json({ success: true, data: user })
        }).catch(err => console.log(err))
    }
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
