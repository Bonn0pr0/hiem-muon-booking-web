import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QRCodePayment from "@/components/QRCodePayment";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const invoice = location.state?.invoice;
  const booking = location.state?.booking;

  // Thêm dòng này để log ra console
  console.log("Invoice truyền sang Payment:", invoice);

  // Lấy thông tin dịch vụ và giá từ invoice hoặc booking
  const serviceName = invoice?.serviceName || booking?.serviceName || booking?.service || "Dịch vụ y tế";
  const amount = invoice?.totalAmount || booking?.price || 0;
  const status = invoice?.status || "PENDING";

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  // Sau khi đã fetch invoice từ backend:
  const bookingId = invoice?.booking?.bookingId;

  // Bạn có thể dùng bookingId cho các mục đích khác, ví dụ:
  console.log("Booking ID lấy từ invoice:", bookingId);

  useEffect(() => {
    if (!invoice) {
      toast({
        title: "Không tìm thấy hóa đơn",
        description: "Vui lòng chọn hóa đơn từ danh sách để thanh toán.",
        variant: "destructive"
      });
      navigate("/invoices");
    }
  }, [invoice, navigate, toast]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa xác định</Badge>;
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast({
        title: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive"
      });
      return;
    }
    if (paymentMethod === 'QR Code') {
      setShowQRCode(true);
    } else {
      toast({
        title: "Thanh toán thành công!",
        description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
      });
    }
  };

  const isPaid = status?.toUpperCase() === 'PAID';

  return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Thanh toán dịch vụ</h1>
          <p className="text-muted-foreground">Thanh toán cho các dịch vụ y tế</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hóa đơn</CardTitle>
            <CardDescription>Kiểm tra thông tin trước khi thanh toán</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Dịch vụ:</span>
                <span>{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số tiền:</span>
                <span className="font-bold text-primary">{formatPrice(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Mã hóa đơn:</span>
                <span className="font-mono">#{invoice?.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Trạng thái:</span>
                {getStatusBadge(status)}
              </div>
            </div>
            {!isPaid && (
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <span className="font-medium">Chọn phương thức thanh toán</span>
                  <div className="space-y-2 mt-2">
                    {[
                      { id: 'qr', name: 'QR Code', desc: 'Quét mã QR để thanh toán' },
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {paymentMethod === 'QR Code' ? 'Tạo QR Code' : 'Thanh toán ngay'}
                </Button>
              </form>
            )}
            {showQRCode && paymentMethod === 'QR Code' && (
              <div className="mt-8">
                <QRCodePayment
                  invoiceId={invoice.invoiceId}
                  amount={amount}
                  serviceName={serviceName}
                  onPaymentComplete={() => setShowQRCode(false)}
                />
              </div>
            )}
            {isPaid && (
              <div className="text-center text-green-600 font-semibold mt-6">
                Hóa đơn này đã được thanh toán.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;