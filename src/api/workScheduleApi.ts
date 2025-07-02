import api from "./api";

export const workScheduleApi = {
  getByDoctor: (doctorId: number) => api.get(`/api/work-schedules/doctor/${doctorId}`),
};
