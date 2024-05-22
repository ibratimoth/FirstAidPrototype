const fs = require("fs");
const mongoose = require("mongoose");
const contentModel = require("../models/contentModel");
const categoryModel = require("../models/categoryModel");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { GridFSBucket, ObjectID } = require("mongodb");
const path = require('path');
dotenv.config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Generate unique filename
    },
  });
  
  // Initialize multer upload middleware
  const upload = multer({ storage: storage }).single("video");

const createContentController = async (req, res) => {
    try {
      // Handle file upload
      upload(req, res, async function (err) {
        if (err) {
          console.error("Error uploading video:", err);
          return res.status(500).json({
            success: false,
            message: "Error uploading video.",
            error: err.message,
          });
        }
  
        // Create a new content instance
        const { title, description, category } = req.body;
        const newContent = new contentModel({
          title,
          description,
          category,
          video: req.file ? req.file.filename : "", // Store the filename in the model
        });
  
        // Save the content to the database
        await newContent.save();
  
           // Populate the category field with the injuryType
      const populatedContent = await newContent.populate('category', 'injuryType')

        res.status(201).json({
          success: true,
          message: "Content created successfully.",
          content: populatedContent,
        });
      });
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating content.",
        error: error.message,
      });
    }
  };

  const updateContentController = async (req, res) => {
    try {
      // Handle file upload
      upload(req, res, async function (err) {
        if (err) {
          console.error('Error uploading video:', err);
          return res.status(500).json({
            success: false,
            message: 'Error uploading video.',
            error: err.message,
          });
        }
  
        const { id } = req.params;
        const { title, description, category } = req.body;
  
        // Find the content by ID
        const content = await contentModel.findById(id);
        if (!content) {
          return res.status(404).json({
            success: false,
            message: 'Content not found.',
          });
        }
  
        // Update fields
        content.title = title || content.title;
        content.description = description || content.description;
        content.category = category || content.category;
        if (req.file) {
          content.video = req.file.filename; // Update the video filename if a new file is uploaded
        }
  
        // Save the updated content to the database
        await content.save();
      // Populate the category field with the injuryType
      const populatedContent = await content.populate('category', 'injuryType')
        res.status(200).json({
          success: true,
          message: 'Content updated successfully.',
          content: populatedContent,
        });
      });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating content.',
        error: error.message,
      });
    }
  };

  // Get all content controller
const getAllContentController = async (req, res) => {
    try {
      // Fetch all content from the database
      const contents = await contentModel.find().populate('category', 'injuryType');
  
      res.status(200).json({
        success: true,
        message: 'Contents retrieved successfully.',
        contents: contents,
      });
    } catch (error) {
      console.error('Error retrieving contents:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving contents.',
        error: error.message,
      });
    }
  };

  // Get single content controller
const getSingleContentController = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the content by ID from the database
    const content = await contentModel.findById(id).populate('category', 'injuryType');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content retrieved successfully.',
      content: content,
    });
  } catch (error) {
    console.error('Error retrieving content:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving content.',
      error: error.message,
    });
  }
};

// Delete content controller
const deleteContentController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the content by ID
    const content = await contentModel.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    // If there is a video file, delete it from the filesystem
    if (content.video) {
      const videoPath = path.join(__dirname, '../uploads', content.video);
      fs.unlink(videoPath, (err) => {
        if (err) {
          console.error('Error deleting video file:', err);
        }
      });
    }

    // Delete the content from the database
    await contentModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content.',
      error: error.message,
    });
  }
};

// Search content controller
const searchContentController = async (req, res) => {
  try {
    const { title, description, category } = req.query;

    // Build the search criteria
    let searchCriteria = {};

    if (title) {
      searchCriteria.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (description) {
      searchCriteria.description = { $regex: description, $options: 'i' }; // Case-insensitive search
    }

    if (category) {
      searchCriteria.category = category;
    }

    // Fetch the content based on the search criteria
    const contents = await contentModel.find(searchCriteria);

    res.status(200).json({
      success: true,
      message: 'Contents retrieved successfully.',
      contents: contents,
    });
  } catch (error) {
    console.error('Error searching contents:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching contents.',
      error: error.message,
    });
  }
};
  
// Get content by category controller
const getContentByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch the content based on the category
    const contents = await contentModel.find({ category });

    if (contents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contents found in this category.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contents retrieved successfully.',
      contents: contents,
    });
  } catch (error) {
    console.error('Error retrieving contents by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contents by category.',
      error: error.message,
    });
  }
};

module.exports = { createContentController,
    updateContentController,
    getAllContentController,
    getSingleContentController,
    deleteContentController,
    searchContentController,
    getContentByCategoryController,
 };
