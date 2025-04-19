import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js';
import { update, generateComplaint, getUsersRankWise } from '../controllers/UserController.js';

const router=express.Router();

router.route('/').post(getUsersRankWise);
router.put("/update", isAuthenticated, update)
router.route("/generate-complaint").post(generateComplaint)

export default router