import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QRDemo = () => {
  const { toast } = useToast();
  const [qrText, setQrText] = useState("https://example.com/payment");
  const [qrSize, setQrSize] = useState(200);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const handleCopyText = () => {
    navigator.clipboard.writeText(qrText);
    toast({
      title: "Đã sao chép",
      description: "Nội dung QR code đã được sao chép vào clipboard",
    });
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('#demo-qr svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'qr-demo.png';
        link.href = canvas.toDataURL();
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const generateRandomQR = () => {
    const randomData = {
      amount: Math.floor(Math.random() * 1000000) + 100000,
      description: "Thanh toán dịch vụ y tế",
      timestamp: new Date().toISOString(),
      invoiceId: Math.floor(Math.random() * 10000)
    };
    setQrText(JSON.stringify(randomData, null, 2));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Demo</CardTitle>
          <CardDescription>
            Demo tính năng tạo và quản lý QR code cho thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="qr-text">Nội dung QR Code</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="qr-text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="Nhập nội dung cho QR code..."
                />
                <Button variant="outline" onClick={generateRandomQR}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qr-size">Kích thước</Label>
                <Input
                  id="qr-size"
                  type="number"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  min="100"
                  max="500"
                  step="50"
                />
              </div>
              <div>
                <Label htmlFor="qr-level">Mức độ sửa lỗi</Label>
                <select
                  id="qr-level"
                  value={qrLevel}
                  onChange={(e) => setQrLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border inline-block">
              <div id="demo-qr">
                <QRCodeSVG
                  value={qrText}
                  size={qrSize}
                  level={qrLevel}
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleCopyText}>
                <Copy className="w-4 h-4 mr-2" />
                Copy nội dung
              </Button>
              <Button variant="outline" onClick={handleDownloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Tải QR Code
              </Button>
            </div>
          </div>

          {/* QR Code Information */}
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Thông tin QR Code</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Kích thước:</span>
                <span>{qrSize}px x {qrSize}px</span>
              </div>
              <div className="flex justify-between">
                <span>Mức độ sửa lỗi:</span>
                <span>{qrLevel} ({qrLevel === 'L' ? '7%' : qrLevel === 'M' ? '15%' : qrLevel === 'Q' ? '25%' : '30%'})</span>
              </div>
              <div className="flex justify-between">
                <span>Độ dài nội dung:</span>
                <span>{qrText.length} ký tự</span>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="space-y-3">
            <h3 className="font-semibold">Ví dụ sử dụng:</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-secondary/10 rounded">
                <strong>URL:</strong> https://example.com/payment/123
              </div>
              <div className="p-2 bg-secondary/10 rounded">
                <strong>JSON:</strong> {"{"}"amount": 500000, "description": "Thanh toán dịch vụ"{"}"}
              </div>
              <div className="p-2 bg-secondary/10 rounded">
                <strong>Text:</strong> Thanh toán 500,000 VND cho dịch vụ IVF
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRDemo; 