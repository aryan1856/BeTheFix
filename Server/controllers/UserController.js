import { GoogleGenerativeAI } from "@google/generative-ai";
import {User} from '../models/User.model.js'
import fetchLocation from '../utils/fetchLocation.js';
import Volunteered from "../models/Volunteered.model.js";

export const update = async (req, res) => {
    try {
        const { fullName, address, age } = req.body;
  
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { fullName, address, age },
            { new: true }
        );
  
        if(!updatedUser)
            throw new Error("Internal server error");
  
        res.status(200).json({ message: "User updated", success: true, user: updatedUser });
  
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
  };

  export const getUsersRankWise= async (req, res) => {
    try {
      const { longitude, latitude } = req.body;
  
      console.log(longitude, latitude)
  
      if (!longitude || !latitude) {
        return res.status(400).json({ message: "Longitude and latitude are required", success: false });
      }
  
      const currLocation = await fetchLocation(longitude, latitude);
      if (!currLocation || !currLocation.area) {
        throw new Error("Could not determine your location");
      }
  
      const users = await User.find({ 'location.area': currLocation.area })
                              .sort({ resolvedCount: -1 })
                              .lean();
  
      res.status(200).json({
        message: `Users in ${currLocation.area} fetched successfully`,
        users,
        success: true
      });
  
    } catch (error) {
      console.error("Error fetching rank-wise users:", error.message);
      res.status(500).json({ message: error.message, success: false });
    }
  };

  export const generateComplaint = async (req, res) => {
    const { categories, userDescription } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
      // Just clean and format categories
      const cleanedCategories = categories
        .split(",")
        .map((cat) => cat.trim())
        .join(", ");
  
      const prompt = `Write a complaint in English to the city authorities regarding the following issues: ${cleanedCategories}. 
  User described the situation as: "${userDescription}". 
  Please make the complaint polite, concise, and specific, covering all the mentioned issues clearly.Don't write location and personal info less than 400 characters`;
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const complaint = response.text();
  
      res.status(200).json({ complaint });
  
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate complaint" });
    }
  };

  export const volunteerForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
  
      const alreadyVolunteered = await Volunteered.findOne({ volunteeredBy: userId, postId: postId });
      if (alreadyVolunteered) {
        return res.status(400).json({ message: 'Already volunteered for this post.' });
      }
  
      const newEntry = new Volunteered({ volunteeredBy: userId, postId: postId });
      await newEntry.save();
  
      res.status(200).json({ message: 'Successfully volunteered for the post.' });
    } catch (error) {
      console.error('Volunteer error:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };
  export const getUserVolunteeredPosts = async (req, res) => {
    try {
        const userId = req.user._id;
  
        const user = await User.findById(userId);
        if(!user)
          throw new Error("Internal server error");
        const records = await Volunteered.find({ volunteeredBy:userId }).select('postId').lean();
        if(!records){
          res.status(500).json({
            message:"No post voluteered"
          })
        }
        const postIds = records.map(r => r.postId);
  
        const posts = await Post.find({ _id: { $in: postIds } }).sort({ createdAt: -1 }).lean();
  
  
  
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await User.findById(post.createdBy);
    
            const isVolunteered = await Volunteered.findOne({
              postId: post._id,
              volunteeredBy: userId,
            });
    
            return {
              ...post,
              upvoted: post.upvotes?.some((id) => id.toString() === userId.toString()) || false,
              downvoted: post.downvotes?.some((id) => id.toString() === userId.toString()) || false,
              alreadyVolunteered: !!isVolunteered,
              author: {
                avatar: author.avatar,
                name: author.fullName,
              },
              upvoteCount: post.upvotes?.length || 0,
            };
          })
        );
    
        postsWithDetails.sort((a, b) => b.upvoteCount - a.upvoteCount);
    
        res.status(200).json({postsWithDetails,success:true});
    
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
  }

  export const resolvePost = async (req, res) => {
    try {
      const { postId, remarks } = req.body;
      const userId = req.user._id;
  
      if (!postId || !remarks || !req.file) {
        return res.status(400).json({
          success: false,
          message: "Post ID, remarks, and an image are required",
        });
      }
  
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
  
      if (!cloudinaryResult) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
  
      // Save to VolunteeredAndResolved collection
      const resolvedPost = new VolunteeredAndResolved({
        post: postId,
        resolvedBy: userId,
        remarks,
        image: cloudinaryResult.secure_url,
      });
  
      await resolvedPost.save();
  
      // Update status in the Post schema
      await Post.findByIdAndUpdate(postId, {
        $set: {
          'status.state': 'Resolved',
          'status.remarks': remarks,
        },
      });
  
      return res.status(201).json({
        success: true,
        message: "Post resolved successfully",
        resolvedPost,
      });
    } catch (error) {
      console.error("Resolve Post Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  