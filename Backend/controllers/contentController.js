const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
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

// Controller to handle video retrieval
const getVideoById = (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: 'Invalid video ID' });
    }

    const videoId = new mongoose.Types.ObjectId(req.params.id);

    if (!gfs) {
      return res.status(500).json({ err: 'GridFS not initialized' });
    }

    gfs.files.findOne({ _id: videoId }, (err, file) => {
      if (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ err: 'Error finding file' });
      }

      if (!file || file.length === 0) {
        return res.status(404).json({ err: 'No file exists' });
      }

      if (file.contentType === 'video/mp4' || file.contentType === 'video/webm') {
        const readstream = gridfsBucket.openDownloadStream(file._id);
        res.set('Content-Type', file.contentType);
        readstream.pipe(res);
      } else {
        res.status(404).json({ err: 'Not a video' });
      }
    });
  } catch (error) {
    console.error('Error retrieving video:', error);
    return res.status(500).json({ err: 'Error retrieving video' });
  }
};
// // Controller to handle fetching video by ID
// const getVideoById = async (req, res) => {
//   try {
//     const videoId = new ObjectId(req.params.id);

//     gfs.files.findOne({ _id: videoId }, (err, file) => {
//       if (!file || file.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'No file exists',
//         });
//       }

//       // Check if the file is a video
//       if (file.contentType === 'video/mp4' || file.contentType === 'video/webm') {
//         // Read output to browser
//         const readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else {
//         res.status(404).json({
//           success: false,
//           message: 'Not a video file',
//         });
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching video:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error fetching video.',
//       error: error.message,
//     });
//   }
// };

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

    // If there is a video file, delete it from GridFS
    if (content.video) {
      await gridfsBucket.delete(new mongoose.Types.ObjectId(content.video), (err) => {
        if (err) {
          console.error('Error deleting video file from GridFS:', err);
          return res.status(500).json({
            success: false,
            message: 'Error deleting video file.',
            error: err.message,
          });
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
    getVideoById,
    getContentsByCategoryController
 };
