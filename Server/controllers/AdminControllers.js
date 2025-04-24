import Post from '../models/Post.model.js'
import {Admin} from '../models/Admin.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import validator from 'validator'

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

export const AdminLogin = async (req, res) => {
    try {
      console.log("inside")
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the required fields." })
        }
  
        const user = await Admin.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid user!!",
                success: false
            })
        }
  
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(400).json({
                message: "Incorrect Password!!",
                success: false
            })
        }
  
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        const createdUser=user.toObject()
          delete user.password
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure:true,
        })
            .json({
              message:"Logged in successfully",
              createdUser
            })
  
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server Error',
            success: false
        })
    }
  }
  export const adminRegister = async (req, res) => {
    try {
      const { departmentType, email, password, confirmPassword } = req.body;
  
      if (!departmentType || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required!" });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email" });
      }
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists! Try a different one." });
      }
  
      const hashedPass = await bcrypt.hash(password, 10);
  
      const admin = await Admin.create({
        departmentType,
        email,
        password: hashedPass
      });
  
      const createdAdmin = await Admin.findById(admin._id).select("-password");
  
      return res.status(201).json({
        message: "Admin account created successfully.",
        success: true,
        admin: createdAdmin
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Server Error', success: false });
    }
  };