import api from "./api";

// Lấy tất cả user (UserAdminResponse)
export const getAllUsers = () => api.get("/api/v1/admin/users");

// Lấy tất cả role
export const getAllRoles = () => api.get("/api/v1/admin/roles");

// Đổi role user
export const changeUserRole = (userId: number, roleId: number) =>
  api.put("/api/v1/admin/users/change-role", { userId, roleId });

// Xóa (deactivate) account
export const deleteUser = (id: number) =>
  api.delete(`/api/v1/admin/users/${id}`);

// Lấy user theo role
export const getUsersByRole = (roleName: string) =>
  api.get(`/api/v1/admin/users/role/${roleName}`);

// Lấy user theo id (ResAdminUserDTO)
export const getUserById = (userId: number) =>
  api.get(`/api/v1/admin/users/${userId}`);

// Tìm kiếm user (UserAdminResponse)
export const searchUsers = (keyword: string) =>
  api.get(`/api/v1/admin/users/search?q=${encodeURIComponent(keyword)}`);
