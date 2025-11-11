import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost, getTrendingPosts, generateArticle } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.js';
import { checkPostOwnership } from '../middleware/post.middleware.js';
import commentRoutes from './comment.routes.js';

const router = Router();

// Nested comment routes
router.use('/:postId/comments', commentRoutes);

// List posts with optional search
router.get('/', listPosts);

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
