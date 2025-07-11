import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; // Xóa nếu không dùng
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
import { treatmentServiceApi } from "@/api/treatmentService";
import { doctorServiceApi } from "@/api/doctorService";
import { bookingApi } from "@/api/bookingApi";
import { useNavigate } from "react-router-dom";

// Khai báo các khung giờ hẹn
const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30"
];

const Booking = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    doctor: '',
    service: '',
    time: '',
    notes: ''
  });

  // State cho danh sách bác sĩ và dịch vụ
  const [doctors, setDoctors] = useState<{ id: string, name: string, specialty?: string }[]>([]);
  const [services, setServices] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorRes = await doctorServiceApi.getAll();
        // Thử log cả doctorRes để kiểm tra cấu trúc thực tế
        console.log("doctorRes", doctorRes);
        // Nếu không có data hoặc data không phải mảng, trả về mảng rỗng
        const doctorArr =
          Array.isArray(doctorRes?.data?.data)
            ? doctorRes.data.data
            : Array.isArray(doctorRes?.data)
              ? doctorRes.data
              : [];
        setDoctors(
          doctorArr.map((d: any, idx: number) =>
            typeof d === "string"
              ? { id: idx.toString(), name: d, specialty: undefined }
              : {
                  id: d.id?.toString() ?? idx.toString(),
                  name: d.name ?? d.fullName ?? "",
                  specialty: d.specialty ?? undefined
                }
          )
        );
        const serviceRes = await treatmentServiceApi.getAll();
        console.log("serviceRes", serviceRes.data);
        setServices(
          // Nếu serviceRes.data.data là mảng object dịch vụ, dùng trực tiếp:
          Array.isArray(serviceRes.data?.data)
            ? serviceRes.data.data.map((s: any, idx: number) => ({
                id: s.id?.toString() ?? idx.toString(),
                name: s.name ?? s.title ?? ""
              }))
            // Nếu là mảng string (tên), fallback:
            : Array.isArray(serviceRes.data)
              ? serviceRes.data.map((name: string, idx: number) => ({
                  id: idx.toString(),
                  name
                }))
              : []
        );
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể tải danh sách bác sĩ hoặc dịch vụ.",
          variant: "destructive"
        });
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.doctor || !formData.service || !formData.time) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const payload = {
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
      // Chuyển sang trang hóa đơn, truyền thông tin booking
      navigate("/invoice", { state: { booking: payload } });
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

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

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
                  </h3>
                </div>

                {/* Appointment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <span>📅</span>
                    <span>Thông tin lịch hẹn</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày hẹn *</Label>
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
                            // Sửa so sánh ngày: loại bỏ giờ phút giây
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              date.setHours(0,0,0,0);
                              return date < today;
                            }}
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
                        {doctors.length === 0 ? (
                          <div className="px-4 py-2 text-muted-foreground">Không có bác sĩ</div>
                        ) : (
                          doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                              {doctor.specialty ? ` - ${doctor.specialty}` : ""}
                            </SelectItem>
                          ))
                        )}
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
                        {services.length === 0 ? (
                          <div className="px-4 py-2 text-muted-foreground">Không có dịch vụ</div>
                        ) : (
                          services.map((service) => (
                            <SelectItem key={service.id} value={service.name}>
                              {service.name}
                            </SelectItem>
                          ))
                        )}
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