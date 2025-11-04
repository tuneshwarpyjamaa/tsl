import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost, getTrendingPosts } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/', listPosts);
router.get('/trending', getTrendingPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, authorize('managePosts'), createPost);
router.put('/:id', requireAuth, authorize('managePosts'), updatePost);
router.delete('/:id', requireAuth, authorize('managePosts'), deletePost);

export default router;
