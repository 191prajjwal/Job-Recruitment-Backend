const jwt = require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

 function authMiddleware(req,res,next){
        //suppose we have do something from frontend that our token is at req header in authorization property
    console.log(req.headers)
    const token = req.headers.authorization
    console.log(req.headers.authorization)

    if(!token){
        return res.status(401).json({"message":"User not logged in"
        })
        //user dont have token means he haven't logged in otherwise he had a token
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        //if token is verified the payload and all will be stored in decoded
        req.user=decoded.id;
        //so id is stored in req.user
    
        next()
    }
    catch(error){
        res.status(401).json({"message":"Invalid token"})
    }
}

module.exports=authMiddleware