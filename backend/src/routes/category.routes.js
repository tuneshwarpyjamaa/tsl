import { Router } from 'express';
import { listCategories, getPostsByCategory, createCategory, updateCategory, deleteCategory, getFeaturedCategories } from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/', listCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:slug/posts', getPostsByCategory);
router.post('/', requireAuth, authorize('manageCategories'), createCategory);
router.put('/:id', requireAuth, authorize('manageCategories'), updateCategory);
router.delete('/:id', requireAuth, authorize('manageCategories'), deleteCategory);

export default router;
