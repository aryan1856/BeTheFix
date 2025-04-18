import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  departmentType: {
    type: String,
    enum: ['Municipality', 'PWD', 'Cleanliness'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resolveCount: {
    type: Number,
    default: 0,
  },
  pendingCount: {
    type: Number,
    default: 0,
  },
  forwardedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }]
});

export const Admin = mongoose.model('Admin', adminSchema);
