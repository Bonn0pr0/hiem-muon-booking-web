// src/api/paymentApi.ts
import api from "./api";

export const paymentApi = {
  // Tạo payment mới (thanh toán hóa đơn)
  create: (invoiceId: number, method: string = "BANKING") =>
    api.post("/api/payments", { invoiceId, method }),

  // Lấy danh sách payment theo invoiceId (nếu cần hiển thị lịch sử thanh toán)
  getByInvoice: (invoiceId: number) =>
    api.get(`/api/payments/invoice/${invoiceId}`),
}; 