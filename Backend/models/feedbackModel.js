const mongoose = require("mongoose");
const db = require("../config/db");

// Define the enum values for feedback type
const feedbackType = ["Technical", "Content"];

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      default: "Technical", // Default value for title field
      enum: feedbackType, // Ensure only specified values are allowed
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
