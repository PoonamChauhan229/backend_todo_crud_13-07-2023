//we're going to set up and define the authentication middleware.
//Then we'll actually load it into our routers to put some of the roots behind authentication.


// const auth=async(req,res,next)=>{
//     console.log("auth middleware")
//     next();
// }
// module.exports=auth;
//Now, we need to setup the route for the individual route
// it's only ever going to run the route handler if the middleware calls that next function

const jwt=require('jsonwebtoken')
const User=require('../model/userModel')

const auth=async(req,res,next)=>{
    console.log("auth middleware")

try{
    //access the incoming header
    const token=req.header('Authorization').replace("Bearer ","")
    console.log(token)
    
    //verify the token that the token is valid or not
    const decoded=jwt.verify(token,'thisismynewcourse')
    console.log(decoded)
    //find the user with respect to the id and token in the database
    const user=await User.findOne({_id:decoded._id, 'tokens.token':token})
    console.log(user)
    if(!user){
        throw new Error()
    }
    //store the user data
    req.token=token;
    req.user=user;
    
}catch(e){
    res.status(401).send("error.Please Authenticate !" )

}
    next();
}
module.exports=auth;