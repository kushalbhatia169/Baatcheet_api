const express = require('express')

const My_app_Ctrl = require('../controllers/my_app_ctrl')

const router = express.Router()

router.post('/user/login', My_app_Ctrl.userLogin)
router.post('/user', My_app_Ctrl.createUser)
router.put('/user/:id', My_app_Ctrl.updateUser)
router.delete('/user/:id', My_app_Ctrl.deleteUser)
router.get('/user/:id', My_app_Ctrl.getUserById)
router.get('/users', My_app_Ctrl.getUsers)

module.exports = router