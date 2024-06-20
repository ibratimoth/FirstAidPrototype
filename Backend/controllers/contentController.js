const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const fs = require('fs')
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const contentModel = require("../models/contentModel");

dotenv.config();

const mongoURI = process.env.MONGO_URL;

// Connect to MongoDB
connectDB();

// Initialize GridFS and GridFSBucket
let gfs, gridfsBucket;

mongoose.connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'videos',
  });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('videos');
});

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      bucketName: 'videos', // Bucket name for storing files
      filename: Date.now() + '-' + file.originalname, // Unique filename
    };
  },
});

// Create multer middleware
const upload = multer({ storage });

// Controller to handle content creation
const createContentController = async (req, res) => {
  try {
    // Handle file upload
    upload.single('video')(req, res, async function (err) {
      if (err) {
        console.error('Error uploading video:', err);
        return res.status(500).json({
          success: false,
          message: 'Error uploading video.',
          error: err.message,
        });
      }

      // Create a new content instance
      const { title, description, category } = req.body;

       // Fetch user details to get the username
       const categoryDetails = await mongoose.model('Category').findById(category).select('injuryType');
       if (!categoryDetails) {
         return res.status(404).json({
           success: false,
           message: 'category not found.',
         });
       }
      const newContent = new contentModel({
        title,
        description,
        category,
        injuryType: categoryDetails.injuryType,
        video: req.file ? req.file.id : '', // Store the file ID in the model
      });

      // Save the content to the database
      await newContent.save();

      // Populate the category field with the injuryType
      const populatedContent = await newContent.populate('category', 'injuryType');

      res.status(201).json({
        success: true,
        message: 'Content created successfully.',
        content: populatedContent,
      });
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating content.',
      error: error.message,
    });
  }
};

const makeContentController = async (req, res) => {
  try {
    const { title, category, description } = req.fields
    // const { pdf } = req.files

    const categoryDetails = await mongoose.model('Category').findById(category).select('injuryType');
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: 'category not found.',
      });
    }

    const newContent = new contentModel({
      title,
      category,
      description,
      injuryType: categoryDetails.injuryType 
    });

  //   if (pdf) {
  //     newContent.pdf.data = fs.readFileSync(pdf.path); // Update to handle pdf file
  //     newContent.pdf.contentType = pdf.type; // Update to handle pdf file
  // }

   // Save the content to the database
   await newContent.save();

   // Populate the category field with the injuryType
   const populatedContent = await newContent.populate('category', 'injuryType');

   res.status(201).json({
     success: true,
     message: 'Content created successfully.',
     content: populatedContent,
   });
  
  } catch (error) {
    console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while creating content',
            error
        });
  }
}

const updateContentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    // const { pdf } = req.files;

    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, category) are required.',
      });
    }

    // Validate PDF file size if provided
    // if (pdf && pdf.size > 1000000) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'PDF should be less than 1MB',
    //   });
    // }

    // Find the existing content
    const existingContent = await contentModel.findById(id);
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    // Find category details
    const categoryDetails = await mongoose.model('Category').findById(category).select('injuryType');
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Update content fields
    existingContent.title = title;
    existingContent.category = category;
    existingContent.description = description;
    existingContent.injuryType = categoryDetails.injuryType;

    // Handle PDF file
    // if (pdf) {
    //   existingContent.pdf.data = fs.readFileSync(pdf.path);
    //   existingContent.pdf.contentType = pdf.type;
    // }

    // Save the updated content to the database
    await existingContent.save();

    // Populate the category field with the injuryType
    const populatedContent = await existingContent.populate('category', 'injuryType');

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Content updated successfully.',
      content: populatedContent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while updating content',
      error,
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

const getContentsByCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).send({
        success: false,
        message: 'Category ID is required',
      });
    }

    const contents = await contentModel.find({ category: categoryId }).populate('category', 'injuryType');

    if (!contents.length) {
      return res.status(404).send({
        success: false,
        message: 'No content found for the specified category',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Contents retrieved successfully',
      contents,
    });
  } catch (error) {
    console.error('Error retrieving contents by category:', error);
    res.status(500).send({
      success: false,
      message: 'Error retrieving contents by category',
      error: error.message,
    });
  }
};

const deleteContentController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the content by ID
    const content = await contentModel.findByIdAndDelete(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error while deleting content',
      error,
    });
  }
};

const getFileController = async (req, res) => {
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

    // Check if the content has a PDF file
    if (!content.pdf || !content.pdf.data) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found.',
      });
    }

    // Send the PDF file
    res.contentType(content.pdf.contentType);
    res.send(content.pdf.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error while retrieving PDF file',
      error,
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
    getContentsByCategoryController,
    makeContentController,
    getFileController
 };
