
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  // Mock user data
  const user = {
    name: "Nguyễn Thị Mai",
    membershipLevel: "VIP",
    email: "mai.nguyen@email.com",
    phone: "0901234567",
    memberSince: "2024-01-15"
  };

  const services = [
    {
      icon: "♡",
      title: "IUI - Thu tinh trong tử cung",
      description: "Phương pháp hỗ trợ sinh sản đơn giản, phù hợp với các trường hợp vô sinh nhẹ.",
      buttonText: "Đăng ký dịch vụ",
      color: "text-pink-500",
      available: true
    },
    {
      icon: "⚕",
      title: "IVF - Thu tinh ống nghiệm",
      description: "Công nghệ tiên tiến nhất hiện tại, phù hợp với nhiều trường hợp vô sinh.",
      buttonText: "Đăng ký dịch vụ", 
      color: "text-blue-500",
      available: true
    },
    {
      icon: "🔬",
      title: "Tư vấn chuyên sâu",
      description: "Dịch vụ tư vấn toàn diện về tình trạng sinh sản và kế hoạch điều trị.",
      buttonText: "Đăng ký dịch vụ",
      color: "text-green-500",
      available: true
    }
  ];

  const whyChooseUs = [
    {
      icon: "👨‍⚕️",
      title: "Đội ngũ chuyên gia",
      description: "Bác sĩ và chuyên gia hàng đầu về sinh sản tại Việt Nam với nhiều năm kinh nghiệm."
    },
    {
      icon: "🏥",
      title: "Công nghệ hiện đại",
      description: "Trang thiết bị y tế hiện đại nhất, đảm bảo chất lượng điều trị tốt nhất."
    },
    {
      icon: "💰",
      title: "Tỷ lệ thành công cao",
      description: "Tỷ lệ thành công cao trong các phương pháp điều trị hiếm muộn."
    },
    {
      icon: "♡",
      title: "Chăm sóc tận tình",
      description: "Chăm sóc tận tình và hỗ trợ tâm lý trong suốt quá trình điều trị."
    }
  ];

  const appointments = [
    {
      id: 1,
      date: "2024-06-20",
      time: "09:00",
      doctor: "BS. Trần Văn Nam",
      service: "IVF - Thu tinh ống nghiệm",
      status: "confirmed",
      statusText: "Đã xác nhận"
    },
    {
      id: 2,
      date: "2024-06-15",
      time: "14:30",
      doctor: "BS. Nguyễn Thị Mai",
      service: "Tư vấn và khám sàng lọc",
      status: "completed",
      statusText: "Hoàn thành"
    }
  ];

  const testResults = [
    {
      id: 1,
      date: "2024-06-10",
      type: "Xét nghiệm hormone",
      result: "Bình thường",
      doctor: "BS. Nguyễn Thị Mai"
    },
    {
      id: 2,
      date: "2024-05-25",
      type: "Siêu âm buồng trứng",
      result: "Tốt",
      doctor: "BS. Trần Văn Nam"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section với Avatar */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <NotificationBell />
            </div>
            
            <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
              <DialogTrigger asChild>
                <div className="cursor-pointer inline-block">
                  <Avatar className="h-20 w-20 mx-auto mb-4 hover:ring-4 hover:ring-primary/20 transition-all">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Dashboard Khách hàng</DialogTitle>
                  <DialogDescription>
                    Quản lý thông tin cá nhân và lịch hẹn của bạn
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid lg:grid-cols-3 gap-6 mt-6">
                  {/* Profile Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Họ và tên</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Khách hàng từ</p>
                        <p className="font-medium">15/01/2024</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setShowDashboard(false);
                          navigate('/update-profile');
                        }}
                      >
                        Cập nhật thông tin
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thao tác nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setShowDashboard(false);
                          navigate('/booking');
                        }}
                      >
                        Đặt lịch hẹn mới
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setShowDashboard(false);
                          navigate('/treatment-history');
                        }}
                      >
                        Lịch sử điều trị
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setShowDashboard(false);
                          navigate('/online-consultation');
                        }}
                      >
                        Tư vấn trực tuyến
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setShowDashboard(false);
                          navigate('/payment');
                        }}
                      >
                        Thanh toán dịch vụ
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thống kê</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tổng lịch hẹn</span>
                        <span className="text-2xl font-bold text-primary">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lịch sắp tới</span>
                        <span className="text-2xl font-bold text-blue-500">1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Kết quả xét nghiệm</span>
                        <span className="text-2xl font-bold text-green-500">5</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Appointments */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Lịch hẹn của tôi</CardTitle>
                    <CardDescription>Danh sách các lịch hẹn gần đây và sắp tới</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{appointment.service}</span>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.statusText}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctor} • {appointment.date} • {appointment.time}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {appointment.status === 'confirmed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  Đổi lịch
                                </Button>
                                <Button variant="outline" size="sm">
                                  Hủy
                                </Button>
                              </>
                            )}
                            {appointment.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                Xem kết quả
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Test Results */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Kết quả xét nghiệm gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testResults.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{result.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {result.doctor} • {result.date}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-green-100 text-green-800">
                              {result.result}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chào mừng trở lại, <span className="text-primary">{user.name}</span>!
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                Thành viên {user.membershipLevel}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Chúng tôi rất vui được đồng hành cùng bạn trên hành trình mang thai hạnh phúc.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button 
              size="lg"
              onClick={() => navigate('/booking')}
              className="bg-primary hover:bg-primary/90 h-16"
            >
              📅<br />Đặt lịch mới
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/treatment-history')}
              className="h-16"
            >
              📋<br />Lịch sử điều trị
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/online-consultation')}
              className="h-16"
            >
              💬<br />Tư vấn trực tuyến
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/payment')}
              className="h-16"
            >
              💳<br />Thanh toán
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dịch vụ điều trị hiếm muộn</h2>
            <p className="text-muted-foreground">Với tư cách thành viên, bạn có thể đăng ký trực tiếp các dịch vụ</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`text-4xl mb-4 ${service.color}`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/booking')}
                    disabled={!service.available}
                  >
                    {service.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiếp tục hành trình của bạn
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hãy để chúng tôi tiếp tục đồng hành với bạn trên hành trình đến với hạnh phúc làm cha mẹ.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/booking')}
            className="text-lg px-8 py-3"
          >
            Đặt lịch tư vấn ngay
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
