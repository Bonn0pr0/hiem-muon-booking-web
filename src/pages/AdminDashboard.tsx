import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, CalendarIcon, FileIcon, TrendingUpIcon, ShieldIcon, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountManagement from "@/components/AccountManagement";
import SystemReports from "@/components/SystemReports";
import { getAllUsers, getAllRoles, changeUserRole, deleteUser } from "@/api/adminApi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const stats = [
    {
      title: "Tổng số bệnh nhân",
      value: "1,234",
      icon: <UserIcon className="w-6 h-6" />,
      color: "text-blue-500"
    },
    {
      title: "Tổng số bác sĩ",
      value: "45",
      icon: <UserIcon className="w-6 h-6" />,
      color: "text-green-500"
    },
    {
      title: "Tổng số manager",
      value: "8",
      icon: <ShieldIcon className="w-6 h-6" />,
      color: "text-purple-500"
    },
    {
      title: "Tổng số staff",
      value: "23",
      icon: <UserIcon className="w-6 h-6" />,
      color: "text-orange-500"
    },
    {
      title: "Lịch hẹn hoạt động",
      value: "156",
      icon: <CalendarIcon className="w-6 h-6" />,
      color: "text-pink-500"
    },
    {
      title: "Doanh thu tháng này",
      value: "2.4B VNĐ",
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: "text-indigo-500"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Cảnh báo bảo mật",
      message: "Phát hiện 3 lần đăng nhập thất bại từ IP lạ",
      time: "5 phút trước"
    },
    {
      id: 2,
      type: "info",
      title: "Cập nhật hệ thống",
      message: "Hệ thống cần được cập nhật trong 2 ngày tới",
      time: "1 giờ trước"
    },
    {
      id: 3,
      type: "success",
      title: "Sao lưu hoàn tất",
      message: "Sao lưu dữ liệu hàng ngày đã hoàn tất thành công",
      time: "3 giờ trước"
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    // Lấy danh sách user
    getAllUsers().then(res => setUsers(res.data.data || []));
    // Lấy danh sách role
    getAllRoles().then(res => setRoles(res.data.data || []));
  }, []);

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
    // Sau khi xóa, reload lại danh sách user
    const res = await getAllUsers();
    setUsers(res.data.data || []);
  };

  const handleChangeRole = async (userId: number, roleId: number) => {
    await changeUserRole(userId, roleId);
    // Sau khi đổi role, reload lại danh sách user
    const res = await getAllUsers();
    setUsers(res.data.data || []);
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔐 Bảng điều khiển Admin</h1>
          <p className="text-muted-foreground">
            Quản lý toàn bộ hệ thống và có quyền truy cập vào tất cả các chức năng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* System Alerts
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🚨</span>
              <span>Cảnh báo hệ thống</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <div className="text-sm opacity-70">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {/* <TabsTrigger value="overview">Tổng quan</TabsTrigger> */}
            <TabsTrigger value="accounts">Quản lý tài khoản</TabsTrigger>
            {/* <TabsTrigger value="reports">Báo cáo & Thống kê</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
                <CardDescription>
                  Các chức năng quản trị quan trọng
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start h-20 flex-col">
                  <UserIcon className="w-6 h-6 mb-2" />
                  <span>Tạo tài khoản</span>
                </Button>
                <Button variant="outline" className="justify-start h-20 flex-col">
                  <ShieldIcon className="w-6 h-6 mb-2" />
                  <span>Phân quyền</span>
                </Button>
                <Button variant="outline" className="justify-start h-20 flex-col">
                  <SettingsIcon className="w-6 h-6 mb-2" />
                  <span>Cài đặt hệ thống</span>
                </Button>
                <Button variant="outline" className="justify-start h-20 flex-col">
                  <FileIcon className="w-6 h-6 mb-2" />
                  <span>Sao lưu dữ liệu</span>
                </Button>
              </CardContent>
            </Card> */}

            {/* System Health */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Tình trạng hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.3GB</div>
                  <div className="text-sm text-muted-foreground">Database Size</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">156ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="accounts">
            <AccountManagement
              users={users}
              roles={roles}
              onChangeRole={handleChangeRole}
            />
          </TabsContent>

          <TabsContent value="reports">
            <SystemReports />
          </TabsContent>
        </Tabs>

        {/* Quick Access to Other Dashboards
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Truy cập nhanh các dashboard khác</CardTitle>
            <CardDescription>
              Admin có thể truy cập tất cả các dashboard trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/dashboard/doctor')}
            >
              👨‍⚕️ Dashboard Bác sĩ
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/dashboard/manager')}
            >
              👔 Dashboard Manager
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/dashboard/staff')}
            >
              👥 Dashboard Staff
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/dashboard/user')}
            >
              👤 Dashboard User
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
