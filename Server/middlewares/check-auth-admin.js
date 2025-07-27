import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.model.js';
import dotenv from 'dotenv'
dotenv.config({})

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: 'Invalid Token!!' });
    }

    // Find user by decoded userId from token
    const admin = await Admin.findById(decode.userId).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid Token!!' });
    }

    // Attach user object to request object
    req.user = admin;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export default isAuthenticated;
