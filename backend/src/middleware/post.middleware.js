import Post from '../models/Post.js';

export async function checkPostOwnership(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Admins and Editors can bypass the ownership check
    const userRole = req.user.role.toLowerCase();
    if (userRole === 'admin' || userRole === 'editor') {
      return next();
    }

    // Check if the user is the author of the post
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You are not the author of this post.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while checking post ownership.' });
  }
}
