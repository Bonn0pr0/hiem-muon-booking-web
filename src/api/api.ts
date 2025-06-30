import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Đổi lại nếu backend chạy port khác hoặc domain khác
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Tạm thời comment để test
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
  // Không gắn token cho các endpoint auth
  if (
    config.url?.includes('/auth/login') ||
    config.url?.includes('/auth/register') ||
    config.url?.includes('/auth/refresh')
  ) {
    return config;
  }
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem("accessToken");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;