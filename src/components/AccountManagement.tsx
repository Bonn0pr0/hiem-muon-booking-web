import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  gender: string;
  password?: string;
  status: string;
  role: string;
}

const AccountManagement = ({ users, roles, onChangeRole }) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>(users);

  useEffect(() => {
    setAccounts(users);
  }, [users]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Gọi API đổi role
      await onChangeRole(editingId, formData.role);
      toast({
        title: "Cập nhật thành công",
        description: "Tài khoản đã được cập nhật",
      });
      setEditingId(null);
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu xác nhận không khớp",
          variant: "destructive"
        });
        return;
      }
      const newAccount = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        age: Number(formData.age),
        gender: formData.gender,
        password: formData.password,
        role: formData.role,
        status: 'active'
      };
      setAccounts(prev => [...prev, newAccount]);
      toast({
        title: "Tạo tài khoản thành công",
        description: "Tài khoản mới đã được tạo",
      });
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      age: '',
      gender: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
  };

  const handleEdit = (account: Account) => {
    // Tìm roleId từ roleName (nếu account.role là roleName)
    let roleId = account.role;
    if (isNaN(Number(roleId))) {
      // Nếu role là roleName, tìm roleId
      const found = roles.find(r => r.roleName.toLowerCase() === account.role.toLowerCase());
      roleId = found ? found.roleId.toString() : "";
    }
    setFormData({
      name: account.name,
      email: account.email,
      phone: account.phone || '',
      address: account.address || '',
      age: account.age?.toString() || '',
      gender: account.gender || '',
      password: '',
      confirmPassword: '',
      role: isNaN(Number(account.role))
        ? (roles.find(r => r.roleName.toLowerCase() === account.role.toLowerCase())?.roleId.toString() || "")
        : account.role
    });
    setEditingId(typeof account.id === "number" ? account.id : Number(account.id));
  };

  const handleChangeRole = async (userId, roleId) => {
    await onChangeRole(userId, Number(roleId));
    toast({
      title: "Đổi vai trò",
      description: "Vai trò đã được đổi",
    });
  };

  // Thêm hàm toggleStatus
  const handleToggleStatus = (id: number | string) => {
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === id
          ? { ...acc, status: acc.status === "active" ? "inactive" : "active" }
          : acc
      )
    );
    toast({
      title: "Cập nhật trạng thái",
      description: "Trạng thái tài khoản đã được thay đổi",
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
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Tuổi</Label>
                    <Input
                      id="age"
                      type="number"
                      min={0}
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
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
                      required={!editingId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required={!editingId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.roleId} value={role.roleId.toString()}>
                            {role.roleName.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            address: '',
                            age: '',
                            gender: '',
                            password: '',
                            confirmPassword: '',
                            role: ''
                          });
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
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Danh sách tài khoản</CardTitle>
                  <Input
                    className="w-48"
                    placeholder="Tìm kiếm tên..."
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Thao tác</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="max-h-80 overflow-y-auto">
                  <Table>
                    <TableBody>
                      {accounts
                        .filter(acc =>
                          acc.name.toLowerCase().includes(searchName.toLowerCase())
                        )
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell className="font-medium">{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(account.role)}>
                                {
                                  (roles.find(r => r.roleId.toString() === account.role.toString())?.roleName || account.role).toUpperCase()
                                }
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
                                {/* Bỏ nút Xóa */}
                                {/* 
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(account.id)}
                                >
                                  Xóa
                                </Button>
                                */}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={account.status === "active" ? "default" : "secondary"}
                                onClick={() => handleToggleStatus(account.id)}
                              >
                                {account.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;
