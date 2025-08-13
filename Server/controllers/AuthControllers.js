import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { OAuth2Client } from 'google-auth-library';
import { Admin } from "../models/Admin.model.js";
import fetchLocation from '../utils/fetchLocation.js';
//import {OpenAI } from 'openai'

export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      confirmPassword,
      latitude,
      longitude,
      gender,
      age
    } = req.body;

    const avatar = req.file ? req.file.path : null;

    if (!avatar) {
      return res.status(400).json({ message: "Avatar is required." });
    }

    if (
      !fullname  || !email || !password ||
      !confirmPassword || !latitude || !longitude || !gender || !age
    ) {
      return res.status(400).json({ message: "All fields are required!!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists! Try a different one." });
    }


    const hashedPass = await bcrypt.hash(password, 10);

    const uploadResponse = await uploadOnCloudinary(avatar);
    const avatarUrl = uploadResponse?.secure_url;
    if (!avatarUrl) {
      return res.status(400).json({ message: "Avatar upload failed" });
    }

    const location = await fetchLocation(longitude, latitude);

    const user = await User.create({
      fullName: fullname,
      email,
      password: hashedPass,
      avatar: avatarUrl,
      gender,
      age,
      location
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: createdUser
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server Error', success: false });
  }
};

  export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the required fields." })
        }

        const user = await User.findOne({ email })
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
            expiresIn: '7d'
        })
        const createdUser=user.toObject()
        delete user.password
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
            .json({
                message:"Logged in successfully",
                createdUser,
                token
            })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server Error',
            success: false
        })
    }
}
  
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req, res) => {
  try {
    const { token, address, latitude, longitude, gender, age } = req.body;

    if (!token || !address || !latitude || !longitude || !gender || !age) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // new user
      const hashedPass = await bcrypt.hash(sub, 10); // for compatibility
      const location = await fetchLocation(longitude, latitude);

      user = await User.create({
        fullName: name,
        email,
        password: hashedPass,
        avatar: picture,
        address,
        gender,
        age,
        location
      });
    }
    if(!user){
      res.status(500).json({
        message:"Invalid User"
      })
    }
    const tokenData={
      userId:user._id
    }
    const authToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const createdUser=user.toObject()
    delete user.password

    return res.status(200).cookie("token", authToken, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'None',
      secure:'false'
  })
      .json({
          createdUser ,
          message:"Google login successfully",
          token : authToken
      })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google Sign-In failed", success: false });
  }
};

export const AdminLogin = async (req, res) => {
  try {
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

      return res.status(200).cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'None',
          secure:true,
      })
          .json({
              _id: user._id,
              email: user.email,
              departmentType:user.departmentType,
              resolveCount:user.resolveCount,
              pendingCount:user.pendingCount,
              forwardedPosts:user.forwardedPosts,
              success: true
          })

  } catch (error) {
      console.error(error)
      return res.status(500).json({
          message: 'Server Error',
          success: false
      })
  }
}

//const openai = new OpenAI({
 // apiKey: process.env.OPENAI_API_KEY, // .env file me daal
//});


// export const generateComplaint=async (req, res) => {
//   const { category, userDescription } = req.body;

//   try {
//     const prompt = `Write a formal complaint in English to the city authorities regarding a "${category}" issue. User described it as: "${userDescription}". Make it polite, concise, and specific.`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const complaint = completion.choices[0].message.content;
//     res.status(200).json({ complaint });

//   } catch (error) {
//     console.error('OpenAI Error:', error);
//     res.status(500).json({ error: 'Failed to generate complaint' });
//   }
// };

export const logout = async (req, res) => {
  try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
          message: "Logged Out Successfully."
      })
  } catch (error) {
      console.error('Error during logout:', error)
      res.status(500).json({
          message: 'Server Error',
          success: false
      })
  }
}

export const getUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user=req.user;
      res.status(200).json({
        _id: user._id,
        email: user.email,
        fullName:user.fullname,
        avatar:user.avatar,
        success: true
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };