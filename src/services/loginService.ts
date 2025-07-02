
import axios from "axios";

const bookingApi = {
  book: async (payload: {
    doctor: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
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

// Helper function for storing token after login
export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};
