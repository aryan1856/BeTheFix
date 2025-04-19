import express from 'express'

import { upload } from '../middlewares/multer.js';
import { googleSignIn, login, register,logout } from '../controllers/AuthControllers.js';
const router=express.Router();

router.route("/register").post(upload.single('avatar'),register)
router.route("/login",login).post(login)
router.route("/logout").get(logout)
router.route("/google-login").post(googleSignIn)
// router.put("/update",)
// router.route("/generate-complaint").post(generateComplaint)

export default router