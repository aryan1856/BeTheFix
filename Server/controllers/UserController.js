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
  