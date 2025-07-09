import api from "./api";

export const createExamination = (data: {
  bookingId: number;
  examDate?: string;
  diagnosis: string;
  recommendation?: string;
  normalRange?: string;
  name?: string;
}) => {
  return api.post("/examinations", data);
};
