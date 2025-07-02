import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const doctorInfo = {
    name: "BS. Trần Văn Nam",
    specialty: "Chuyên khoa Sản phụ khoa",
    department: "Khoa Hỗ trợ sinh sản",
  };

  const patients = [
    {
      id: 1,
      name: "Nguyễn Thị Lan",
      age: 32,
      phone: "0901234567",
      diagnosis: "Vô sinh thứ phát",
      treatment: "IVF",
      status: "Đang điều trị",
      nextAppointment: "2024-06-25 09:00",
      notes: "Đã thực hiện kích thích buồng trứng"
    },
    {
      id: 2,
      name: "Trần Thị Mai",
      age: 28,
      phone: "0907654321",
      diagnosis: "Vô sinh nguyên phát",
      treatment: "IUI",
      status: "Theo dõi",
      nextAppointment: "2024-06-22 14:00",
      notes: "Cần theo dõi hormone"
    },
    {
      id: 3,
      name: "Lê Thị Hoa",
      age: 35,
      phone: "0912345678",
      diagnosis: "Rối loạn nội tiết",
      treatment: "Điều trị nội khoa",
      status: "Ổn định",
      nextAppointment: "2024-06-30 10:30",
      notes: "Phản ứng tốt với thuốc điều trị"
    }
  ];

  // Lọc bệnh nhân theo tên
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaySchedule = [
    {
      time: "08:00",
      patient: "Nguyễn Thị Lan",
      type: "Khám định kỳ",
      room: "Phòng 101"
    },
    {
      time: "09:30",
      patient: "Phạm Thị Thu",
      type: "Tư vấn điều trị",
      room: "Phòng 101"
    },
    {
      time: "10:30",
      patient: "Vũ Thị Nga",
      type: "Xét nghiệm",
      room: "Phòng 102"
    },
    {
      time: "14:00",
      patient: "Trần Thị Mai",
      type: "Theo dõi điều trị",
      room: "Phòng 101"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang điều trị':
        return 'bg-blue-100 text-blue-800';
      case 'Theo dõi':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ổn định':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateTreatment = (patientId: number, updates: any) => {
    console.log('Cập nhật điều trị cho bệnh nhân:', patientId, updates);
    // Ở đây sẽ gọi API để cập nhật thông tin
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Bác sĩ</h1>
          <p className="text-muted-foreground">
            Chào mừng {doctorInfo.name} - {doctorInfo.specialty}
          </p>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Danh sách bệnh nhân</TabsTrigger>
            <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bệnh nhân được phân công</CardTitle>
                <CardDescription>
                  Danh sách bệnh nhân đang theo dõi và điều trị
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Input */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm bệnh nhân theo tên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm 
                        ? `Không tìm thấy bệnh nhân nào với tên "${searchTerm}"`
                        : "Không có bệnh nhân nào"
                      }
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div key={patient.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {patient.age} tuổi • {patient.phone}
                            </p>
                          </div>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Chẩn đoán:</p>
                            <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phương pháp điều trị:</p>
                            <p className="text-sm text-muted-foreground">{patient.treatment}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Lịch hẹn tiếp theo:</p>
                            <p className="text-sm text-muted-foreground">{patient.nextAppointment}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Ghi chú:</p>
                            <p className="text-sm text-muted-foreground">{patient.notes}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Ghi chú khám
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Ghi chú khám bệnh - {patient.name}</DialogTitle>
                                <DialogDescription>
                                  Cập nhật kết quả khám và xét nghiệm
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="examination">Kết quả khám</Label>
                                  <Textarea 
                                    id="examination"
                                    placeholder="Nhập kết quả khám bệnh..."
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="test-results">Kết quả xét nghiệm</Label>
                                  <Textarea 
                                    id="test-results"
                                    placeholder="Nhập kết quả các xét nghiệm..."
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="prescription">Đơn thuốc</Label>
                                  <Textarea 
                                    id="prescription"
                                    placeholder="Kê đơn thuốc..."
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="next-steps">Hướng điều trị tiếp theo</Label>
                                  <Textarea 
                                    id="next-steps"
                                    placeholder="Lên kế hoạch điều trị tiếp theo..."
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">Hủy</Button>
                                  <Button>Lưu ghi chú</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Cập nhật tiến trình
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cập nhật tiến trình điều trị</DialogTitle>
                                <DialogDescription>
                                  Cập nhật trạng thái và tiến trình điều trị của bệnh nhân
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="status">Trạng thái điều trị</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="treatment">Đang điều trị</SelectItem>
                                      <SelectItem value="monitoring">Theo dõi</SelectItem>
                                      <SelectItem value="stable">Ổn định</SelectItem>
                                      <SelectItem value="completed">Hoàn thành</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="progress">Tiến trình điều trị</Label>
                                  <Textarea 
                                    id="progress"
                                    placeholder="Mô tả tiến trình điều trị hiện tại..."
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="next-appointment">Lịch hẹn tiếp theo</Label>
                                  <Input 
                                    id="next-appointment"
                                    type="datetime-local"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">Hủy</Button>
                                  <Button onClick={() => handleUpdateTreatment(patient.id, {})}>
                                    Cập nhật
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm">
                            Xem hồ sơ
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch làm việc hôm nay</CardTitle>
                <CardDescription>
                  Lịch trình khám bệnh và tư vấn trong ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-bold text-lg">{appointment.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">{appointment.room}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Xem hồ sơ
                        </Button>
                        <Button size="sm">
                          Bắt đầu khám
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng bệnh nhân</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">15</div>
                  <p className="text-xs text-muted-foreground">Đang theo dõi</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Lịch hẹn tuần này</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">28</div>
                  <p className="text-xs text-muted-foreground">Đã xác nhận</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Điều trị thành công</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">85%</div>
                  <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">4</div>
                  <p className="text-xs text-muted-foreground">Lịch hẹn</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Báo cáo tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tổng số ca điều trị</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ca thành công</span>
                    <span className="font-bold text-green-600">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đang theo dõi</span>
                    <span className="font-bold text-blue-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tỷ lệ thành công</span>
                    <span className="font-bold text-primary">84.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
