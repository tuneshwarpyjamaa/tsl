import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tmw_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        content: newComment,
      });
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-serif font-bold mb-8">Comments</h2>
      {isAuthenticated ? (
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border-2 border-black p-4 font-sans"
              rows="4"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 mt-4 font-sans uppercase tracking-wider"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      ) : (
        <p className="font-sans">Please log in to post a comment.</p>
      )}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b-2 border-gray-200 pb-4">
            <p className="font-bold font-sans">{comment.author}</p>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            <p className="font-serif">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
