import axios from './api';

export const doctorServiceApi = {
  getAll: () => axios.get('/api/bookings/doctors'),
  // Thêm các hàm khác nếu cần
};
