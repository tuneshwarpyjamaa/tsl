import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api' : '/api'),
  withCredentials: true
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') localStorage.setItem('southline_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') localStorage.removeItem('southline_token');
  }
}

// Initialize from localStorage on the client
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('southline_token');
  if (saved) setAuthToken(saved);
}

export function getUserRole() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_role');
  }
  return null;
}

export function searchPosts(query) {
  return api.get('/posts', { params: { q: query } });
}

export function getCategories() {
  return api.get('/categories');
}

export default api;