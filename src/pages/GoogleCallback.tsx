import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from '@/api/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const success = searchParams.get('success');
        const email = searchParams.get('email');
        
        if (success === 'true' && email) {
          const token = searchParams.get('token');
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          // Google OAuth was successful, now get user info from backend
          const response = await api.get('/api/v1/auth/account');
          const userData = response.data;
          if (userData && userData.id) {
            login(userData); // set vào context + localStorage
            // ... chuyển hướng dashboard
          } else {
            setError('Không lấy được thông tin user. Vui lòng thử lại.');
          }
          
          const role = userData.role || 'Customer';
          if (role === 'Admin') navigate('/dashboard/admin');
          else if (role === 'Manager') navigate('/dashboard/manager');
          else if (role === 'Staff') navigate('/dashboard/staff');
          else if (role === 'Doctor') navigate('/dashboard/doctor');
          else navigate('/dashboard/customer');
        } else {
          setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setError('Có lỗi xảy ra khi xử lý đăng nhập Google.');
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, login, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Đang xử lý đăng nhập...</CardTitle>
            <CardDescription>
              Vui lòng chờ trong giây lát
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-500" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Đăng nhập thất bại</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-pink-500 hover:bg-pink-600"
            >
              Quay lại trang đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default GoogleCallback; 