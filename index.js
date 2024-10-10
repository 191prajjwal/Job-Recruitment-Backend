const express = require("express")
const dotenv= require("dotenv")
const mongoose= require("mongoose")
const cors= require("cors")
// const multer = require("multer")
// //used to send form-data that is basically multipart  that means it has various parts of data like text , media like  audio,image and all 
// //so if from postman we send form data we have to use multer to parse it
// const upload= multer()

// //we do not need multer here but i used it to know about it

//importing custom middlewares
const incommingReqLogger= require("./middlewares/logger")


//importing Routes
const indexRouter= require("./routes/index")
const userRouter= require("./routes/user")
const jobRouter= require("./routes/job")


//config
const app = express()
dotenv.config()

//middlewares
app.use(incommingReqLogger)
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
// app.use(upload.none())//it was with multer

//custom middlewares

//order important so use this logger before having any req and all otherwise it will run after req and then it will give error

//using Routes
app.use("/",indexRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/job",jobRouter)


//server listner
app.listen(process.env.PORT,()=>{
    console.log(`Server is live at Port ${process.env.PORT}`)
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database connected")
    })
})