import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './Utils/Database.js'
import AuthRoutes from "./routes/AuthRoutes.js"
import PostRoutes from './routes/PostRoutes.js';
import CommentRoutes from './routes/CommentRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js'
import UserRoutes from './routes/UserRoutes.js'

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

app.use('/api/auth',AuthRoutes)
app.use('/api/posts', PostRoutes)
app.use('/api/comments', CommentRoutes)
app.use('/api/admin',AdminRoutes)
app.use('/api/users',UserRoutes)


app.listen(PORT,async()=>{
    connectDB();
    console.log(`Server is running on the port ${PORT}`); 
})

