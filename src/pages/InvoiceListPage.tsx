import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invoiceApi } from "@/api/invoiceApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const InvoiceListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    invoiceApi.getByUser(user.id)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
        setInvoices(data);
      })
      .catch(error => {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        toast({
          title: "Lỗi khi tải danh sách hóa đơn",
          description: "Vui lòng thử lại sau",
          variant: "destructive"
        });
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id, toast]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePayment = (invoice: any) => {
    // Chuyển đến trang thanh toán với thông tin invoice
    navigate('/payment', { 
      state: { 
        invoice,
        booking: { id: invoice.bookingId }
      } 
    });
  };

  const handleCreateInvoice = () => {
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải danh sách hóa đơn...</p>
          </div>
        </div>
      </div>
    );
  }

  const unpaidInvoices = invoices.filter(inv => inv.status !== 'PAID');
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID');

  return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quản lý hóa đơn</h1>
          <p className="text-muted-foreground">
            Theo dõi và thanh toán các hóa đơn dịch vụ y tế
          </p>
        </div>

        {/* Hóa đơn chưa thanh toán */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Hóa đơn chưa thanh toán</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {unpaidInvoices.length} hóa đơn
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unpaidInvoices.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium">Bạn không có hóa đơn nào chưa thanh toán!</p>
                <p className="text-muted-foreground mt-2">Tất cả hóa đơn đã được thanh toán hoặc bạn chưa có hóa đơn nào.</p>
                <Button 
                  onClick={handleCreateInvoice}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  Đặt lịch dịch vụ mới
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {unpaidInvoices.map((invoice: any) => (
                  <div key={invoice.invoiceId} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            Hóa đơn #{invoice.invoiceId}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Ngày lập: {formatDate(invoice.issuedDate)}</p>
                          <p>Dịch vụ: {invoice.serviceName || "Dịch vụ y tế"}</p>
                          <p>Bác sĩ: {invoice.doctorName || "Chưa xác định"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {formatPrice(invoice.totalAmount)}
                        </div>
                        <Button
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handlePayment(invoice)}
                        >
                          Thanh toán ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hóa đơn đã thanh toán */}
        {paidInvoices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hóa đơn đã thanh toán</span>
                <Badge className="bg-green-100 text-green-800">
                  {paidInvoices.length} hóa đơn
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paidInvoices.map((invoice: any) => (
                  <div key={invoice.invoiceId} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            Hóa đơn #{invoice.invoiceId}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Ngày lập: {formatDate(invoice.issuedDate)}</p>
                          <p>Dịch vụ: {invoice.serviceName || "Dịch vụ y tế"}</p>
                          <p>Bác sĩ: {invoice.doctorName || "Chưa xác định"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {formatPrice(invoice.totalAmount)}
                        </div>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleCreateInvoice}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            Đặt lịch dịch vụ mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListPage; 