import axios from 'axios';
import { logout, refreshAccessToken } from '../features/auth/authSlice';

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const API_BASE_URL = 'http://localhost:3000/';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const result = await store.dispatch(refreshAccessToken()).unwrap();

        localStorage.setItem('token', result);
        instance.defaults.headers.common['Authorization'] = `Bearer ${result}`;
        originalRequest.headers['Authorization'] = `Bearer ${result}`;

        return instance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
