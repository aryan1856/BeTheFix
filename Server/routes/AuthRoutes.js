import express from 'express'

import { upload } from '../middlewares/multer.js';
import { googleSignIn, login, register,logout, getUser } from '../controllers/AuthControllers.js';
import isAuthenticated from '../middlewares/check-auth.js';
const router=express.Router();

router.route("/register").post(upload.single('avatar'),register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/google-login").post(googleSignIn)
router.route("/get-user").get(isAuthenticated, getUser);

export default router