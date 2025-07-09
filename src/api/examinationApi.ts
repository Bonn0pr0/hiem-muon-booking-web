import api from "./api";

export const createExamination = (data: {
  bookingId: number;
  examDate?: string;
  diagnosis: string;
  recommendation?: string;
  normalRange?: string;
  name?: string;
}) => {
  return api.post("/api/v1/examinations", data);
};

export const getExaminationsByBooking = (bookingId: number) => {
  return api.get(`/api/v1/examinations/booking/${bookingId}`);
};