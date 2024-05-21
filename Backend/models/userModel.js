const mongoose = require('mongoose')
const db = require('../config/db')

const userSchema =  new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    city: {
        type: {},
        required: true
    },
    sport: {
        type: String,
        require: true
    },
    role: {
        type: Number,
        default: 0
    }
},{timestamps: true})

module.exports = db.model('User',userSchema)