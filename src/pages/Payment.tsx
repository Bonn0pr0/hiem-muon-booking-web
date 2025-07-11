
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedService, setSelectedService] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const services = [
    { id: 1, name: "IVF - Thu tinh ống nghiệm", price: 50000000, category: "Cao cấp" },
    { id: 2, name: "IUI - Thu tinh trong tử cung", price: 15000000, category: "Nâng cao" },
    { id: 3, name: "Tư vấn và khám sàng lọc", price: 500000, category: "Cơ bản" },
    { id: 4, name: "Xét nghiệm hormone", price: 800000, category: "Cơ bản" },
    { id: 5, name: "Siêu âm chuyên sâu", price: 1200000, category: "Nâng cao" }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: "2024-06-15",
      service: "IVF - Thu tinh ống nghiệm",
      amount: 50000000,
      status: "completed",
      method: "Thẻ tín dụng"
    },
    {
      id: 2,
      date: "2024-05-28",
      service: "Tư vấn và khám sàng lọc",
      amount: 500000,
      status: "completed", 
      method: "Chuyển khoản"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !paymentMethod) {
      toast({
        title: "Vui lòng chọn đầy đủ thông tin",
        description: "Hãy chọn dịch vụ và phương thức thanh toán.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thanh toán thành công!",
      description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'completed' ? (
      <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
    );
  };

  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Thanh toán dịch vụ</h1>
          <p className="text-muted-foreground">
            Thanh toán cho các dịch vụ y tế
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form thanh toán */}
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán mới</CardTitle>
              <CardDescription>Chọn dịch vụ và phương thức thanh toán</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label>Chọn dịch vụ</Label>
                  <div className="space-y-3 mt-2">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`service-${service.id}`}
                          name="service"
                          value={service.name}
                          checked={selectedService === service.name}
                          onChange={(e) => setSelectedService(e.target.value)}
                        />
                        <label 
                          htmlFor={`service-${service.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-secondary/50">
                            <div>
                              <span className="font-medium">{service.name}</span>
                              <p className="text-sm text-muted-foreground">{service.category}</p>
                            </div>
                            <span className="font-bold text-primary">
                              {formatPrice(service.price)}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Phương thức thanh toán</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { id: 'credit', name: 'Thẻ tín dụng', desc: 'Visa, Mastercard' },
                      { id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản trực tiếp' },
                      { id: 'cash', name: 'Tiền mặt', desc: 'Thanh toán tại cơ sở' }
                    ].map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={method.id}
                          name="paymentMethod"
                          value={method.name}
                          checked={paymentMethod === method.name}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-lg hover:bg-secondary/50">
                            <span className="font-medium">{method.name}</span>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'Thẻ tín dụng' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-secondary/20">
                    <div>
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Thanh toán ngay
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lịch sử thanh toán */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
              <CardDescription>Các giao dịch đã thực hiện</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{payment.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.date} • {payment.method}
                        </p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(payment.amount)}
                      </span>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
