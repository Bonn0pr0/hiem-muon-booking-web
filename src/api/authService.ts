import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  address: string;
}

export const authService = {
  // Đăng nhập
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  },

  // Đăng ký
  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  // Lấy thông tin tài khoản hiện tại
  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/account');
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.get('/api/v1/auth/refresh');
    return response.data;
  }
}; 