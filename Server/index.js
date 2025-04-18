import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './Utils/Database.js'

const app = express()

dotenv.config({});
const PORT=process.env.PORT || 9000

const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));
app.use(express.urlencoded({limit:'100kb',extended:true}))
app.use(express.json({limit:'1mb'}))
app.use(cookieParser())

app.listen(PORT,async()=>{
    connectDB();
    console.log(`Server is running on the port ${PORT}`); 
})

