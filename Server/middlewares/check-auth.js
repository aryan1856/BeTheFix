import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv'
dotenv.config({})

const isAuthenticated = async (req, res, next) => {
  try {
   
    const token = req.cookies.token;
    //  console.log(token)

    if (!token) {
      return res.status(401).json({ message: 'User authentication failed!!' });
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: 'Invalid Token!!' });
    }

    // Find user by decoded userId from token
    const user = await User.findById(decode.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid Token!!' });
    }

    // Attach user object to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export default isAuthenticated;
