
const auth=require('../middleware/auth')
const Task=require('../model/taskModel')
const express=require('express')
const User=require('../model/userModel')
const router=new express.Router()
router.get('/test',(req,res)=>{
    res.send("New Route")
})

//login
router.post('/users/login',async (req,res)=>{
   try{
    const userLogin=await User.findByCredentials(req.body.email,req.body.password)
    const token=await userLogin.generateAuthToken()
    res.status(200).send({userLogin,token})
    // res.cookie('token',token)
   }catch(e){
    res.status(400).send(e)
   }
})

//signup route
// Creating an User Route
router.post('/users/signup',async (req,res)=>{
    console.log(req.body)
    // creating an user
    const userData=new User(req.body)
    try{
        await userData.save()
        const token=await userData.generateAuthToken()
        res.status(201).send({userData,token})
    }catch(e){
        res.status(400).send({message:e})
    }
})

//logout route
router.post('/users/logout',auth,async(req,res)=>{
    try{
        // console.log("logout route")
        // console.log(req.user.tokens.filter((token)=>{
        //     console.log( token.token!==req.token)}))
        // The below filter method returns false and hence it has an empty array
        // tokens are empty
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        
        })

        await req.user.save()
        res.send({message:"User Logged Out Successfully"})
    }catch(e){
        res.status(500).send()
    }
})

//logout all from all the sessions
// Mutilple systems logout
router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send({message:"User Logged Out From all the sessions Successfully"})
    }catch(e){
        res.status(500).send()
    }
})

// Get all the Users
//And the problem is that it exposes the data for other users.
//So this route, doesnt any purpose anymore but we are going to repurpose it for something
//change the route '/users/me'
// get the profile of the user
router.get('/users/me',auth,async (req,res)=>{
       
    try{
        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send({message:e})       
    }
})
// Updating the all the Users
// which shouldnt be case 
// patch
router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperations=updates.every((element)=>allowedUpdates.includes(element))
    if(!isValidOperations){
        return res.status(400).send({message:"Invalid Updates!"})
    }
    try{       
        
        // const updateUser=await User.findById(req.params.id)
        updates.forEach((element)=>req.user[element]=req.body[element])
        // [] because the keys are in string format so to access the string key we need to use objname['key']

        // Step3: add the save() over here
        await req.user.save()
        //let go to hash the password in userModel

        res.status(200).send(req.user)
    
    }catch(e){
        res.status(500).send(e)
    }
})

// Delete By ID
router.delete('/users/me',auth,async(req,res)=>{
    try{
         // route chnaged so we cant get req.params.id

         // 1st way:
     const deleteUser=await User.findOneAndDelete({_id:req.user._id})

         // const deleteUser=await User.findByIdAndDelete(req.params.id)
        if(!deleteUser){
            res.status(404).send({message:"User Deleted and Not Found"})
        }
         // Delete associated tasks
        await Task.deleteMany({ owner:deleteUser._id });
        res.status(200).send(deleteUser)
    }catch(e){
        res.status(500).send({message:"Error"})
    }

});

 


module.exports=router