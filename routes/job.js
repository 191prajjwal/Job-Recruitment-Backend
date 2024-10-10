const express = require("express")
const router= express.Router()
const Job= require("../models/Jobs")
const isLoggedIn= require("../utils/isLoggedin")

const authMiddleware= require("../middlewares/auth")
const { findById } = require("../models/User")

//we want only authorized (logged in) users to create job
router.post("/",authMiddleware,async(req,res)=>{
    
    
    try {
        
        const {name,logo,position,salary,jobType,remote,location,description,about,skills,information}=req.body

       

    //since skill was array and when we send it we have  to stringify everything so everything present in req.body will be a string so if we want it as it was initially means it was array so do parse it into array but if we parse it using JSON.parse() it will not be parsed since we will give input something like html,css but not in the form of json for array like '["html","css"]' hence we cant parse it in json so use split method


   


    const parsedSkills= skills.split(",").map((skill)=>skill.trim())

    //while authorization via auth middleware we added user property in req and we stored id in it so if authorization is successfull this id will be present in user property of the req object so destructure it from there.

    const {user}=req
    console.log(user)


    const job = new Job({
        name,logo,position,salary,jobType,remote,location,description,about,skills:parsedSkills,information,creator:user

    });

    await job.save()

res.status(200).json({"messsage":"job created successfully"})


    } catch (error) {
        console.log(error)
        res.status(400).json({'message':"job not created"})
    }

})

//we do not need authorization too see jobs so any one can see job however unauthorized user can only see jobs but can't know about the creator hence we not showing id to him of creator
router.get("/",async(req,res)=>{


    const jobsForLoggedIn= await Job.find()
    const jobsForNotLoggedIn=await Job.find().select("-_id -__v -creator -description -about -information")

    isLoggedIn(req)? res.status(200).json(jobsForLoggedIn): res.status(200).json(jobsForNotLoggedIn)

    //so if logged in user will try to get job he will see complete job info and creator info

    //if non logged in user will try to get job he will see only job info and not the creator info

   
 
})

//getting all details for authorized users for a job with a given id
router.get("/:id",authMiddleware,async(req,res)=>{
    const{id}=req.params

    const job = await Job.findById(id)

    if(!job){
        return res.status(404).json({"message":"Job not found"})
    }

    res.status(200).json(job)

})

// to delete a job with a given id
router.delete("/:id",authMiddleware,async(req,res)=>{

    console.log("came to delete")
   
    const {id}=req.params
    const targetJob= await Job.findById(id)

    console.log(targetJob)

    if(!targetJob){
       return res.status(404).json({"message":"Job not found"})
    }

    if(targetJob.creator.toString()!==req.user.toString())
    {
       return res.status(400).json({"message":"you are not authorized to delete this job"})
    }

    await Job.findByIdAndDelete(id)
    res.status(200).json({"message":"Job deleted successfully"})
})

//to update a job with a given id (if will only update the fields we give else it will use previous value only)
router.put("/:id",authMiddleware,async(req,res)=>{
    try {
        const {id}=req.params

    const job= await Job.findById(id)
    console.log(job)

    if(!job){
        return res.status(400).json({"message":"Job not found"})
    }

    if(job.creator.toString()!==req.user.toString())
    {
        return res.status(401).json({"message":"you are not authorized to edit the job"})
    }

    const {name,logo,position,salary,jobType,remote,location,description,about,skills,information}=req.body
    const parsedSkills= skills?.split(",").map((skill)=>skill.trim())

    const updatedJob=await Job.findByIdAndUpdate(id,{name,logo,position,salary,jobType,remote,location,description,about,skills:parsedSkills,information},{new:true})
    //new:true says return the updated job

    res.status(200).json(updatedJob)
    } catch (error) {
            console.log(error)
        res.status(400).json({"message":"job not updated"})
        
    }



})

//to search based on something for ex name by giving any value in param and we will use regex
//TODO:will update if for searching skills once front end will be done

router.get("/search/:title",async(req,res)=>{
    const{title}=req.params
    const jobs= await Job.find({name:new RegExp(title,"i")}).select("-_id -creator -information -about -__v")
    //it will take title from params and based on it see any name matching with the pattern of title and return all those names// like if you search for net it will see that any name field has net in name and it will return that so netflix vala job will come 
    res.status(200).json(jobs)
})


module.exports = router

