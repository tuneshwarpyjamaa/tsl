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

    // Don't redirect to login for public endpoints
    const isPublicEndpoint = error.config?.url?.includes('/posts/optimized') ||
      error.config?.url?.includes('/categories/featured');

    if (!isPublicEndpoint && typeof window !== 'undefined') {
      // Only handle auth errors on protected routes
      if (error.response?.status === 401) {
        // Clear potentially invalid token
        setAuthToken(null);

        // Only redirect if we're not on a public page
        if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
          // Use setTimeout to avoid redirecting during SSR
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
    }

    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  // This function should ONLY run on the client side
  if (typeof window === 'undefined') {
    return;
  }

  if (token && typeof token === 'string' && token.length > 10) {
    // Only set token if it's a valid-looking JWT (basic validation)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('southline_token', token);
    console.log('Auth token set successfully');
  } else {
    // Clear invalid tokens
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('southline_token');
    console.log('Invalid token cleared');
  }
}

// Initialize token ONLY on the client-side where localStorage is available
if (typeof window !== 'undefined') {
  try {
    const savedToken = localStorage.getItem('southline_token');
    if (savedToken && typeof savedToken === 'string' && savedToken.length > 10) {
      setAuthToken(savedToken);
    } else if (savedToken) {
      // Clear invalid token
      localStorage.removeItem('southline_token');
    }
  } catch (error) {
    console.warn('Failed to initialize auth token:', error);
  }
}

export function getUserRole() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_role');
  }
  return null;
}

export function searchPosts(query) {
  return api.get('/api/posts', { params: { q: query } });
}

export function getCategories() {
  return api.get('/api/categories');
}

export default api;
