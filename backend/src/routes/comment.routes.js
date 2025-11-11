import express from 'express';
import {
  getComments,
  createComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', requireAuth, createComment);
router.delete('/:commentId', requireAuth, deleteComment);

export default router;
