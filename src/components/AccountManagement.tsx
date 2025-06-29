
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AccountManagement = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Admin", email: "admin@fertilitycare.com", role: "admin", status: "active" },
    { id: 2, name: "Manager", email: "manager@fertilitycare.com", role: "manager", status: "active" },
    { id: 3, name: "Staff", email: "staff@fertilitycare.com", role: "staff", status: "active" },
    { id: 4, name: "BS. Trần Văn Nam", email: "doctor@fertilitycare.com", role: "doctor", status: "active" },
    { id: 5, name: "Nguyễn Văn A", email: "user@example.com", role: "user", status: "active" }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setAccounts(prev => prev.map(acc => 
        acc.id === editingId 
          ? { ...acc, name: formData.name, email: formData.email, role: formData.role }
          : acc
      ));
      toast({
        title: "Cập nhật thành công",
        description: "Tài khoản đã được cập nhật",
      });
      setEditingId(null);
    } else {
      const newAccount = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active'
      };
      setAccounts(prev => [...prev, newAccount]);
      toast({
        title: "Tạo tài khoản thành công",
        description: "Tài khoản mới đã được tạo",
      });
    }

    setFormData({ name: '', email: '', role: '', password: '' });
  };

  const handleEdit = (account: any) => {
    setFormData({
      name: account.name,
      email: account.email,
      role: account.role,
      password: ''
    });
    setEditingId(account.id);
  };

  const handleDelete = (id: number) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    toast({
      title: "Xóa tài khoản",
      description: "Tài khoản đã được xóa",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý tài khoản hệ thống</CardTitle>
          <CardDescription>
            Tạo, sửa, xóa và phân quyền cho các tài khoản trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form tạo/sửa tài khoản */}
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Sửa tài khoản' : 'Tạo tài khoản mới'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={editingId ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
                      required={!editingId}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? 'Cập nhật' : 'Tạo tài khoản'}
                    </Button>
                    {editingId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: '', email: '', role: '', password: '' });
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danh sách tài khoản */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách tài khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(account.role)}>
                            {account.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(account)}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(account.id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;
