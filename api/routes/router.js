const express = require('express')
const checkAuthentication = require("../utils/base64Auth")
const My_app_Ctrl = require('../controllers/my_app_ctrl')
const UserRegistration = require('../controllers/UserRegistration')
const UserLogin = require('../controllers/userLogin')

const router = express.Router()

router.post('/login', async(req, res) => {
    const base64Auth =  await checkAuthentication(req);
    const [username, password] = base64Auth;
    const body = req.body;
    if(!username && !password) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    try {
        const userLogin = new UserLogin();
        const status = await userLogin.aunthenticateUser(body.username, body.password);
        if(status instanceof Error) {
            return res.status(400).json({
                error:status,
                message: 'User not found!',
            })
        }
        res.cookie("jwt", status["x-auth-token"], {
            secure: false,
            httpOnly: true,
        });
        return res.status(200).json({ 
            success: true, 
            message:"User logged in", 
            data: status?.user
        })
    } catch (error) {
        return res.status(400).json({
            error,
            message: 'User not logged in!',
        })
    }
})

router.post('/', async (req, res) => {
    const userRegistration = new UserRegistration();
    const body = req.body;
    try {
        const status = await userRegistration.createUserData(body);
        console.log('status', status)
        if(status instanceof Error) {
            return res.status(400).json({
            message: 'User not created!',
          })
        }
        return res.status(201).json({
            success: true,
            data: status, 
            message: 'User created!',
        })
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({
            error,
            message: 'User not created!',
        })
    }
})

// router.put('/:id/update', My_app_Ctrl.updateUser)
// router.delete('/:id/delete', My_app_Ctrl.deleteUser)
// router.get('/:id', My_app_Ctrl.getUserById)
// router.get('/users', My_app_Ctrl.getUsers)

module.exports = router