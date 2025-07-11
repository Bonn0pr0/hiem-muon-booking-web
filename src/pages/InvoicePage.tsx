import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookingApi } from "@/api/bookingApi";
import { invoiceApi } from "@/api/invoiceApi";
import { paymentApi } from "@/api/paymentApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookingId = location.state?.booking?.id || location.state?.booking?.bookingId;
  const [booking, setBooking] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin booking để xác nhận
  useEffect(() => {
    if (!bookingId) {
      navigate("/invoices");
      return;
    }
    setLoading(true);
    bookingApi.getById(bookingId)
      .then(res => setBooking(res.data.data))
      .catch(() => {
        toast({ title: "Không tìm thấy thông tin đặt lịch", variant: "destructive" });
        navigate("/invoices");
      })
      .finally(() => setLoading(false));
  }, [bookingId, navigate, toast]);

  // Khi xác nhận, tạo invoice và payment
  const handleConfirm = async () => {
    if (!booking) return;
    setLoading(true);
    try {
      // Tạo invoice
      const invoiceRes = await invoiceApi.create(bookingId);
      const invoiceData = invoiceRes.data.data;
      setInvoice(invoiceData);
      toast({ title: "Tạo hóa đơn thành công!" });
      // Chuyển về lại danh sách hóa đơn
      navigate("/invoices");
    } catch {
      toast({ title: "Lỗi khi tạo hóa đơn", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!booking) return <div>Không tìm thấy thông tin đặt lịch</div>;

  // Nếu đã có invoice, có thể hiển thị thông tin hóa đơn/thanh toán ở đây nếu muốn

  // Nếu chưa có invoice, hiển thị thông tin booking để xác nhận
  return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Xác nhận thông tin đặt lịch</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Bác sĩ:</span>
              <span>{booking.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Dịch vụ:</span>
              <span>{booking.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ngày hẹn:</span>
              <span>{booking.appointmentTime?.split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Giờ hẹn:</span>
              <span>{booking.appointmentTime?.split('T')[1]?.slice(0,5)}</span>
            </div>
            {booking.price && (
              <div className="flex justify-between">
                <span className="font-medium">Giá dịch vụ:</span>
                <span className="text-primary font-bold">{booking.price.toLocaleString()}₫</span>
              </div>
            )}
            {booking.notes && (
              <div className="flex justify-between">
                <span className="font-medium">Ghi chú:</span>
                <span>{booking.notes}</span>
              </div>
            )}
          </div>
          <Button
            className="w-full mt-6 bg-primary hover:bg-primary/90"
            onClick={handleConfirm}
          >
            Xác nhận & Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;

