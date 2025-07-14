import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/api/authService";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    otp: searchParams.get('otp') || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được đặt lại thành công",
      });
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive"
      });
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
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 mb-6 mx-auto hover:opacity-80 transition-opacity"
          >
            <span className="text-pink-500 text-3xl">❤️</span>
            <span className="text-2xl font-bold text-gray-900">FertilityCare</span>
          </button>
        </div>
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
            <CardDescription className="text-center">
              Nhập mật khẩu mới cho tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="focus:ring-pink-500 focus:border-pink-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full text-white bg-pink-500 hover:bg-pink-600"
                disabled={loading}
              >
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 