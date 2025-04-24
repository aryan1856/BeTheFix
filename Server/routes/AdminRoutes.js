import express from 'express'
import { getAllForwardedPosts, updateStatus , AdminLogin, adminRegister} from '../controllers/AdminControllers.js';

const router=express.Router();

router.route("/login").post(AdminLogin);
router.route("/updateComplaintStatus").post(updateStatus)
router.route("/getForwardedPosts").get(getAllForwardedPosts)
router.route("/register").post(adminRegister)

export default router