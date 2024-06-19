const express = require('express')
const {registerController, 
    loginController,
    updateUser,
    getAllUsers,
    updateUserRole,
    getUserProfile,
    updateUserProfile,
    profilePicController
} = require('../controllers/authController')
const {isAdmin, requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const {singleUpload} = require('../middlewares/multer')

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

//profile pic
router.post("/profile-picture", requireSignIn, singleUpload, profilePicController);

router.get('/user-auth',requireSignIn, isNurse, (req,res) => {
    res.status(200).send({ ok: true});
})


module.exports = router