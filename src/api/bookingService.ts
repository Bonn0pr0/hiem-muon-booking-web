import axios from './api';

export const bookingApi = {
  book: (data: any) => axios.post('/api/bookings/form', data),
}; 