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
    category: {
      type: mongoose.ObjectId,
      ref: 'Category',
      required: true,
    },
    injuryType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Content", contentSchema);
