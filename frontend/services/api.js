import axios from 'axios';

const getApiBaseUrl = () => {
  // Prioritize environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Handle server-side rendering (Node.js environment)
  if (typeof window === 'undefined') {
    // In production on Vercel, try to use VERCEL_URL if available
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // Fallback to localhost for development
    return 'http://localhost:4000';
  }

  // Handle client-side (browser environment)
  if (typeof window !== 'undefined') {
    // If running locally, use localhost backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }

    // In production, use relative API paths (Vercel handles routing)
    return '';
  }

  // Default fallback
  return '';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and error handling
api.interceptors.request.use(
  (config) => {
    // Log requests in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export function searchPosts(query) {
  return api.get('/api/posts', { params: { q: query } });
}

export function getCategories() {
  return api.get('/api/categories');
}

export default api;
