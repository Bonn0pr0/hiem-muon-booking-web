import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentApi, PaymentQRResponse } from "@/api/paymentApi";

interface QRCodePaymentProps {
  invoiceId: number;
  amount: number;
  serviceName: string;
  onPaymentComplete?: () => void;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({
  invoiceId,
  amount,
  serviceName,
  onPaymentComplete
}) => {
  const { toast } = useToast();
  const [qrData, setQrData] = useState<PaymentQRResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'error'>('pending');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await paymentApi.getPaymentQR(invoiceId, comment);
      setQrData(response.data);
      setPaymentStatus('pending');
      toast({
        title: "QR Code đã được tạo",
        description: "Vui lòng quét mã QR để hoàn tất thanh toán.",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      setPaymentStatus('error');
      toast({
        title: "Lỗi tạo QR Code",
        description: "Không thể tạo QR code. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAccountNumber = () => {
    if (qrData?.accountNumber) {
      navigator.clipboard.writeText(qrData.accountNumber);
      toast({
        title: "Đã sao chép",
        description: "Số tài khoản đã được sao chép vào clipboard",
      });
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `qr-payment-${invoiceId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      await paymentApi.create({ invoiceId, amount });
      setPaymentStatus('completed');
      toast({
        title: "Thanh toán thành công!",
        description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
      });
      onPaymentComplete?.();
    } catch (error) {
      console.error('Error completing payment:', error);
      toast({
        title: "Lỗi thanh toán",
        description: "Không thể hoàn tất thanh toán. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Hoàn thành
        </Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Lỗi
        </Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [invoiceId]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Thanh toán QR Code
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Quét mã QR để thanh toán dịch vụ {serviceName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thông tin thanh toán */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Số tiền:</span>
            <span className="font-bold text-primary">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Mã hóa đơn:</span>
            <span className="font-mono">#{invoiceId}</span>
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <Label htmlFor="comment">Ghi chú (tùy chọn)</Label>
          <Input
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập ghi chú cho giao dịch..."
            className="mt-1"
          />
        </div>

        {/* QR Code */}
        {qrData && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <div id="qr-code" className="flex justify-center mb-4">
                {qrData.qrCodeBase64 ? (
                  <img 
                    src={`data:image/png;base64,${qrData.qrCodeBase64}`}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                ) : (
                  <QRCodeSVG 
                    value={qrData.qrContent}
                    size={192}
                    level="M"
                    includeMargin={true}
                  />
                )}
              </div>
              
              {/* Thông tin ngân hàng */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Ngân hàng:</span>
                  <span>{qrData.bankInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{qrData.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAccountNumber}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải QR Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQRCode}
                disabled={loading}
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Tạo lại
              </Button>
            </div>
          </div>
        )}

        {/* Nút hoàn tất thanh toán */}
        {paymentStatus === 'pending' && (
          <Button 
            onClick={handlePaymentComplete}
            className="w-full"
            disabled={loading}
          >
            Hoàn tất thanh toán
          </Button>
        )}

        {/* Thông báo lỗi */}
        {paymentStatus === 'error' && (
          <div className="text-center text-red-600 text-sm">
            Có lỗi xảy ra khi tạo QR code. Vui lòng thử lại.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodePayment; 