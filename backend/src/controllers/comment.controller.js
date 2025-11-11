import { getClient } from '../config/db.js';

export const getComments = async (req, res) => {
  const { postId } = req.params;
  const client = getClient();
  try {
    const result = await client.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC', [postId]);
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
