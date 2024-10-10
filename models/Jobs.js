const mongoose= require("mongoose")
const User= require("./User")
const jobSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true

    },
    logo:{
        type:String,
        required:true

    },
    position:{
        type:String,
        required:true

    },
    salary:{
        type:Number,
        required:true

    },
    jobType:{
        type:String,
        required:true,
        enum:["full-time","part-Time","internship","contract"]
        //it is of type string but the value of string must belong to one of the values of enum

    },
    Remote:{
        type:Boolean,
        required:true,
        default:false

    },
    location:{
        type:String,
        required:true
        

    },
    description:{
        type:String,
        required:true

    },
    about:{
        type:String,
        required:true

    },
    skills:{
        type:[Array],
        required:true

    },
    information:{
        type:String,
        required:true

    },
     
  creator:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
}
//so once user will come and create job his id will be automatically attached here.
//but to refer that this id belongs to User model use ref so that
    

})

const Job= mongoose.model("Job",jobSchema)

module.exports=Job