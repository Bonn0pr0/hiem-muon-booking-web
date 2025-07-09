import api from "./api";
export const getReferenceRange = (testName: string) => {
  return api.get(`/api/reference-range/${encodeURIComponent(testName)}`);
};

export const getAllReferenceRanges = () => {
  return api.get("/api/reference-range/all");
};
