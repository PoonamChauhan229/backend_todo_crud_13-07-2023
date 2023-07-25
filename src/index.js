const express=require('express')
const cors = require('cors');


const dotenv=require('dotenv')
dotenv.config()
const app=express()
const PORT=process.env.PORT;
const connection=require('./db/connection')
connection()
app.use(cors())
app.use(express.json())
const taskRouter=require('./routes/taskRoutes')
app.use(taskRouter)
app.listen(PORT,()=>{
    console.log('server started at',PORT)
})