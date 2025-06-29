import api from './api';

export const getAllUsers = (params?: any) => api.get('/api/v1/users', { params });
export const getUserById = (id: number) => api.get(`/api/v1/users/${id}`);
export const createUser = (data: any) => api.post('/api/v1/users', data);
export const updateUser = (data: any) => api.put('/api/v1/users', data);
export const deleteUser = (id: number) => api.delete(`/api/v1/users/${id}`);

// Lấy thông tin user hiện tại dựa vào token (dùng cho chào mừng và quản lý customer)
export const getCurrentUser = () => api.get('/api/v1/auth/account');