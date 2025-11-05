import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost, getTrendingPosts, generateArticle } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { checkPostOwnership } from '../middleware/post.middleware.js';

const router = Router();

router.get('/', listPosts);
router.get('/trending', getTrendingPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, authorize('createPosts'), createPost);
router.put('/:id', requireAuth, authorize('manageOwnPosts'), checkPostOwnership, updatePost);
router.delete('/:id', requireAuth, authorize('manageOwnPosts'), checkPostOwnership, deletePost);

// Article generation endpoint
router.post('/generate', requireAuth, authorize('createPosts'), generateArticle);

export default router;
