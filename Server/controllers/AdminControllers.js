import Post from '../models/Post.model.js'
import {Admin} from '../models/Admin.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import validator from 'validator'

export const updateStatus=async(req,res)=>{
    try{
        const {updatedStatus,remarks}=req.body
        const postId = req.params.id;
        const adminId=req.user._id
        const post=await Post.findById(postId);
        const admin=await Admin.findById(adminId)
        if(!post){
            res.status(404).json({message:"Post not found"})
        }
        if(!admin){
            res.status(401).json({message:"Not Authorized"})
        }
        post.status.remarks=remarks
        post.status.state=updatedStatus //['Pending', 'In Progress', 'Resolved', 'Rejected']
        await post.save()
        if(updateStatus==='Resolved'){
            admin.resolveCount++
            admin.pendingCount--
        await admin.save()
        }
        return res.status(200).json({ message: "Status updated successfully", post });
    }catch(error){
        res.status(500).json({ message: error.message, success: false });
    }
}

export const getAllForwardedPosts=async(req,res)=>{
    try{
        const {adminId}=req.user._id
        const admin=await Admin.findById(adminId)
        if(!admin){
            res.status(401).json({message:"Unauthorized"})
        }
        const forwardedPosts=admin.forwardedPosts
        res.status(200).json({
            message:"Fetched all posts",
            forwardedPosts
        })
    }catch(error){
        res.status(500).json({ message: error.message, success: false });
    }
}

export const AdminLogin = async (req, res) => {
    try {
      console.log("inside")
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
        const createdUser=user.toObject()
          delete user.password
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure:true,
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

  export const adminRegister = async (req, res) => {
    try {
      const { departmentType, email, password, confirmPassword,city } = req.body;
  
      if (!departmentType || !email || !password || !confirmPassword || !city) {
        return res.status(400).json({ message: "All fields are required!" });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email" });
      }
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists! Try a different one." });
      }
  
      const hashedPass = await bcrypt.hash(password, 10);
  
      const admin = await Admin.create({
        departmentType,
        email,
        city,
        password: hashedPass
      });
  
      const createdAdmin = await Admin.findById(admin._id).select("-password");
  
      return res.status(201).json({
        message: "Admin account created successfully.",
        success: true,
        admin: createdAdmin
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Server Error', success: false });
    }
  };

  export const forwardPost = async (req, res) => {
    try {
        const { postId, targetDepartment} = req.body;
        const adminId = req.user._id;
        
        // Verify the admin is a Municipality admin
        const admin = await Admin.findById(adminId);
        if(!admin)
            return res.status(404).json({message : "Invalid admin ID", success : false});
        if (admin.departmentType !== 'Municipality') {
            return res.status(403).json({ message: 'Only Municipality admins can forward posts', success : false});
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success : false});
        }

        // Verify the post is in a forwardable state
        if (!post.status.state.includes('Pending')) {
            return res.status(400).json({ message: 'Post is not in a forwardable state' });
        }

        // Find target admin(s) in the specified department
        const targetAdmins = await Admin.find({ departmentType: targetDepartment });
        if (targetAdmins.length === 0) {
            return res.status(404).json({ message: 'No admins found in the target department' });
        }

        // Update post status
        post.status.state = `Pending at ${targetDepartment} Department`;
        await post.save();

        // Add post to forwardedPosts of each target admin
        await Promise.all(targetAdmins.map(async (targetAdmin) => {
            targetAdmin.forwardedPosts.push(postId);
            targetAdmin.pendingCount += 1;
            await targetAdmin.save();
        }));

        res.status(200).json({ message: 'Post forwarded successfully', post });

    } catch (error) {
        console.error('Error forwarding post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resolvePost = async (req, res) => {
    try {
        const { postId, resolutionText} = req.body;
        const resolutionImage = req.file?.path; // Assuming you're using multer or similar for file uploads
        const adminId = req.user._id

        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Invalid admin ID', success : false});
        }

        // Find the post and verify it's assigned to this admin
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success : false});
        }

        // Check if post is assigned to this admin's department
        const adminDepartment = admin.departmentType;
        if (!post.status.state.includes(adminDepartment)) {
            return res.status(403).json({ 
                message: `Post is not assigned to your department (${adminDepartment})` 
            });
        }

        // Update post status and resolution details
        post.status.state = 'Resolved';
        post.status.remarks = resolutionText;
        post.resolution = {
            resolvedBy: adminId,
            resolvedDate: new Date(),
            resolutionImage: resolutionImage || null
        };

        await post.save();

        // Update admin stats
        admin.resolveCount += 1;
        admin.pendingCount -= 1;
        // admin.forwardedPosts = admin.forwardedPosts.filter(id => id.toString() !== postId);
        await admin.save();

        res.status(200).json({ message: 'Post resolved successfully', success : true});

    } catch (error) {
        console.error('Error resolving post:', error);
        res.status(500).json({ message: 'Internal server error', success : false});
    }
};

export const rejectPost = async (req, res) => {
    try {
        const { postId, rejectionReason} = req.body;
        const adminId = req.user._id;
        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Invalid admin ID', success : false });
        }

        // Find the post and verify it's assigned to this admin
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success : false});
        }

        // Check if post is assigned to this admin's department
        const adminDepartment = admin.departmentType;
        if (!post.status.state.includes(adminDepartment)) {
            return res.status(403).json({ 
                message: `Post is not assigned to your department (${adminDepartment})`,
                success : false 
            });
        }

        // Update post status to rejected
        post.status.state = 'Rejected';
        post.status.remarks = rejectionReason;
        await post.save();

        // Update admin stats
        admin.pendingCount -= 1;
        // admin.forwardedPosts = admin.forwardedPosts.filter(id => id.toString() !== postId);
        await admin.save();

        res.status(200).json({ message: 'Post rejected successfully', success : true });

    } catch (error) {
        console.error('Error rejecting post:', error);
        res.status(500).json({ message: 'Internal server error', success : false});
    }
};

export const getMunicipalityPosts = async (req, res) => {
    try {
      const adminId = req.user._id; 
  
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      const posts = await Post.find({
        'status.state': { $nin: ['Resolved', 'Rejected'] },
        'location.city': admin.city
      });
      
  
      const filteredPosts = posts.filter(post => post.upvotes.length >= 0);
  
      return res.status(200).json({
        message: "Municipality posts fetched successfully.",
        success: true,
        posts: filteredPosts
      });
    } catch (error) {
      console.error("Error in getMunicipalityPosts:", error.message);
      return res.status(500).json({ message: 'Server Error', success: false });
    }
  };

  export const getForwardedPostsByDepartment = async (req, res) => {
    try {
      const adminId = req.user._id;
  
      const admin = await Admin.findById(adminId);

      const posts = await Post.find({
        _id: { $in: admin.forwardedPosts }
      });
  
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      return res.status(200).json({
        message: `${admin.departmentType} forwarded posts fetched successfully.`,
        success: true,
        posts
      });
    } catch (error) {
      console.error("Error in getForwardedPostsByDepartment:", error.message);
      return res.status(500).json({ message: 'Server Error', success: false });
    }
  };