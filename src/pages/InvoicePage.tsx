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
  const [checkingInvoice, setCheckingInvoice] = useState(false);

  // Lấy thông tin booking và kiểm tra invoice
  useEffect(() => {
    if (!bookingId) {
      navigate("/invoices");
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin booking
        const bookingRes = await bookingApi.getById(bookingId);
        const bookingData = bookingRes.data.data;
        setBooking(bookingData);

        // Kiểm tra xem đã có invoice chưa
        try {
          const invoiceRes = await invoiceApi.getByBookingId(bookingId);
          const invoiceData = invoiceRes.data;
          setInvoice(invoiceData);
          
          // Nếu đã có invoice, hiển thị thông báo và chuyển hướng
          if (invoiceData) {
            toast({ 
              title: "Đã có hóa đơn cho booking này", 
              description: "Chuyển đến trang danh sách hóa đơn để thanh toán",
              variant: "default"
            });
            // Chuyển đến trang danh sách hóa đơn sau 2 giây
            setTimeout(() => {
              navigate("/invoices");
            }, 2000);
          }
        } catch (error: any) {
          // Nếu không tìm thấy invoice (404), tiếp tục bình thường
          if (error.response?.status !== 404) {
            console.error("Lỗi khi kiểm tra invoice:", error);
          }
        }
      } catch (error: any) {
        toast({ 
          title: "Không tìm thấy thông tin đặt lịch", 
          variant: "destructive" 
        });
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, navigate, toast]);

  // Khi xác nhận, tạo invoice và chuyển hướng
  const handleConfirm = async () => {
    if (!booking) return;
    setCheckingInvoice(true);
    try {
      // Tạo invoice
      const invoiceRes = await invoiceApi.create(bookingId);
      const invoiceData = invoiceRes.data.data;
      setInvoice(invoiceData);
      toast({ 
        title: "Tạo hóa đơn thành công!", 
        description: "Chuyển đến trang danh sách hóa đơn để thanh toán"
      });
      // Chuyển về lại danh sách hóa đơn
      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    } catch (error: any) {
      toast({ 
        title: "Lỗi khi tạo hóa đơn", 
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive" 
      });
    } finally {
      setCheckingInvoice(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-red-600">Không tìm thấy thông tin đặt lịch</p>
          <Button 
            onClick={() => navigate("/invoices")} 
            className="mt-4"
            variant="outline"
          >
            Quay lại danh sách hóa đơn
          </Button>
        </div>
      </div>
    </div>
  );

  // Nếu đã có invoice, hiển thị thông báo
  if (invoice) {
    return (
      <div className="min-h-screen bg-secondary/10 py-8">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold">Đã có hóa đơn cho booking này</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Booking này đã có hóa đơn. Vui lòng kiểm tra trong danh sách hóa đơn để thanh toán.
            </p>
            <Button 
              onClick={() => navigate("/invoices")} 
              className="bg-primary hover:bg-primary/90"
            >
              Xem danh sách hóa đơn
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            disabled={checkingInvoice}
          >
            {checkingInvoice ? "Đang tạo hóa đơn..." : "Xác nhận & Tạo hóa đơn"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;

