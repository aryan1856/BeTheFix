import express from 'express'
import { getAllForwardedPosts, updateStatus , AdminLogin, resolvePost, rejectPost, forwardPost} from '../controllers/AdminControllers.js';

const router=express.Router();

router.route("/login").post(AdminLogin);
router.route("/forward").post(forwardPost);
router.route("/reject").post(rejectPost);
router.route("/resolve").post(resolvePost);
router.route("/updateComplaintStatus").post(updateStatus)
router.route("/getForwardedPosts").get(getAllForwardedPosts)

export default router