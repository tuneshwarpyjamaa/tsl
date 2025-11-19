import api from './api';

export async function login(email, password) {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function register(data) {
  return api.post('/api/auth/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data);
}