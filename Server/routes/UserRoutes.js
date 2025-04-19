import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js';
import { upload } from '../middlewares/multer.js';
import { update, generateComplaint, getUsersRankWise, volunteerForPost, getUserVolunteeredPosts, resolvePost } from '../controllers/UserController.js';

const router=express.Router();

router.route('/').post(getUsersRankWise);
router.put("/update", isAuthenticated, update)
router.route("/generate-complaint").post(generateComplaint)
router.route("/volunteerpost/:postId").post(isAuthenticated,volunteerForPost)
router.route("/getuservolunteeredposts").get(isAuthenticated,getUserVolunteeredPosts)
router.post('/volunteerandresolvepost', isAuthenticated, upload.single('image'), resolvePost);


export default router