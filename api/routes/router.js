const express = require('express')
const { isEmpty } = require('lodash');
const UserRegistration = require('../controllers/UserRegistration');
const UserLogin = require('../controllers/userLogin');
const UserUpdation = require('../controllers/UserUpdation');
const GetAllUsers = require('../controllers/GetAllUsers');
const middleware = require("../middlewares");
const GetSingleUser = require('../controllers/GetSingleUser');
const UserDeletion = require('../controllers/UserDeletion');
const router = express.Router()

console.log(middleware)

router.get('/login', middleware.isAuthenticated, async(req, res) => {
    const userLogin = new UserLogin();
    const status = await userLogin.aunthenticateUser(req.username, req.password);
    try {
        if(status instanceof Error) {
            console.log(status)
            return res.status(400).json({
                success: false,
                error:status,
                message: 'User not found!',
            })
        }
        if(status){
            const {_id, username, phoneNumber, email} = status.user;
            res.cookie("jwt", status["x-auth-token"], {
                secure: false,
                httpOnly: true,
            });  
            //console.log(status)
            return res.status(200).json({ 
                success: true, 
                message:"User logged in", 
                data: {_id, username, phoneNumber, email}
            })
        }
        else {
            throw Error;
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error,
            message: 'User not logged in!',
        })
    }
});

router.post('/', async (req, res) => {
    const userRegistration = new UserRegistration();
    const body = req.body;
    try {
        const status = await userRegistration.createUserData(body),
        {_id, username, phoneNumber, email} = status;
        if(status instanceof Error) {
            console.log(status)
            return res.status(400).json({
                success: false,
                message: 'User not created!',
          })
        }
        return res.status(201).json({
            success: true,
            data: {_id, username, phoneNumber, email}, 
            message: 'User created!',
        })
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({
            success: false,
            error,
            message: 'User not created!',
        })
    }
});

router.put('/:id/update', middleware.isAuthorized, async(req, res)=>{
    const userUpdation = new UserUpdation();
    const id = req.params.id;
    try {
        const status = await userUpdation.updateUser(id, req);
        if(status instanceof Error) {
            return res.status(400).json({
                success: false,
                message: 'User not updated!',
            })
        }
        if(status){
            const {_id, username, phoneNumber, email} = status;
            return res.status(201).json({
                success: true,
                data: {_id, username, phoneNumber, email},
                message: 'User updated!',
            })
        }
        else {
            throw Error;
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'User not updated!',
        })
    }
});

router.delete('/:id/delete',middleware.isAuthorized, async(req, res) => {
    const deleteUser = new UserDeletion;
    try {
        const status = await deleteUser.deleteUser(req);
        if(status instanceof Error) {
            return res.status(400).json({
                status: false,
                message: 'can not delete user',
            });
        }
        console.log(status)
        if(status) {
            return res.status(201).json({
                success: true,
                message: 'user deleted!',
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'User not deleted!',
        })
    }
});

router.get('/users', middleware.isAuthorized, async(req, res)=> {
    const getAllUsers = new GetAllUsers;
    try {
        const status = await getAllUsers.getUsers(); 
        if(status instanceof Error || isEmpty(status)) {
            return res.status(400).json({
                status: false,
                message: 'can not retrive users',
            });
        }
        if(status) {
            return res.status(201).json({
                success: true,
                data: {...status},
                message: 'fetched all user',
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'Users not fetched!',
        })
    }
});

router.get('/:id', middleware.isAuthorized, async(req, res)=> {
    const getUser = new GetSingleUser();
    try {
        const status = await getUser.getUserById(req);
        if(status instanceof Error) {
            return res.status(400).json({
                status: false,
                message: 'can not retrive user',
            });
        }
        if(status) {
            const {_id, username, phoneNumber, email} = status;
            return res.status(201).json({
                success: true,
                data: {_id, username, phoneNumber, email},
                message: 'user data!',
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'User not fetched!',
        })
    }
});

module.exports = router