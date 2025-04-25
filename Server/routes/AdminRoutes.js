import express from 'express'

import { getAllForwardedPosts, updateStatus , AdminLogin, resolvePost, rejectPost, forwardPost,adminRegister, getMunicipalityPosts, getForwardedPostsByDepartment} from '../controllers/AdminControllers.js';
import isAuthenticated from '../middlewares/check-auth-admin.js';

const router=express.Router();

router.route("/login").post(AdminLogin);
router.route("/forward").post(isAuthenticated,forwardPost);
router.route("/reject").post(isAuthenticated,rejectPost);
router.route("/resolve").post(isAuthenticated, resolvePost);
router.route("/register").post(adminRegister)
router.route("/getmunicipalityposts").get(isAuthenticated,getMunicipalityPosts)
router.route("/getadminposts").get(isAuthenticated,getForwardedPostsByDepartment)

export default router