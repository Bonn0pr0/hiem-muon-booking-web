import api from "./api";

export const createMedicalResult = (data: {
  examId: number;
  resultValue: string;
  resultDate: string; // ISO format: "YYYY-MM-DD"
  conclusion: string;
}) => {
  return api.post("/api/results/add", data);
};

export const getMedicalResultsByCustomer = (customerId: number) => {
  return api.get(`/api/results/customer/${customerId}`);
};

export const getMedicalResultsByExam = (examId: number) => {
  return api.get(`/api/results/exam/${examId}`);
};

export const updateMedicalResult = (resultId: number, data: {
  resultValue: string;
  resultDate: string;
  conclusion: string;
}) => {
  return api.put(`/api/results/update/${resultId}`, data);
};
