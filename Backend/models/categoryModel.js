const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    injuryType: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Category', categorySchema);
