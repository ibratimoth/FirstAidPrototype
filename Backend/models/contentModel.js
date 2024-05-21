const mongoose = require("mongoose");
const db = require("../config/db");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends of a string
      maxlength: 50, // Maximum length for the title
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    video: {
        type: String, // Store the video filename or path
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
