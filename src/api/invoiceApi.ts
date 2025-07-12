// src/api/invoiceApi.ts
import api from "./api";
export const invoiceApi = {
  getByUser: (userId: number) => api.get(`/api/invoices/user/${userId}`),
  getById: (invoiceId: number) => api.get(`/api/invoices/${invoiceId}`),
  getByBookingId: (bookingId: number) => api.get(`/api/invoices/booking/${bookingId}`),
  create: (bookingId: number) => api.post("/api/invoices/create", { bookingId }),
};
