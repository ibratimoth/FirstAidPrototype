const express = require('express')
const {registerController, 
    loginController,
    updateUser,
    getAllUsers,
    updateUserRole,
    getUserProfile,
    updateUserProfile
} = require('../controllers/authController')
const {isAdmin, requireSignIn } = require('../middlewares/authMiddleware')

const router = express.Router()

//POST REGISTER
router.post('/register', registerController)

//POST LOGIN
router.post('/login',loginController)

//GET ALL USERS
router.get('/getUsers', requireSignIn, isAdmin, getAllUsers)

//UPDATE USER ROLE
router.put('/userrole/:id/role',requireSignIn, isAdmin, updateUserRole);

//USER PROFILE
router.get('/user/:id',requireSignIn, getUserProfile);

//UPDATE USER PROFILE
router.put('/updateuser/:id',requireSignIn, updateUserProfile)

//update user
router.post('/update-user', updateUser)

router.get('/user-auth',requireSignIn, (req,res) => {
    res.status(200).send({ ok: true});
})


module.exports = router