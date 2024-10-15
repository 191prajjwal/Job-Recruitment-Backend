const express= require("express")
const router = express.Router()
const User= require("../models/User")
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")


dotenv.config()

router.post("/signup",async(req,res)=>{
    const {name,email,password,mobile}= req.body
    const userAlreadyExist= await User.findOne({email})
    if(userAlreadyExist)
    {
       return res.status(400).json({"message":"User already exists"})
    }
const hashedPassword= await  bcrypt.hash(password,10)

    const user= new User({
        name:name,
        email:email,
        password:hashedPassword,
        mobile:mobile
        
    })
    await user.save()

    res.status(201).json({"message":"user created successfully"})

})

router.get("/",async(req,res)=>{
    const user = await User.find().select("-password -__v -creationDate")
    res.status(200).json(user)
})

router.get("/:email",async(req,res)=>{
    console.log(req.params)
    const {email}= req.params
    const user= await User.findOne({email}).select("-password -__v -creationDate")

    if(!user){
       return res.status(404).json({"message":"user not found"})
    }

    res.status(200).json(user)

})


router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user= await User.findOne({email})
    if(!user)
    {
        return res.status(400).json({"Message":"Wrong Email or Password"})
    }

    const isPasswordValid= await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({"message":"Wrong Email or Password"})
    }

    const payload= {id:user._id}
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY)
    res.status(200).json(token)

})

module.exports= router