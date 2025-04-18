import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('Database Connected Successfully.')
    }).catch((error)=>{
        console.log(error)
        process.exit(1)
    })
}
export default connectDB