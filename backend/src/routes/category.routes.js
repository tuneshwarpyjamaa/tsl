import { Router } from 'express';
import { listCategories, getPostsByCategory, getFeaturedCategories } from '../controllers/category.controller.js';

const router = Router();

router.get('/', listCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:slug/posts', getPostsByCategory);

export default router;
