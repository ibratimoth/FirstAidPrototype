const express = require('express')
const {
    createContentController, 
    updateContentController,
    getAllContentController,
    getSingleContentController,
    deleteContentController,
    searchContentController,
    getContentByCategoryController,
    getVideoById
} = require('../controllers/contentController')
const { requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const router = express.Router()

//routes
//post content
router.post('/create-content', requireSignIn, isNurse, createContentController)

//update-content
router.put('/update-content/:id', requireSignIn, isNurse, updateContentController);

//get all content controller
router.get('/get-all-content', requireSignIn,getAllContentController);

// Get single content route
router.get('/get-content/:id', requireSignIn,  getSingleContentController);

// Route to get video by ID
router.get('/video/:id', requireSignIn, getVideoById);

// Delete content route
router.delete('/delete-content/:id', requireSignIn, isNurse, deleteContentController);

// Search content route
router.get('/search-content', requireSignIn, searchContentController);

// Get content by category route
router.get('/get-content-by-category/:category', requireSignIn, getContentByCategoryController);

module.exports = router