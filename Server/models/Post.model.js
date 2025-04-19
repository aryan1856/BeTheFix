import mongoose from 'mongoose'; 

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        required : true,
        maxLength : 3000
    },
    images : [{
        type : String,
        required : true
    }],
    upvotes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    downvotes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    categories : [{
        type : String
    }],
    status : {
        remarks : {
            type : String,
            default : ''
        },
        state : {
            type : String,
            enum : ['Pending', 'In Progress', 'Resolved', 'Rejected'],
            default : 'Pending'
        }
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    location : {
        area : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        country : {
            type : String,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        },
        latitude : {
            type : Number,
            required : true
        }
    }
});

const Post = mongoose.model("Post", postSchema);

export default Post;