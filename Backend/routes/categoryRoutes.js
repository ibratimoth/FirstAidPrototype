const express = require('express')
const { isAdmin, requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const { createCategoryController, 
    updateCategoryController,
categoryController,
singleCategoryController,
deleteCategoryController} = require('../controllers/categoryController')

const router = express.Router()
//create category
router.post('/create-category', requireSignIn, isNurse, createCategoryController)

//Update Category
router.put('/update-category/:id', requireSignIn, isNurse, updateCategoryController)

//getAll
router.get('/get-category', categoryController)

//get Single category
router.get('/single-category/:id',singleCategoryController)

//Delete Category
router.delete('/delete-category/:id', requireSignIn, isNurse, deleteCategoryController)
module.exports = router