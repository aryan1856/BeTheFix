import Post from '../models/Post.model.js';
import Comment from '../models/Comment.model.js';
import {User} from '../models/user.model.js';
import mongoose from 'mongoose'; 
import { uploadOnCloudinary} from '../utils/Cloudinary.js'
import axios from "axios";
import fetchLocation from '../utils/fetchLocation.js';
import Volunteered from '../models/Volunteered.model.js'

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
    const { longitude, latitude } = req.body;

    const currLocation = await fetchLocation(longitude, latitude);
    if (!currLocation) throw new Error("Location: Internal server error");

    const user = await User.findById(userId);
    if (!user) throw new Error("User: Internal server error");

    const { area, city } = currLocation;

    // Get posts matching area or city
    const posts = await Post.find({
      $or: [
        { "location.area": area },
        { "location.city": city }
      ]
    }).sort({ createdAt: -1 }).lean();

    // Custom sort: prioritize area matches
    const sortedPosts = posts.sort((a, b) => {
      const aAreaMatch = a.location?.area === area;
      const bAreaMatch = b.location?.area === area;

      if (aAreaMatch && !bAreaMatch) return -1;
      if (!aAreaMatch && bAreaMatch) return 1;
      return 0;
    });

    // Add upvote/downvote, author info, volunteer info, and upvote count
    const postsWithExtras = await Promise.all(
      sortedPosts.map(async (post) => {
        const author = await User.findById(post.createdBy);

        const isVolunteered = await Volunteered.findOne({
          postId: post._id,
          volunteeredBy: userId,
        });

        return {
          ...post,
          upvoted: post.upvotes?.some(id => id.toString() === userId.toString()) || false,
          downvoted: post.downvotes?.some(id => id.toString() === userId.toString()) || false,
          alreadyVolunteered: !!isVolunteered,
          author: {
            avatar: author.avatar,
            name: author.fullName,
          },
          upvoteCount: post.upvotes?.length || 0,
        };
      })
    );

    // // Final sort by upvote count descending
    // postsWithExtras.sort((a, b) => b.upvoteCount - a.upvoteCount);

    res.status(200).json(postsWithExtras);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
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

    if (distance > 1) {
      return res
        .status(403)
        .json({ message: "You must be within 1 km to upvote this post." });
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

    if (distance > 1) {
      return res
        .status(403)
        .json({ message: "You must be within 1 km to downvote this post." });
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
    if (!user) throw new Error("Internal server error");

    // Find posts by user
    const posts = await Post.find({ createdBy: user }).sort({ createdAt: -1 }).lean();

    if (!posts) throw new Error("Internal server error");

    // Calculate the resolved count based on the post's state
    const resolvedCount = posts.filter((post) => post.status.state === 'Resolved').length;

    // Add upvote/downvote, author info, and alreadyVolunteered
    const postsWithExtras = await Promise.all(
      posts.map(async (post) => {
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
            avatar: user.avatar,
            name: user.fullName,
          },
        };
      })
    );

    res.status(200).json({
      message: "Posts fetched",
      posts: postsWithExtras,
      resolvedCount,
      success: true,
    });
  } catch (error) {
    console.error("Error in getUserPosts:", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};


import VolunteeredAndResolved from '../models/VolunteeredAndResolved.js';

export const getResolvedPostsData = async (req, res) => {
  try {
    const records = await VolunteeredAndResolved.find()
      .populate('resolvedBy', 'fullName')
      .populate('post', 'images');

    const result = records.map(record => ({
      fullName: record.resolvedBy?.fullName || null,
      postImage: record.post?.images?.[0] || null,
      resolvedImage: record.image,
      remarks: record.remarks
    }));

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
