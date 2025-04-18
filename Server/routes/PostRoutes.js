import express from 'express';
import { createPost, 
    deletePost, 
    getAllPosts,
    updateByUser,
    toggleUpvote,
    toggleDownvote,
    getUserPosts} from '../controllers/PostController.js';
import isAuthenticated from '../middlewares/check-auth.js';
import { upload } from '../middlewares/multer.js';
 
const router = express.Router();

router.get('/', isAuthenticated, getAllPosts);
router.get("/u", isAuthenticated, getUserPosts);
router.post('/create', isAuthenticated, upload.array('images'), createPost);
router.delete('/delete', isAuthenticated, deletePost);
router.put("/u/update", isAuthenticated, updateByUser);
router.put("/u/upvote/:id", isAuthenticated, toggleUpvote);
router.put("/u/downvote/:id", isAuthenticated, toggleDownvote);
 
export default router;