import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
  status: number;
}

class LoginService {
  private readonly LOGIN_ENDPOINT = '/api/v1/auth/login';

  /**
   * Đăng nhập người dùng
   * @param credentials - Thông tin đăng nhập
   * @returns Promise với thông tin đăng nhập thành công
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(this.LOGIN_ENDPOINT, credentials);
      
      // Lưu token vào localStorage
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error: any) {
      // Xử lý lỗi cụ thể
      if (error.response?.status === 401) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
      } else if (error.response?.status === 400) {
        throw new Error('Dữ liệu đăng nhập không hợp lệ');
      } else if (error.response?.status >= 500) {
        throw new Error('Lỗi server, vui lòng thử lại sau');
      } else {
        throw new Error('Lỗi kết nối, vui lòng kiểm tra mạng');
      }
    }
  }

  /**
   * Kiểm tra xem người dùng đã đăng nhập chưa
   * @returns boolean
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Lấy token hiện tại
   * @returns string | null
   */
  getCurrentToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Xóa thông tin đăng nhập
   */
  clearLoginData(): void {
    localStorage.removeItem('accessToken');
  }

  /**
   * Kiểm tra token có hợp lệ không (có thể mở rộng để validate JWT)
   * @returns boolean
   */
  isTokenValid(): boolean {
    const token = this.getCurrentToken();
    if (!token) return false;
    
    // Có thể thêm logic kiểm tra JWT token expiration
    // Hiện tại chỉ kiểm tra token có tồn tại không
    return true;
  }
}

// Export instance singleton
export const loginService = new LoginService();
export default loginService; 