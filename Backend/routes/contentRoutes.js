const express = require('express')
const {
    createContentController, 
    updateContentController
} = require('../controllers/contentController')
const { requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const router = express.Router()

//routes
//post content
router.post('/create-content', requireSignIn, isNurse, createContentController)

//update-content
router.put('/update-content/:id', requireSignIn, isNurse, updateContentController);

module.exports = router