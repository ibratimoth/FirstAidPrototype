const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require("./routes/categoryRoutes")
const contentRoutes = require('./routes/contentRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const hospitalRoutes = require('./routes/hospitalRoutes')
const cloudinary = require('cloudinary')
const connectDB  = require('./config/db')
const cors = require('cors')


//configure env
dotenv.config()

//database config
connectDB();

//cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

//rest object
const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false}));

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/content', contentRoutes)
app.use('/api/v1/feedback', feedbackRoutes)
app.use('/api', hospitalRoutes)
//rest api
app.get('/',(req,res) => {
    res.send("<h1>Welcome to ecommerce app</h1>")
})
const PORT = process.env.PORT || 8082;
app.listen(PORT, function(){
    console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})