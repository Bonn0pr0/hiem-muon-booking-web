import api from "./api";
export const createTreatmentPlan = (data: {
  bookingId: number;
  phase: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  activities: string[];
}) => {
  return api.post("/api/treatment-schedules/create", data);
};

export const getTreatmentPlansByBooking = (bookingId: number) => {
  return api.get(`/api/treatment-plans?bookingId=${bookingId}`);
};
