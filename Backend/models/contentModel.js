const mongoose = require("mongoose");
const db = require("../config/db");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: 'Category',
      required: true,
    },
    injuryType: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.ObjectId, // Store the GridFS file ID
      ref: 'videos.files', // Reference the files collection in GridFS
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Content", contentSchema);
