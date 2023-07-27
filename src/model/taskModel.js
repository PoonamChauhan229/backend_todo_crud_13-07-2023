const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
    taskName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'//MOdel Name
    }
})
const Task=mongoose.model("Task",taskSchema)
module.exports=Task