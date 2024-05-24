const feedbackModel = require('../models/feedbackModel')
const mongoose = require('mongoose')

const createFeedbackController = async (req, res) => {
    try {
      const { title, description, user } = req.body;
  
      // Fetch user details to get the username
      const userDetails = await mongoose.model('User').findById(user).select('username');
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
  
      // Create a new feedback instance
      const newFeedback = new feedbackModel({
        title: title || "Technical", // Default to "Technical" if title is not provided
        description,
        user,
        username: userDetails.username,
      });
  
      // Save the feedback to the database
      const savedFeedback = await newFeedback.save();
  
      // Populate the 'user' field to get the user's name along with their ID
      await savedFeedback.populate("user", "username");
  
      res.status(201).json({
        success: true,
        message: "Feedback created successfully.",
        feedback: savedFeedback,
      });
    } catch (error) {
      console.error("Error creating feedback:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating feedback.",
        error: error.message,
      });
    }
  };
  
  const getAllFeedbackController = async (req, res) => {
    try {
      // Fetch all feedback from the database
      const allFeedback = await feedbackModel.find().populate('user', 'username');
  
      res.status(200).json({
        success: true,
        message: "All feedback retrieved successfully.",
        feedback: allFeedback,
      });
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching feedback.",
        error: error.message,
      });
    }
  };

  const getFeedbackByTitleController = async (req, res) => {
    try {
      const { title } = req.params;
  
      // Find feedback with the specified title
      const feedback = await feedbackModel.find({ title });
  
      if (!feedback || feedback.length === 0) {
        return res.status(404).json({ message: "No feedback found with the specified title." });
      }
  
      res.status(200).json({
        success: true,
        feedback,
      });
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching feedback.",
        error: error.message,
      });
    }
  };

  const getFeedbackTitlesController = async (req, res) => {
    try {
      // Fetch distinct titles from the Feedback collection
      const titles = await feedbackModel.distinct('title');
  
      res.status(200).json({
        success: true,
        titles: titles,
      });
    } catch (error) {
      console.error('Error fetching feedback titles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching feedback titles.',
        error: error.message,
      });
    }
  };

  const getTechnicalFeedbackController = async (req, res) => {
    try {
      // Find all feedback with the title "Technical"
      const feedback = await feedbackModel.find({ title: 'Technical' });
  
      res.status(200).json({
        success: true,
        message: 'Technical feedback retrieved successfully.',
        feedback,
      });
    } catch (error) {
      console.error('Error fetching technical feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching technical feedback.',
        error: error.message,
      });
    }
  };

  const getContentFeedbackController = async (req, res) => {
    try {
      // Find all feedback with the title "Technical"
      const feedback = await feedbackModel.find({ title: 'Content' });
  
      res.status(200).json({
        success: true,
        message: 'Content feedback retrieved successfully.',
        feedback,
      });
    } catch (error) {
      console.error('Error fetching content feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching content feedback.',
        error: error.message,
      });
    }
  };
module.exports = {
    createFeedbackController, 
    getAllFeedbackController,
    getFeedbackByTitleController,
    getFeedbackTitlesController,
    getTechnicalFeedbackController,
    getContentFeedbackController
}