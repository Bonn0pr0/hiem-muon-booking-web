import axios from "axios";

const bookingApi = {
  book: async (payload: {
    doctor: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu)
    const token = localStorage.getItem("token"); // Đảm bảo key đúng với app của bạn
    return axios.post(
      "http://localhost:8080/api/bookings/form",
      payload,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        }
      }
    );
  }
};

export { bookingApi };
