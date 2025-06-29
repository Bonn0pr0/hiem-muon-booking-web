import api from './api';

export const getAllSchedules = () => api.get('/api/schedules');
export const getScheduleById = (id: number) => api.get(`/api/schedules/${id}`);
export const createSchedule = (data: any) => api.post('/api/schedules/create', data);
export const updateSchedule = (id: number, data: any) => api.put(`/api/schedules/${id}`, data);
export const deleteSchedule = (id: number) => api.delete(`/api/schedules/${id}`); 