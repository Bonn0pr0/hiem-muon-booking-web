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
  }
};

export { bookingApi };
