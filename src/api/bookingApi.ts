import api from "./api"; // Đã cấu hình interceptor

const bookingApi = {
  book: async (payload: {
    doctor: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    return api.post("/api/bookings/form", payload);
  },
  getByCustomerId: async (customerId) => {
    return api.get(`/api/bookings/customer/${customerId}`);
  },
  getById: async (id: number) => {
    return api.get(`/api/bookings/${id}`);
  }
};

// Lấy danh sách bệnh nhân theo doctorId
export const getPatientsByDoctorId = (doctorId: number) =>
  api.get(`/api/bookings/patients/${doctorId}`);

export { bookingApi };
