import api from "./api";

export const workScheduleApi = {
  getAll: () => api.get("/api/work-schedules"),
  getByDoctor: (doctorId: number) => api.get(`/api/work-schedules/doctor/${doctorId}`),
  create: (data: any) => api.post("/api/work-schedules/create", data),
  update: (id: number, data: any) => api.put(`/api/work-schedules/${id}`, data),
};
