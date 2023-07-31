const Task=require('../model/taskModel')
const express=require('express')
const router=new express.Router()
const auth=require('../middleware/auth')

router.post('/addtask',auth,async (req,res)=>{
  // const taskData=new Task(req.body)
  //taskData.save().then((taskData)=>res.status(200).send(taskData)).catch(err=>reset.status(400).send(err))
  const taskData=new Task({
      ...req.body,
      owner:req.user._id
  })
  
  try{
      await taskData.save()
      res.status(201).send(taskData)
  }catch(e){
      res.status(400).send(e)
  }
});


router.get('/task',auth,async (req,res)=>{
  // Model.methodname
  // Task.find({}).then(task=>res.status(200).send(task)).catch(err=>res.status(400).send(err))
  try{
   //   const getAllTask=await Task.find({})
     // res.send(getAllTask)
     await req.user.populate('taskRel')
     res.send(req.user.taskRel)
  }catch(e){
      res.status(400).send(e)
  }
  
})



router.delete('/task/:id',auth,async(req,res)=>{
  try{
      const deleteTask=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
  if(!deleteTask){
      res.status(404).send({message:"Task Deleted and not Found"})
  }
  res.status(200).send(deleteTask)
  }catch(e){
      res.status(500).send(e)
  }
})


router.get('/task/:id',auth,async (req,res)=>{
  //Model.Metodname
  // Task.findById(req.params.id).then((task)=>{
  //     if(!task){
  //         res.status(400).send({message:"Not Found Task"})
  //     }
  //     res.status(200).send(task)}).catch((err)=>res.status(400).send(err))

  try{
      // const getTaskByID=await Task.findById(req.params.id)
      const getTaskByID=await Task.findOne({_id:req.params.id,owner:req.user._id})
      if(!getTaskByID){
          res.status(404).send({message:"Not Found Task"})
      }
      res.status(200).send(getTaskByID)
  }catch(e){
      res.status(500).send(e)
  }
})


// update route
  router.put('/task/:id',auth,async (req,res)=>{
    // if any key value passed which doesnt exit, mongoose ignore so we have to fix it
    const updates=Object.keys(req.body)
    // const allowedUpdates=['taskName','status','description']
    // const isValidOperations=updates.every((element)=>allowedUpdates.includes(element))
    // console.log(isValidOperations)
    // if(isValidOperations){
    //     return res.status(400).send({message:"Invalid Updates!"})
    // }
    try{
        const updateTask=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!updateTask){
            res.status(400).send("Cant Update the Task as it couldnt find")
        }
        updates.forEach((element)=>updateTask[element]=req.body[element])
        await updateTask.save()
        //const updateTask=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).send(updateTask)
    }catch(e){
        res.status(500).send(e)
    }
    })



  module.exports = router;