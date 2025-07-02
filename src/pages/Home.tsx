
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: "♡",
      title: "IUI - Thu tinh trong tử cung",
      description: "Phương pháp hỗ trợ sinh sản đơn giản, phù hợp với các trường hợp vô sinh nhẹ.",
      buttonText: "Đăng ký dịch vụ",
      color: "text-pink-500"
    },
    {
      icon: "⚕",
      title: "IVF - Thu tinh ống nghiệm cơ bản",
      description: "Công nghệ tiên tiến nhất hiện tại, phù hợp với nhiều trường hợp vô sinh.",
      buttonText: "Đăng ký dịch vụ",
      color: "text-blue-500"
    },
    {
      icon: "🔬",
      title: "Tư vấn chuyên sâu",
      description: "Dịch vụ tư vấn toàn diện về tình trạng sinh sản và kế hoạch điều trị.",
      buttonText: "Đăng ký dịch vụ",
      color: "text-green-500"
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

  const teamMembers = [
    {
      name: "PGS.TS. Nguyễn Văn Minh",
      position: "Giám đốc y khoa",
      experience: "25 năm kinh nghiệm",
      specialty: "Chuyên khoa Sản phụ khoa"
    },
    {
      name: "BS.CKI. Trần Thị Hương",
      position: "Trưởng khoa IVF",
      experience: "15 năm kinh nghiệm",
      specialty: "Hỗ trợ sinh sản"
    },
    {
      name: "BS.CKII. Lê Văn Thành",
      position: "Bác sĩ điều trị",
      experience: "12 năm kinh nghiệm",
      specialty: "Nội tiết sinh sản"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Chăm sóc sức khỏe sinh sản
            <br />
            <span className="text-primary">Với tình yêu thương</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Chúng tôi đồng hành cùng bạn trên hành trình mang thai hạnh phúc. Đến với chúng tôi để nhận được sự chăm sóc tận tận tâm từ đội ngũ chuyên gia hàng đầu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/booking')}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Tư vấn ngay
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dịch vụ điều trị hiếm muộn</h2>
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

      {/* About Us Section */}
      <section id="about-us" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Về chúng tôi</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              FertilityCare là trung tâm hỗ trợ sinh sản hàng đầu tại Việt Nam với hơn 15 năm kinh nghiệm trong lĩnh vực điều trị hiếm muộn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Sứ mệnh của chúng tôi</h3>
              <p className="text-muted-foreground mb-4">
                Chúng tôi tin rằng mỗi gia đình đều xứng đáng có được hạnh phúc làm cha mẹ. Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết mang đến những giải pháp điều trị hiệu quả nhất.
              </p>
              <p className="text-muted-foreground mb-4">
                Từ tư vấn ban đầu đến các phương pháp điều trị phức tạp như IVF, chúng tôi luôn đồng hành cùng bạn trong hành trình tìm kiếm con đường đến với hạnh phúc.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <p className="text-sm text-muted-foreground">Gia đình hạnh phúc</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <p className="text-sm text-muted-foreground">Tỷ lệ thành công</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <p className="text-sm text-muted-foreground">Chuyên gia</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">Đội ngũ chuyên gia</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-primary font-semibold">{member.position}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{member.experience}</p>
                    <p className="text-sm text-muted-foreground">{member.specialty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-lg text-muted-foreground">
              Hãy để chúng tôi hỗ trợ bạn trên hành trình tìm kiếm hạnh phúc
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-primary">📍</div>
                  <div>
                    <p className="font-semibold">Địa chỉ</p>
                    <p className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-primary">📞</div>
                  <div>
                    <p className="font-semibold">Số điện thoại</p>
                    <p className="text-muted-foreground">0123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-primary">✉️</div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@fertilitycare.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-primary">🕒</div>
                  <div>
                    <p className="font-semibold">Giờ làm việc</p>
                    <p className="text-muted-foreground">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                    <p className="text-muted-foreground">Thứ 7: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                <CardDescription>
                  Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Họ và tên</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tin nhắn</label>
                  <textarea 
                    rows={4}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Gửi tin nhắn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hãy để chúng tôi đồng hành với bạn trên hành trình đến với hạnh phúc làm cha mẹ.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/booking')}
            className="text-lg px-8 py-3"
          >
            Đăng ký tư vấn ngay
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
