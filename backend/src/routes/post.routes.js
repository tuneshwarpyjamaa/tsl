import { Router } from 'express';
import { listPosts, getPost, getTrendingPosts } from '../controllers/post.controller.js';
import { getCompletePost, getOptimizedPostList } from '../controllers/post.optimized.controller.js';

const router = Router();

// List posts with optional search
router.get('/', listPosts);

// Optimized endpoints for better performance
router.get('/optimized/list', getOptimizedPostList);
router.get('/optimized/:slug', getCompletePost);

// Dedicated search endpoint
router.get('/search', (req, res) => {
  // This will be handled by the listPosts controller with q parameter
  return listPosts(req, res);
});
router.get('/trending', getTrendingPosts);
router.get('/:slug', getPost);

export default router;
