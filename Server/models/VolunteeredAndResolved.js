import mongoose, { Schema } from "mongoose";
 
const volunteeredAndResolvedSchema=new Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    resolvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    remarks:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const VolunteeredAndResolved=mongoose.model('VolunteeredAndResolved',volunteeredAndResolvedSchema)
export default VolunteeredAndResolved