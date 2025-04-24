import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  departmentType: {
    type: String,
    enum: ['Municipality', 'PWD', 'Cleanliness', 'Water Supply', 'Electricity', 'Education', 'Sewage'],
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
  }],
  city:{
    type: "String",
    required:true
  }
});

export const Admin = mongoose.model('Admin', adminSchema);
