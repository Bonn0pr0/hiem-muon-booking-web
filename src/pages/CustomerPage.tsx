import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import PatientProfile from "@/components/PatientProfile";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingApi } from "@/api/bookingApi";
import { invoiceApi } from "@/api/invoiceApi";
import { useToast } from "@/hooks/use-toast";

const CustomerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user data - in real app this would come from auth context
  

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

  const myAppointments = [
    {
      id: 1,
      service: "Tư vấn ban đầu",
      doctor: "BS. Nguyễn Văn An",
      date: "25/06/2024",
      time: "09:00",
      status: "upcoming"
    },
    {
      id: 2,
      service: "Xét nghiệm hormone",
      doctor: "BS. Trần Thị Bình",
      date: "20/06/2024", 
      time: "14:00",
      status: "completed"
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Sắp tới</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      default:
        return <Badge>Chưa xác định</Badge>;
    }
  };

  // Function xử lý thanh toán thông minh
  const handlePayment = async (booking: any) => {
    try {
      // Kiểm tra xem đã có invoice chưa
      const invoiceRes = await invoiceApi.getByBookingId(booking.id);
      const invoice = invoiceRes.data;
      
      if (invoice) {
        // Nếu đã có invoice, chuyển đến danh sách hóa đơn
        toast({
          title: "Đã có hóa đơn cho booking này",
          description: "Chuyển đến trang danh sách hóa đơn để thanh toán",
          variant: "default"
        });
        navigate("/invoices");
      } else {
        // Nếu chưa có invoice, chuyển đến trang tạo hóa đơn
        navigate('/invoice', { state: { booking } });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Không tìm thấy invoice, chuyển đến trang tạo hóa đơn
        navigate('/invoice', { state: { booking } });
      } else {
        // Lỗi khác, hiển thị thông báo
        toast({
          title: "Lỗi khi kiểm tra hóa đơn",
          description: "Vui lòng thử lại sau",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    bookingApi.getByCustomerId(user.id)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
        setBookings(data);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div>Đang tải lịch hẹn...</div>;

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <NotificationBell />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chào mừng trở lại, <span className="text-primary">{user?.name || "Khách hàng"}</span>!
            </h1>
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
              onClick={() => setShowPatientProfile(true)}
              className="h-16"
            >
              📋<br />Hồ sơ
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/booking')}
              className="h-16"
            >
              📅<br />Xem lịch booking
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-16"
            >
              💬<br />Tư vấn trực tuyến
            </Button>
          </div>
        </div>
      </section>

      {/* My Appointments */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lịch hẹn của tôi</h2>
            <p className="text-muted-foreground">Theo dõi lịch trình điều trị của bạn</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {Array.isArray(bookings) && bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                          {getStatusBadge(booking.status)}
                          {/* Badge thanh toán */}
                          {booking.invoiceStatus === "PAID" ? (
                            <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Chưa thanh toán</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-1">👨‍⚕️ {booking.doctorName}</p>
                        <p className="text-muted-foreground">🕐 {booking.appointmentTime}</p>
                      </div>
                      <div className="flex flex-col space-y-2 items-end">
                        {/* Nếu chưa thanh toán thì hiện nút */}
                        {booking.invoiceStatus !== "PAID" && (
                          <Button
                            size="sm"
                            className="bg-primary text-white"
                            onClick={() => handlePayment(booking)}
                          >
                            Thanh toán ngay
                          </Button>
                        )}
                        {/* Các nút khác giữ nguyên */}
                        {booking.status === 'upcoming' && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Đổi lịch
                            </Button>
                            <Button variant="outline" size="sm">
                              Hủy lịch
                            </Button>
                          </div>
                        )}
                        {booking.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Xem kết quả
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

      {/* Patient Profile Modal */}
      <PatientProfile 
        patient={user}
        isOpen={showPatientProfile}
        onClose={() => setShowPatientProfile(false)}
        isReadOnly={true}
      />
    </div>
  );
};

export default CustomerPage;
