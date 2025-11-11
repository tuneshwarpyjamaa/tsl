import { getClient } from '../config/db.js';

export const getComments = async (req, res) => {
  const { postId } = req.params;
  const client = getClient();
  try {
    const result = await client.query(
      'SELECT c.*, u.email as author FROM comments c JOIN users u ON c.author_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC',
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const authorId = req.user.id; // Assuming user ID is available from requireAuth middleware

  if (!content) {
    return res.status(400).json({ error: 'Comment content cannot be empty' });
  }

  const client = getClient();
  try {
    const result = await client.query(
      'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, authorId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const client = getClient();
  try {
    // Check if user is the author or admin
    const commentResult = await client.query(
      'SELECT author_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const commentAuthorId = commentResult.rows[0].author_id;

    if (commentAuthorId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await client.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
