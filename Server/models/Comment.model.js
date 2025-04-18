import mongoose from "mongoose"; 

const commentSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required : true
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment',
        default : null
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    text : {
        type : String,
        required : true,
        maxLength : 300
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;