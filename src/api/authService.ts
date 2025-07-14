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
    role?: string;
  };
}

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  age?: number;
  gender?: string;
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export const authService = {
  // Đăng nhập
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  },

  // Đăng nhập Google
  loginWithGoogle: async () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/login/google`;
  },

  // Đăng ký
  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await api.post('/api/v1/auth/forgot-password', data);
    return response.data;
  },

  // Đặt lại mật khẩu
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post('/api/v1/auth/reset-password', data);
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