import Post from '../models/Post.model.js'
import {Admin} from '../models/Admin.model.js'

export const updateStatus=async(req,res)=>{
    try{
        const {updatedStatus,remarks}=req.body
        const postId = req.params.id;
        const adminId=req.user._id
        const post=await Post.findById(postId);
        const admin=await Admin.findById(adminId)
        if(!post){
            res.status(404).json({message:"Post not found"})
        }
        if(!admin){
            res.status(401).json({message:"Not Authorized"})
        }
        post.status.remarks=remarks
        post.status.state=updatedStatus //['Pending', 'In Progress', 'Resolved', 'Rejected']
        await post.save()
        if(updateStatus==='Resolved'){
            admin.resolveCount++
            admin.pendingCount--
        await admin.save()
        }
        return res.status(200).json({ message: "Status updated successfully", post });
    }catch(error){
        res.status(500).json({ message: error.message, success: false });
    }
}

export const getAllForwardedPosts=async(req,res)=>{
    try{
        const {adminId}=req.user._id
        const admin=await Admin.findById(adminId)
        if(!admin){
            res.status(401).json({message:"Unauthorized"})
        }
        const forwardedPosts=admin.forwardedPosts
        res.status(200).json({
            message:"Fetched all posts",
            forwardedPosts
        })
    }catch(error){
        res.status(500).json({ message: error.message, success: false });
    }
}

