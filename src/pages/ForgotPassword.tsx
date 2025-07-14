import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/api/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      toast({
        title: "Thành công",
        description: "Email đặt lại mật khẩu đã được gửi đến hộp thư của bạn",
      });
      // Redirect to login page after successful request
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu</CardTitle>
            <CardDescription className="text-center">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-white bg-pink-500 hover:bg-pink-600"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
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

export default ForgotPassword; 