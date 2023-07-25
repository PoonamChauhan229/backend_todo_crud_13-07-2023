const Task=require('../model/taskModel')
const express=require('express')
const router=new express.Router()

router.post('/addtask', async(req, res) => {
    const taskData = new Task(req.body);
    // console.log(taskData)
    try {
      await taskData.save();
      res.status(200).send(taskData);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.get('/task',async(req,res)=>{
    try{
        const getAllTask=await Task.find({})
        res.status(200).send(getAllTask)
    }catch(e){
        res.status(400).send(e)
    }
  })
  router.delete('/task/:id',async(req,res)=>{
    try{
        console.log(req.params.id)
        const delTask=await Task.findByIdAndDelete({_id:req.params.id})
        res.status(200).send(delTask)
    }catch(e){
        res.status(400).send(e)
    }
  })

  router.get('/task/:id',async(req,res)=>{
    try{
        const getTaskById=await Task.findById({_id:req.params.id})
        res.status(200).send(getTaskById)
}catch(e){
    res.status(400).send(e)
} 
})

// update route
  router.put('/task/:id',async(req,res)=>{
    try{
        const updateTask=await Task.findByIdAndUpdate({_id:req.params.id},req.body,{new:true,runValidators:true})
        res.status(200).send(updateTask)
    }catch(e){
        res.status(400).send(e)
    }
  })
  module.exports = router;