import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  console.log("Header user:", user);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({
      title: "Tạm biệt!",
      description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Hẹn gặp lại!",
    });
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lấy role, mặc định là "customer" nếu chưa đăng nhập
  const role = user?.role?.toLowerCase?.() || "customer";

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-white-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-pink-500 text-3xl">❤️</span>
              </div>
              <span className="text-xl font-bold text-foreground">FertilityCare</span>
            </button>
          </div>

          {/* Hiện taskbar nếu chưa đăng nhập hoặc là customer */}
          {(!user || role === "customer") && (
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Trang chủ
              </button>
              <button
                onClick={() => navigate('/booking')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/booking') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Booking
              </button>
              <button
                onClick={() => navigate('/services')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/services') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dịch vụ
              </button>
              <button
                onClick={() => scrollToSection('about-us')}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Về chúng tôi
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Liên hệ
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Chỉ hiện tên, không cho click nếu không phải customer */}
                {role === "customer" ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/update-profile')}
                    className="text-sm flex items-center space-x-2"
                  >
                    <span className="font-semibold">{user.name}</span>
                  </Button>
                ) : (
                  <span className="font-semibold text-base px-3">{user.name}</span>
                )}
                <Button variant="outline" onClick={handleLogout} size="sm">
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} size="sm">
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate('/register')} size="sm" className="bg-primary hover:bg-primary/90">
                  Đăng ký ngay
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
