
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SystemReports = () => {
  const systemStats = [
    { label: "Tổng số bệnh nhân", value: "1,234", change: "+5.2%", color: "text-blue-600" },
    { label: "Tổng số bác sĩ", value: "45", change: "+2.1%", color: "text-green-600" },
    { label: "Tổng số manager", value: "8", change: "0%", color: "text-purple-600" },
    { label: "Tổng số staff", value: "23", change: "+8.7%", color: "text-orange-600" },
    { label: "Lịch hẹn tháng này", value: "567", change: "+12.3%", color: "text-pink-600" },
    { label: "Doanh thu tháng này", value: "2.4B VNĐ", change: "+15.8%", color: "text-indigo-600" }
  ];

  const recentActivities = [
    { id: 1, action: "Tạo tài khoản mới", user: "Admin", target: "doctor@newdoc.com", time: "2 phút trước", type: "create" },
    { id: 2, action: "Cập nhật thông tin", user: "Manager", target: "Nguyễn Văn A", time: "15 phút trước", type: "update" },
    { id: 3, action: "Xóa lịch hẹn", user: "Staff", target: "Booking #1234", time: "1 giờ trước", type: "delete" },
    { id: 4, action: "Phân quyền", user: "Admin", target: "staff@new.com", time: "2 giờ trước", type: "permission" }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'permission': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const bookingData = [
    { id: 1, date: "2024-06-15", time: "09:00", doctor: "BS. Trần Văn Nam", service: "IUI", status: "completed" },
    { id: 2, date: "2024-06-15", time: "10:30", doctor: "BS. Nguyễn Thị Mai", service: "IVF", status: "confirmed" },
    { id: 3, date: "2024-06-16", time: "14:00", doctor: "BS. Lê Minh Hoàng", service: "ICSI", status: "cancelled" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change} so với tháng trước</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hoạt động gần đây */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động hệ thống gần đây</CardTitle>
          <CardDescription>
            Theo dõi các hoạt động quan trọng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hành động</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Loại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.target}</TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell>
                    <Badge className={getActivityColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quản lý lịch hẹn (chỉ hiển thị thông tin lịch hẹn, không có thông tin cá nhân) */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý lịch hẹn hệ thống</CardTitle>
          <CardDescription>
            Thông tin lịch hẹn (đã ẩn thông tin cá nhân khách hàng)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.doctor}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status === 'completed' ? 'Hoàn thành' : 
                       booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Báo cáo và xuất dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo và xuất dữ liệu</CardTitle>
          <CardDescription>
            Tạo các báo cáo và xuất dữ liệu hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline">📊 Báo cáo doanh thu</Button>
          <Button variant="outline">👥 Báo cáo người dùng</Button>
          <Button variant="outline">📅 Báo cáo lịch hẹn</Button>
          <Button variant="outline">💾 Xuất dữ liệu</Button>
          <Button variant="outline">📈 Thống kê truy cập</Button>
          <Button variant="outline">🔒 Báo cáo bảo mật</Button>
          <Button variant="outline">⚙️ Log hệ thống</Button>
          <Button variant="outline">🔄 Sao lưu dữ liệu</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemReports;
