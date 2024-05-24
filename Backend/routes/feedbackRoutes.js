const express = require('express')
const { isAdmin, requireSignIn, isNurse } = require('../middlewares/authMiddleware')
const { createFeedbackController,
    getAllFeedbackController,
    getFeedbackByTitleController,
    getFeedbackTitlesController,
    getTechnicalFeedbackController,
    getContentFeedbackController
} = require('../controllers/feedbackController')

const router = express.Router()
//create feedBack
router.post('/create-feedback', requireSignIn, createFeedbackController)

// GET route for retrieving all feedback
router.get("/get-all-feedbacks", requireSignIn, getAllFeedbackController);

// GET route for retrieving all feedback
router.get("/get-feedback-by-title/:title", requireSignIn, getFeedbackByTitleController);

// Route to fetch distinct titles from feedback
router.get('/titles', requireSignIn, getFeedbackTitlesController);

// Route to get feedback with the title "Technical"
router.get('/technical-feedback',requireSignIn, isAdmin, getTechnicalFeedbackController);

// Route to get content with the title "Technical"
router.get('/content-feedback',requireSignIn,isNurse, getContentFeedbackController);

module.exports = router