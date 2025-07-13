import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, FileIcon, TrendingUpIcon } from "lucide-react";
import StaffManagement from "@/components/StaffManagement";
import CustomerManagement from "@/components/CustomerManagement";
import ScheduleManagement from "@/components/ScheduleManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      date: "2024-06-10",
      stars: 5,
      comment: "Dịch vụ rất tốt!",
      status: "visible"
    },
    {
      id: 2,
      name: "Trần Thị B",
      date: "2024-06-12",
      stars: 4,
      comment: "Bác sĩ tận tình, sẽ quay lại.",
      status: "hidden"
    }
  ]);

  const stats = [
    {
      title: "Tổng số bác sĩ",
      value: "12",
      icon: <UserIcon className="w-6 h-6" />,
      color: "text-blue-500"
    },
    {
      title: "Tổng số khách hàng",
      value: "156",
      icon: <UserIcon className="w-6 h-6" />,
      color: "text-green-500"
    },
    {
      title: "Khách hàng mới tháng này",
      value: "23",
      icon: <CalendarIcon className="w-6 h-6" />,
      color: "text-orange-500"
    },
    {
      title: "Lịch hẹn hoạt động",
      value: "45",
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: "text-purple-500"
    }
  ];

  const recentAppointments = [
    {
      id: 1,
      customer: "Nguyễn Thị Lan",
      phone: "0901234567",
      doctor: "BS. Trần Văn Nam",
      service: "IUI - Thu tinh trong tử cung",
      date: "2024-06-15",
      time: "09:00",
      status: "confirmed",
      statusText: "Đã đặt lịch"
    },
    {
      id: 2,
      customer: "Lê Thị Hoa",
      phone: "0907654321",
      doctor: "BS. Nguyễn Thị Mai",
      service: "IVF - Thu tinh ống nghiệm",
      date: "2024-06-16",
      time: "14:30",
      status: "completed",
      statusText: "Hoàn thành"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (id: number) => {
    setFeedbacks(prev =>
      prev.map(fb =>
        fb.id === id
          ? { ...fb, status: fb.status === "visible" ? "hidden" : "visible" }
          : fb
      )
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "visible"
      ? <Badge className="bg-green-100 text-green-800 cursor-pointer">Hiện</Badge>
      : <Badge className="bg-gray-100 text-gray-800 cursor-pointer">Ẩn</Badge>;
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bảng điều khiển quản lý</h1>
          <p className="text-muted-foreground">
            Quản lý tổng thể khách hàng và lịch làm việc của hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="staff">Quản lý Bác sĩ</TabsTrigger> 
            <TabsTrigger value="customers">Quản lý Khách hàng</TabsTrigger>
            <TabsTrigger value="appointments">Lịch làm việc</TabsTrigger>
            <TabsTrigger value="feedbacks">Quản lý Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <ScheduleManagement />
          </TabsContent>

          <TabsContent value="feedbacks">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý Feedback</CardTitle>
                <CardDescription>
                  Xem và quản lý phản hồi của khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Họ và tên</th>
                        <th className="px-4 py-2 text-left">Ngày</th>
                        <th className="px-4 py-2 text-left">Số sao</th>
                        <th className="px-4 py-2 text-left">Bình luận</th>
                        <th className="px-4 py-2 text-left">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map(fb => (
                        <tr key={fb.id} className="border-b">
                          <td className="px-4 py-2">{fb.name}</td>
                          <td className="px-4 py-2">{fb.date}</td>
                          <td className="px-4 py-2">
                            {Array.from({ length: fb.stars }).map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                            {Array.from({ length: 5 - fb.stars }).map((_, i) => (
                              <span key={i} className="text-gray-300">★</span>
                            ))}
                          </td>
                          <td className="px-4 py-2">{fb.comment}</td>
                          <td className="px-4 py-2">
                            <span onClick={() => handleToggleStatus(fb.id)}>
                              {getStatusBadge(fb.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
