import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
});

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // You can handle global 401 errors here (e.g., redirect to login)
    return Promise.reject(error);
  }
);

export default api;
