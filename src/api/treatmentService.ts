import axios from './api'; // Đảm bảo đã cấu hình baseURL, token...

export const treatmentServiceApi = {
  getAll: () => axios.get('/api/v1/treatment-services'),
  getById: (id: number) => axios.get(`/api/v1/treatment-services/${id}`),
  create: (data: any) => axios.post('/api/v1/treatment-services/create', data),
  delete: (id: number) => axios.delete(`/api/v1/treatment-services/${id}`),
  // Nếu cần update, bổ sung sau
};
