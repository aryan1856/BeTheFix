import mongoose from 'mongoose';
import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js'; 
import {User} from '../models/user.model.js';

export const add = async (req, res) => {
    try {
        const userId = req.user._id;
        const { parent, text, postId } = req.body;

        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Post not found" });

        const newComment = new Comment({
            post: postId,
            user: userId,
            text
        });

        if (parent)
            newComment.parent = parent;

        const session = await mongoose.startSession();
        session.startTransaction();

        await newComment.save({ session });

        if (!parent) {
            post.comments.push(newComment._id);
            await post.save({ session });
        }

        await session.commitTransaction();
        await session.endSession();

        res.status(200).json({ message: "Comment added", comment: newComment, success: true });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}


export const remove = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(id).session(session);
        if (!comment) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Comment not found", success: false });
        }

        if (comment.user.toString() !== userId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const post = await Post.findById(comment.post).session(session);
        post.comments = post.comments.filter(c => c.toString() !== id.toString());
        await post.save({ session });

        await Comment.findByIdAndDelete(id).session(session);

        await Comment.deleteMany({ parent: id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Comment and replies deleted", success: true });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, success: false });
    }
}

export const getAllReplies = async (req, res) => {
    try {
        const id = req.params.id;

        const parent = await Comment.findById(id);
        if (!parent)
            return res.status(404).json({ message: "Parent comment not found", success: false });

        const replies = await Comment.find({ parent: id }).populate('user', 'fullName avatar');

        const repliesWithUser = replies.map((reply) => ({
            _id: reply._id,
            text : reply.text,
            parent: reply.parent,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            fullName: reply.user.fullName,
            avatar: reply.user.avatar
        }));

        res.status(200).json({ message: "Replies fetched", replies: repliesWithUser, success: true });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


export const getCommentsOnPosts = async (req, res) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID not provided", success: false });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found", success: false });
      }
  
      if (!post.comments || post.comments.length === 0) {
        return res.status(200).json({ message: "No comments", comments: [], success: true });
      }
  
      const comments = await Comment.find({ _id: { $in: post.comments } });
  
      const userIds = comments.map(comment => comment.user);
      const users = await User.find({ _id: { $in: userIds } }).select("fullName avatar");
  
      const userMap = new Map();
      users.forEach(user => {
        userMap.set(user._id.toString(), user);
      });
  
      const detailedComments = comments.map(comment => {
        const user = userMap.get(comment.user.toString());
        return {
          ...comment._doc,
          fullName: user?.fullName || "Unknown",
          avatar: user?.avatar || ""
        };
      });
  
      res.status(200).json({
        message: "Comments fetched",
        comments: detailedComments,
        success: true
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  };  