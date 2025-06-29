import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Đổi lại nếu backend chạy port khác hoặc domain khác
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
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
    if (error.response?.status === 401) {
      // Token hết hạn, chuyển về trang đăng nhập
      localStorage.removeItem("accessToken");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;