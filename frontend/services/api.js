import axios from 'axios';

const getApiBaseUrl = () => {
  // If an explicit public URL is provided, always use it. This is the most reliable method.
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Logic for the SERVER environment (e.g., during Server-Side Rendering)
  if (typeof window === 'undefined') {
    // When deployed to Vercel, the VERCEL_URL environment variable is available.
    // We must use this to construct the full internal URL to the backend API.
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }
    // For local development SSR (e.g., running `npm run dev`), we use the local backend URL.
    return 'http://localhost:4000/api';
  }

  // Logic for the CLIENT environment (i.e., in the browser)
  // For local development, we connect to the local backend.
  if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000/api';
  }

  // In a deployed Vercel environment, the browser can use a relative path.
  // The rewrite rules in vercel.json will correctly proxy the request to the backend.
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
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
