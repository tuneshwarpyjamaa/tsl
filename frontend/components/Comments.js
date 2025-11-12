import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import ConfirmationModal from './modals/ConfirmationModal';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('southline_token');
    const userEmail = localStorage.getItem('user_email');
    const userRole = localStorage.getItem('user_role');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setCurrentUser({ email: userEmail, role: userRole });
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

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await api.delete(`/posts/${postId}/comments/${commentToDelete.id}`);
      setComments(comments.filter(comment => comment.id !== commentToDelete.id));
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  const canDeleteComment = (comment) => {
    if (!currentUser) return false;
    return comment.author === currentUser.email || currentUser.role === 'admin';
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
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold font-sans">{comment.author}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className="font-serif">{comment.content}</p>
              </div>
              {canDeleteComment(comment) && (
                <button
                  onClick={() => openDeleteModal(comment)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        confirmText=""
        setConfirmText={() => {}}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
        cancelButtonText="Cancel"
      >
        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
      </ConfirmationModal>
    </div>
  );
}
