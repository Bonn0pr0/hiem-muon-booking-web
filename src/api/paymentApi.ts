// src/api/paymentApi.ts
import api from "./api";

export interface PaymentRequest {
  invoiceId: number;
  amount?: number;
}

export interface PaymentResponse {
  paymentId: number;
  amount: number;
  method: string;
  paymentDate: string;
}

export interface PaymentQRResponse {
  invoiceId: number;
  amount: number;
  qrContent: string;
  qrCodeBase64: string;
  bankInfo: string;
  accountNumber: string;
}

export const paymentApi = {
  // Tạo payment mới (thanh toán hóa đơn)
  create: (data: PaymentRequest) =>
    api.post("/api/payments", data),

  // Lấy danh sách payment theo invoiceId (nếu cần hiển thị lịch sử thanh toán)
  getByInvoice: (invoiceId: number) =>
    api.get<PaymentResponse[]>(`/api/payments/invoice/${invoiceId}`),

  // Lấy QR code cho thanh toán
  getPaymentQR: (invoiceId: number, comment?: string) =>
    api.get<PaymentQRResponse>(`/api/payments/qr/${invoiceId}`, {
      params: { comment: comment || "" }
    }),
}; 