// this is a function that is created by modifying the auth middleware and it will do nothing but returns true if authorization is successful else it will return  false

//it will be helpful when we will send limited response fields to unauthorized users and complete response to authorized users


const jwt = require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

 function isLoggedIn(req){
    
    const token = req.headers.authorization
   
    if(!token){
        return false
        //no token so return false 
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
       return true
       //came here means token was valid so return true
    }
    catch(error){
      return false
    //   came here because token was invalid so return false
    }
}

module.exports=isLoggedIn