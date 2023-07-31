const express=require('express')
const cors = require('cors');
const cookieParser=require('cookie-parser')

const dotenv=require('dotenv')
dotenv.config()
const app=express()
const PORT=process.env.PORT;
const connection=require('./db/connection')
connection()

app.use(cors({
    // origin: 'http://localhost:5000',
    // methods: ["POST", "GET"],
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())
const taskRouter=require('./routes/taskRoutes')
const userRouter=require('./routes/userRoutes');
app.use(taskRouter)
app.use(userRouter)
app.listen(PORT,()=>{
    console.log('server started at',PORT)
})