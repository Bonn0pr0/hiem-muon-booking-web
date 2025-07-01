import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { treatmentServiceApi } from "@/api/treatmentService";

const Services = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceCategories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'basic', label: 'Cơ bản' },
    { id: 'advanced', label: 'Nâng cao' },
    { id: 'premium', label: 'Cao cấp' },
    { id: 'support', label: 'Hỗ trợ' }
  ];

  useEffect(() => {
    setLoading(true);
    treatmentServiceApi.getAll()
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Không thể tải danh sách dịch vụ");
        setLoading(false);
      });
  }, []);

  // Mapping category nếu backend trả về tiếng Anh
  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'support': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Dịch vụ & Bảng giá</h1>
          <p className="text-muted-foreground text-lg">
            Tổng quan về các dịch vụ hỗ trợ sinh sản tại FertilityCare
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {serviceCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              className={activeFilter === category.id ? "bg-primary hover:bg-primary/90" : ""}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {filteredServices.map((service) => (
            <Card key={service.id || service.service_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getBadgeColor(service.category)}>
                    {service.badge || service.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{service.title || service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>⏱️</span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>{service.successRate}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Quy trình bao gồm:</h4>
                  <ul className="space-y-1">
                    {(service.features || []).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {service.priceRange}
                    </p>
                    {service.currency && (
                      <p className="text-sm text-muted-foreground">{service.currency}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => navigate('/booking')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Đăng ký tư vấn
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có dịch vụ nào trong danh mục này.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">
                Cần tư vấn thêm về dịch vụ?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Đội ngũ chuyên gia của chúng tôi sẽ tư vấn miễn phí để giúp bạn chọn được phương pháp điều trị phù hợp nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/booking')}
                className="text-lg px-8 py-3"
              >
                Đặt lịch tư vấn miễn phí
              </Button>
              <div className="mt-4">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Gọi ngay: 1900-1234
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
