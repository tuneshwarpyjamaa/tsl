import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost, getTrendingPosts, generateArticle } from '../controllers/post.controller.js';
import { getCompletePost, getOptimizedPostList, preWarmCache, getCacheStats } from '../controllers/post.optimized.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { checkPostOwnership } from '../middleware/post.middleware.js';
import commentRoutes from './comment.routes.js';

const router = Router();

// Nested comment routes
router.use('/:postId/comments', commentRoutes);

// List posts with optional search
router.get('/', listPosts);

// Optimized endpoints for better performance
router.get('/optimized/list', getOptimizedPostList);
router.get('/optimized/:slug', getCompletePost);

// Cache management endpoints (admin only)
router.post('/cache/prewarm', requireAuth, authorize('managePosts'), preWarmCache);
router.get('/cache/stats', requireAuth, authorize('managePosts'), getCacheStats);

// Dedicated search endpoint
router.get('/search', (req, res) => {
  // This will be handled by the listPosts controller with q parameter
  return listPosts(req, res);
});
router.get('/trending', getTrendingPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, authorize('createPosts'), createPost);
router.put('/:id', requireAuth, authorize('manageOwnPosts'), checkPostOwnership, updatePost);
router.delete('/:id', requireAuth, authorize('manageOwnPosts'), checkPostOwnership, deletePost);

// Article generation endpoint
router.post('/generate', requireAuth, authorize('createPosts'), generateArticle);

export default router;
