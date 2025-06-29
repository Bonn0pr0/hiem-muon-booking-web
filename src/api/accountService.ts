import api from './api';

export const getAllAccounts = () => api.get('/api/accounts');
export const getAccountById = (id: number) => api.get(`/api/accounts/${id}`);
export const createAccount = (data: any) => api.post('/api/accounts', data);
export const updateAccount = (id: number, data: any) => api.put(`/api/accounts/${id}`, data);
export const deleteAccount = (id: number) => api.delete(`/api/accounts/${id}`); 