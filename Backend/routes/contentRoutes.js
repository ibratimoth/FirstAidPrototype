const express = require('express')
const {
    createContentController, 
    updateContentController,
    getAllContentController,
    getSingleContentController,
    deleteContentController,
    searchContentController,
    getContentByCategoryController,
    getContentsByCategoryController,
    makeContentController,
    getFileController
} = require('../controllers/contentController')
const { requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const formidable = require('express-formidable')
const router = express.Router()

//routes
//post content
router.post('/create-content', requireSignIn, isNurse, createContentController)
//post content
router.post('/make-content', requireSignIn, isNurse,formidable(), makeContentController)

//update-content
router.put('/update-content/:id', requireSignIn, isNurse, updateContentController);

//get all content controller
router.get('/get-all-content', requireSignIn,getAllContentController);

// Get single content route
router.get('/get-content/:id', requireSignIn,  getSingleContentController);


//get the file
router.get('/get-file/:id', requireSignIn, isNurse, getFileController);

//Route to get content by category
router.get('/category/:categoryId', requireSignIn, getContentsByCategoryController);


// Delete content route
router.delete('/delete-content/:id', requireSignIn, isNurse, deleteContentController);

// Search content route
router.get('/search-content', requireSignIn, searchContentController);

// Get content by category route
router.get('/get-content-by-category/:category', requireSignIn, getContentByCategoryController);

module.exports = router