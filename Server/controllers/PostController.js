import Post from '../models/Post.model.js';
import Comment from '../models/Comment.model.js';
import {User} from '../models/User.model.js';
import mongoose from 'mongoose'; 
import { uploadOnCloudinary } from '../Utils/Cloudinary.js'; 
import axios from "axios";

export const createPost = async (req, res) => {
    try {
        const { caption, categories, longitude, latitude } = req.body;
        const userId = req.user._id;

        if (!caption || !categories || !longitude || !latitude || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: "All fields are required including images" });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        let area = "Unknown area";
        let city = "Unknown city";
        let country = "Unknown country";

        try {
            const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: lat,
                    lon: lon,
                    format: 'json'
                },
                headers: {
                    'User-Agent': 'BeTheFix/1.0 (contact@bethefix.com)'
                }
            });

            if (geoRes.data?.address) {
                const address = geoRes.data.address;
                area = address.suburb || address.neighbourhood || address.village || address.hamlet || "Unknown area";
                city = address.city || address.town || address.village || "Unknown city";
                country = address.country || "Unknown country";
            }
        } catch (geoError) {
            console.warn("Reverse geocoding failed:", geoError.message);
        }

        const uploadedImageUrls = [];

        for (let file of req.files) {
            const cloudinaryResult = await uploadOnCloudinary(file.path);
            if (cloudinaryResult) {
                uploadedImageUrls.push(cloudinaryResult.secure_url);
            }
        }

        const location = {
            area,
            city,
            country,
            longitude: lon,
            latitude: lat
        };

        const newPost = new Post({
            caption,
            images: uploadedImageUrls,
            categories: categories.split(","),
            createdBy: userId,
            location
        });

        await newPost.save();
        return res.status(200).json({ message: "Post created", newPost });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};


export const deletePost = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findById(postId);
        if(!post)
            return res.status(404).json({message : "no post found"});
        
        const session = await mongoose.startSession();
        session.startTransaction();
        await Comment.deleteMany({
            post : postId
        }).session(session);

        await Post.findByIdAndDelete(postId).session(session);

        session.commitTransaction();
        res.status(200).json({message : "Post deleted successfully"});

    } catch (error) {
        res.status(500).json({message : error.message, success : false});
    }
}

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Internal server error");
    }

    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    const postsWithUpvotesAndDownvotes = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.createdBy);
        return {
          ...post,
          upvoted: post.upvotes?.some((id) => id.toString() === userId.toString()) || false,
          downvoted: post.downvotes?.some((id) => id.toString() === userId.toString()) || false,
          author: {
            avatar: author.avatar,
            name: author.fullName,
          },
        };
      })
    );

    res.status(200).json(postsWithUpvotesAndDownvotes);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

  
export const updateByUser = async (req, res) => {
    try {
      const { postId, caption, categories, images } = req.body;
      const userId = req.user._id;
  
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this post" });
      }
  
      if (caption) 
        post.caption = caption;
      if (categories) {
        post.categories.push(...categories.split(",").map(c => c.trim()));
      }
      if (images) {
        post.images.push(...images.split(",").map(img => img.trim()));
      }

      await post.save();
  
      res.status(200).json({ message: "Post updated successfully" });
  
    } catch (error) {
      res.status(500).json({ message: error.message + " -> Internal server error" });
    }
}

// export const updateByAdmin = async (req, res) => {
//     try {
        
//     } catch (error) {
//         res.status(500).json({message : error.message + " -> Internal server error"});
//     }
// }

export const toggleUpvote = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { latitude, longitude } = req.body; // User's current location

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const postLat = post.location.latitude;
    const postLng = post.location.longitude;

    // Haversine distance calculation
    const earthRadiusKm = 6371;
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(latitude - postLat);
    const dLng = toRad(longitude - postLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(postLat)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    if (distance > 10) {
      return res
        .status(403)
        .json({ message: "You must be within 10 km to upvote this post." });
    }

    // Remove downvote if it exists
    post.downvotes = post.downvotes.filter(
      (id) => id.toString() !== userId.toString()
    );

    const hasUpvoted = post.upvotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({ message: "Upvote removed (toggled)" });
    } else {
      post.upvotes.push(userId);
      await post.save();
      return res.status(200).json({ message: "Upvoted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const toggleDownvote = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { latitude, longitude } = req.body; // User's current location

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const postLat = post.location.latitude;
    const postLng = post.location.longitude;

    // Haversine distance calculation
    const earthRadiusKm = 6371;
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(latitude - postLat);
    const dLng = toRad(longitude - postLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(postLat)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    if (distance > 10) {
      return res
        .status(403)
        .json({ message: "You must be within 10 km to downvote this post." });
    }

    // Remove upvote if it exists
    post.upvotes = post.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );

    const hasDownvoted = post.downvotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasDownvoted) {
      post.downvotes = post.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({ message: "Downvote removed (toggled)" });
    } else {
      post.downvotes.push(userId);
      await post.save();
      return res.status(200).json({ message: "Downvoted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user)
          throw new Error("Internal server error");

        const posts = await Post.find({createdBy : user}).sort({ createdAt: -1 }).lean();

        if(!posts)
            throw new Error("Internal server error");
  
        const postsWithUpvotesAndDownvotes = posts.map((post) => ({
          ...post,
          upvoted: post.upvotes?.some((id) => id.toString() === userId.toString()) || false,
          downvoted: post.downvotes?.some((id) => id.toString() === userId.toString()) || false,
          author : {
            avatar : user.avatar,
            name : user.fullName
          }
        }));

        res.status(200).json({message : "Posts fetched", posts : postsWithUpvotesAndDownvotes, success : true});

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}