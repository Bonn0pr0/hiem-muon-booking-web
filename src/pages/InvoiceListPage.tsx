import { useEffect, useState } from "react";
import { invoiceApi } from "@/api/invoiceApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) return;
    setLoading(true);
    invoiceApi.getByUser(user.id)
      .then(res => setInvoices(res.data.data || res.data)) // tuỳ backend trả về
      .catch(() => toast({ title: "Không thể lấy danh sách hóa đơn", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <div>Đang tải hóa đơn...</div>;

  const unpaidInvoices = invoices.filter((inv: any) => inv.status !== "PAID");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Hóa đơn chưa thanh toán</h1>
      {unpaidInvoices.length === 0 ? (
        <div className="text-green-600">Bạn không có hóa đơn nào chưa thanh toán.</div>
      ) : (
        <div className="space-y-4">
          {unpaidInvoices.map((inv: any) => (
            <div key={inv.invoiceId} className="border rounded-lg p-4 flex justify-between items-center bg-white shadow">
              <div>
                <div className="font-semibold text-lg">{inv.serviceName || "Dịch vụ"}</div>
                <div className="text-sm text-muted-foreground">
                  Ngày lập: {inv.issuedDate?.split("T")[0]}<br />
                  Số tiền: <span className="text-primary font-bold">{inv.totalAmount?.toLocaleString()}₫</span>
                </div>
              </div>
              <Button
                className="bg-primary text-white"
                onClick={() => navigate("/invoice", { state: { booking: { id: inv.bookingId } } })}
              >
                Thanh toán
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceListPage; 