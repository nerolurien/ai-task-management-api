import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    Cookies.remove('token');
    Cookies.remove('role');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default apiClient;

