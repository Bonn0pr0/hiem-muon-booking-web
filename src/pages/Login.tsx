import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { loginService } from '@/api/loginService';
import { useAuth } from '@/contexts/AuthContext';

type LoginResponse = {
  accessToken: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginService.login(formData);
      const { accessToken, user } = response;
      console.log('User object sau login:', user);
      console.log('Role của user:', user?.role);
      localStorage.setItem('accessToken', accessToken);
      if (user) {
        login(user);
        await new Promise(res => setTimeout(res, 100));
      }
      let role: string = user?.role || 'user';
      console.log('Role của user:', role);
      if (role === 'Admin') navigate('/dashboard/admin');
      else if (role === 'Manager') navigate('/dashboard/manager');
      else if (role === 'Staff') navigate('/dashboard/staff');
      else if (role === 'Doctor') navigate('/dashboard/doctor');
      else navigate('/dashboard/customer');
    } catch (error: any) {
      console.error('Lỗi login:', error);
      setError(error.message || 'Tài khoản hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-pink-500 text-3xl">❤️</span>
            <span className="text-2xl font-bold text-gray-900">FertilityCare</span>
          </Link>
        </div>
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập tài khoản và mật khẩu để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tài khoản</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tài khoản"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="focus:ring-pink-500 focus:border-pink-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-pink-600 hover:text-pink-500">
                  Quên mật khẩu?
                </Link>
              </div>
              <Button 
                type="submit" 
                className="w-full text-white bg-pink-500 hover:bg-pink-600"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
