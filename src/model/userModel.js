const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const validator=require('validator')

const Task=require('./taskModel')
const bcrypt=require('bcryptjs')
const userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive number")
            }
        },
        default:0
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email Invalid")
            }
        }
    },
    password:{
        type:String,
        minLength:6,
        required:true,
        trim:true,
        validate(value){
            if(value.includes("password")){
                throw new Error("Password should not contain password")
            }
        }
    },
    // add token to each user
    // tokens: array of objects
    tokens:[{
        token:{
            type:String,
            required:true
        }       
    }]

})


//we're going to do is set up what's known as a virtual property a virtual property is notactual data stored in the database.
//It's a relationship between two entities.
//In this case between our user and our task to start off we'll be using something on user schema.
//It is called the virtual and it allows us to set up one of these virtual attributes
//Now it's virtual because we're not actually changing what we store for the user document
//it is just a way for a mongoose to figure out how these two things are related.
//2 parameters=>
    //1st is just an name (userdefined)
    //2nd => set up an object
userSchema.virtual('taskRel',{
        ref:'Task',// Task Model
        localField:'_id',//local data is stored// owner Object ID which is associted with task==> Object ID of user
        foreignField:'owner'//name of the feild on the other Model , ie in the task that is been used for creating an relationship => user id
    })  


// removing the password and tokens from the login and Signup
userSchema.methods.toJSON=function(){
    const user=this;
    //toObject() method is provided by Mongoose
    const userObject=user.toObject()//raw profile data
    delete userObject.password;
    delete userObject.tokens

    return userObject;
}

userSchema.methods.generateAuthToken=async function(req,res,next){
    //methods are accessible on instance
    const user=this
    //generate a jwt token
    const token=jwt.sign({_id:user._id.toString()},'thisismynewcourse')
    //token generated, add to the tokens array in usermodel
    user.tokens=user.tokens.concat({token:token})
    //save() method=>token should save to the DB
    await user.save()
    return token
}

//Login and attaching to userschema
userSchema.statics.findByCredentials=async(email,password)=>{
     //first finf by email
     const userSignin=await User.findOne({email:email})
     if(!userSignin){
        throw new Error("Email Address Not found")
     }  
    //  Match the password
     const isMatch=await bcrypt.compare(password,userSignin.password)
     if(!isMatch){
        throw new Error("Unable to Login")
     }
     console.log(userSignin)
     return userSignin

}

//hash the plaintext password before saving
// pre takes 2 args 
    // > name of the event
    // > function to run and it should be an standard function, this takes next as an parameter 
    //not an arrow function
    //Binding place an important role
    // arrow function here dont bind this
userSchema.pre('save',async function(next){
    //"this" refers and gives us access to the individual user that's about to be saved.
    const user=this
    // next
    //The whole point of this is to run some code before a user is saved
    //But how does it know when we're done running our code.
    //Now it could just say when the function is over.
   // But that wouldn't account for any asynchronous process which might be occurring.So that's why next is provided.We simply call next when we're done right here.we call next at the end of the function.
   //Now if we never call next.It's just going to hang forever.Thinking that we're still running some code before we save the user and it will never actually save the user.

    //In between the this and next , we are going to hash the password
    //fire off from postman and check the below message 
    console.log('just before saving',user)
    //create user, its working but in update user not working
    //so we will have to restructure the update user route.
    //Restructing done for update user route so now we will start hashing of the password.
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
   next();
})

//Create an Middleware
//Delete user tasks when the user is removed.
// userSchema.pre('findOneAndDelete',async function (next) {
//     console.log("deleted user");
//     const user = this;
//     console.log(user._id);
//     await Task.deleteMany({ owner: user._id });
//     next();
//   });
//Define the model
const User=mongoose.model('User',userSchema)
module.exports=User;