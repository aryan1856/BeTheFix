import express from 'express'
import { getAllForwardedPosts, updateStatus , AdminLogin} from '../controllers/AdminControllers.js';

const router=express.Router();

router.route("/login").post(AdminLogin);
router.route("/updateComplaintStatus").post(updateStatus)
router.route("/getForwardedPosts").get(getAllForwardedPosts)

export default router