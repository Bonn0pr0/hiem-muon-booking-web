import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bookingApi } from "@/api/bookingService";

const Booking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    doctor: '',
    service: '',
    time: '',
    notes: ''
  });

  const doctors = [
    { id: 'dr1', name: 'BS. Trần Văn Nam', specialty: 'Chuyên khoa Sản Phụ khoa' },
    { id: 'dr2', name: 'BS. Nguyễn Thị Mai', specialty: 'Chuyên khoa Hiếm muộn' },
    { id: 'dr3', name: 'BS. Lê Minh Hoàng', specialty: 'Chuyên khoa IVF' },
    { id: 'dr4', name: 'BS. Phạm Thị Lan', specialty: 'Chuyên khoa Nội tiết' }
  ];

  const services = [
    'IUI - Thu tinh trong tử cung',
    'IVF - Thu tinh ống nghiệm cơ bản',
    'ICSI - Tiêm tinh trùng vào bào tương trứng',
    'PGT-A - Chẩn đoán di truyền tiền làm tổ',
    'Tư vần và khám sàng lọc',
    'Đông lạnh phôi/trứng'
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.name || !formData.phone || !formData.doctor || !formData.service || !formData.time) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const payload = {
      customer: formData.name,
      doctor: doctors.find(d => d.id === formData.doctor)?.name || "",
      service: formData.service,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: formData.time,
      notes: formData.notes
    };

    try {
      await bookingApi.book(payload);
      toast({
        title: "Đặt lịch thành công",
        description: `Đã đặt lịch khám ngày ${format(selectedDate, 'dd/MM/yyyy', { locale: vi })} lúc ${formData.time}`,
      });
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        doctor: '',
        service: '',
        time: '',
        notes: ''
      });
      setSelectedDate(undefined);
    } catch (error: any) {
      toast({
        title: "Lỗi đặt lịch",
        description: error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-secondary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Đặt lịch hẹn</h1>
            <p className="text-muted-foreground">
              Đặt lịch khám với các chuyên gia hàng đầu về hiếm muộn
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span>Thông tin đặt lịch</span>
              </CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin để đặt lịch hẹn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <span>👤</span>
                    <span>Thông tin cá nhân</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email (không bắt buộc)"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <span>📅</span>
                    <span>Thông tin lịch hẹn</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày hẹn *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày hẹn"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Giờ hẹn *</Label>
                      <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giờ hẹn" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Chọn bác sĩ *</Label>
                    <Select value={formData.doctor} onValueChange={(value) => handleChange('doctor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Dịch vụ *</Label>
                    <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <span>📝</span>
                    <span>Ghi chú</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú thêm</Label>
                    <Textarea
                      id="notes"
                      placeholder="Nhập ghi chú, triệu chứng hoặc yêu cầu đặc biệt..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                  Đặt lịch hẹn
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;