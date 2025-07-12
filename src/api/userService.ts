import api from './api';

export interface CustomerInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface CustomerDetailInfo {
  id: number;
  email: string;
  name: string;
  gender?: string;
  address?: string;
  phone?: string;
  age?: number;
  updatedAt?: string;
  createdAt?: string;
}

export const getAllUsers = (params?: any) => api.get('/api/v1/users', { params });
export const getUserById = (id: number) => api.get(`/api/v1/users/${id}`);
export const createUser = (data: any) => api.post('/api/v1/users', data);
export const updateUser = (data: any) => api.put('/api/v1/users', data);
export const deleteUser = (id: number) => api.delete(`/api/v1/users/${id}`);

// Lấy thông tin user hiện tại dựa vào token (dùng cho chào mừng và quản lý customer)
export const getCurrentUser = (): Promise<{ data: CustomerInfo }> => api.get('/api/v1/auth/account');

// Lấy thông tin chi tiết của customer theo ID
export const getCustomerDetail = (id: number): Promise<{ data: CustomerDetailInfo }> => api.get(`/api/v1/users/${id}`);

// Lấy thông tin customer theo ID (cho admin hoặc quản lý)
export const getCustomerById = (id: number): Promise<{ data: CustomerDetailInfo }> => api.get(`/api/v1/users/${id}`);