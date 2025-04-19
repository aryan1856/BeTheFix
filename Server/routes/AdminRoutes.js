import express from 'express'
import { getAllForwardedPosts, updateStatus } from '../controllers/AdminControllers.js';

const router=express.Router();

router.route("/updateComplaintStatus").post(updateStatus)
router.route("/getForwardedPosts").get(getAllForwardedPosts)

export default router