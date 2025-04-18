import express from 'express'
import { upload } from '../middlewares/multer.js';
import { register,login } from '../controllers/AuthControllers';
const router=express.Router();

router.route("/register").post(register)
router.route("/login",login).post(login)
router.route("/logout")

export default router