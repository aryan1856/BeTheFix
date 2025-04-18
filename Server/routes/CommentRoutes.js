import express from 'express';
import { add, remove, getAllReplies} from '../controllers/CommentController.js';
import isAuthenticated from '../middlewares/check-auth.js';

const router = express.Router();

router.post("/add", isAuthenticated, add);
router.delete("/delete/:id", isAuthenticated, remove);
router.get("/replies/:id",getAllReplies);

export default router; 