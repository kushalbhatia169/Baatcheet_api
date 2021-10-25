const express = require('express')
const checkAuthentication = require("../utils/base64Auth")
const My_app_Ctrl = require('../controllers/my_app_ctrl')
const UserRegistration = require('../controllers/UserRegistration')

const router = express.Router()

router.post('/login', (req, res) => {
    const base64Auth =  await checkAuthentication(req);
    const [username, password] = base64Auth;
    const body = req.body;
    if(!username && !password) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    if(username !== body.username) {
        return res.status(400).json({
        success: false,
        error: 'body and base auth username does not match',
        })
    }
})

router.post('/', (req, res) => {
    const userRegistration = new UserRegistration();
    const body = req.body;
    try {
        const status = await userRegistration.createUserData(body);
        if(status instanceof Error) {
            return res.status(400).json({
            error:status.message,
            message: 'User not created!',
          })
        }
        return res.status(201).json({
            success: true,
            data: status, 
            message: 'User created!',
          })
    } catch (error) {
        return res.status(400).json({
            error,
            message: 'User not created!',
        })
    }
})

router.put('/:id/update', My_app_Ctrl.updateUser)
router.delete('/:id/delete', My_app_Ctrl.deleteUser)
router.get('/:id', My_app_Ctrl.getUserById)
router.get('/users', My_app_Ctrl.getUsers)

module.exports = router