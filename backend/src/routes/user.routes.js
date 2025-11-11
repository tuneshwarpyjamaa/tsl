import { Router } from 'express';
import { getCurrentUser, getAllUsers, updateUserRole, deleteUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/me', requireAuth, getCurrentUser);
router.get('/', requireAuth, authorize('manageUsers'), getAllUsers);
router.put('/:id/role', requireAuth, authorize('manageUsers'), updateUserRole);
router.delete('/:id', requireAuth, authorize('manageUsers'), deleteUser);

export default router;