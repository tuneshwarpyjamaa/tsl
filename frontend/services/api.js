import axios from 'axios';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window === 'undefined') {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }
    return 'http://localhost:4000/api';
  }

  if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000/api';
  }

  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

export function setAuthToken(token) {
  // This function should ONLY run on the client side
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('southline_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('southline_token');
  }
}

// Initialize token ONLY on the client-side where localStorage is available
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('southline_token');
  if (savedToken) {
    setAuthToken(savedToken);
  }
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
