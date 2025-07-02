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
  role: string;
  status: string;
}

const AccountManagement = ({ users, roles, onDeleteUser, onChangeRole }) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>(users);

  useEffect(() => {
    setAccounts(users);
  }, [users]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: ''
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
      const newAccount = {
        id: formData.id || Date.now(),
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

    setFormData({ id: '', name: '', email: '', role: '', password: '' });
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
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      role: roleId,
      password: ''
    });
    setEditingId(typeof account.id === "number" ? account.id : Number(account.id));
  };

  const handleDelete = (id: number | string) => {
    onDeleteUser(id);
    toast({
      title: "Xóa tài khoản",
      description: "Tài khoản đã được xóa",
      variant: "destructive"
    });
  };

  const handleChangeRole = async (userId, roleId) => {
    await onChangeRole(userId, Number(roleId));
    toast({
      title: "Đổi vai trò",
      description: "Vai trò đã được đổi",
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
                <CardTitle>{editingId ? 'Sửa tài khoản' : 'Phân quyền'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      required
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
                          setFormData({id: '', name: '', email: '', role: '', password: '' });
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
