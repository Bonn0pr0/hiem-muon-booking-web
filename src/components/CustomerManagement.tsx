import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getUsersByRole } from "@/api/adminApi";

const CustomerManagement = () => {
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getUsersByRole("Customer").then(res => {
      // Nếu res.data là object chứa mảng, ví dụ: { data: [...] }
      // thì phải lấy đúng trường, ví dụ: setCustomers(res.data.data || []);
      // Nếu res.data là mảng thì dùng trực tiếp
      setCustomers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const toggleStatus = (id: number) => {
    setCustomers(customers.map(customer =>
      customer.id === id
        ? { ...customer, status: customer.status === 'active' ? 'inactive' : 'active' }
        : customer
    ));
  };

  const deleteCustomer = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer({ ...customer });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCustomer) return;
    
    setCustomers(customers.map(customer =>
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    
    toast({
      title: "Cập nhật thành công!",
      description: "Thông tin khách hàng đã được cập nhật."
    });
    
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách khách hàng ({customers.length})</CardTitle>
        <CardDescription>
          Quản lý thông tin các khách hàng trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.age}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("vi-VN") : ""}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(customer.id)}>
                      {getStatusBadge(customer.status)}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin khách hàng trong hệ thống
              </DialogDescription>
            </DialogHeader>
            {editingCustomer && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Họ và tên</Label>
                  <Input
                    id="edit-name"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Số điện thoại</Label>
                  <Input
                    id="edit-phone"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-age">Tuổi</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editingCustomer.age}
                    onChange={(e) => setEditingCustomer({...editingCustomer, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-address">Địa chỉ</Label>
                  <Input
                    id="edit-address"
                    value={editingCustomer.address}
                    onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerManagement;
