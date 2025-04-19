import mongoose from "mongoose";

const voluteeredSchema=new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    volunteeredBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Volunteered=mongoose.model('Voluteered',voluteeredSchema)
export default Volunteered