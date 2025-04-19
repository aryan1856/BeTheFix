import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number },
  badges: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  resolvedCount: { type: Number, default: 0 },
  isVolunteer: { type: Boolean, default: false },
  location: {
      area : {
        type : String,
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
  },
  volunteeredAndResolved : {
    type : Number,
    default : 0
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
