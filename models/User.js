const mongoose = require("mongoose")

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        
    },
    creationDate:{
        type:Date,
        default: Date.now
    }

})

const UserModel= mongoose.model("User",userSchema)

module.exports= UserModel