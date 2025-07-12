
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById, updateUser } from "@/api/userService";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth(); // Thêm login để cập nhật context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getUserById(user.id)
      .then(res => {
        const data = res.data.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          age: data.age ? String(data.age) : "",
          gender: data.gender || ""
        });
        console.log("User detail from API:", data);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div>Đang tải thông tin...</div>;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    // Chỉ gửi các trường BE hỗ trợ update
    const updateData = {
      id: user.id,
      name: formData.name,
      phone: formData.phone,
      age: formData.age ? Number(formData.age) : undefined,
      gender: formData.gender,
      address: formData.address
    };
    try {
      await updateUser(updateData);
      // Lấy lại thông tin user mới nhất và cập nhật context
      const updatedUserRes = await getUserById(user.id);
      if (updatedUserRes?.data?.data) {
        login(updatedUserRes.data.data);
      }
      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin cá nhân đã được cập nhật."
      });
      navigate('/dashboard/customer');
    } catch (error) {
      toast({
        title: "Cập nhật thất bại!",
        description: "Vui lòng thử lại."
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/customer')}
            className="mb-4"
          >
            ← Quay lại Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Cập nhật thông tin cá nhân</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Chỉnh sửa thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Tuổi</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Cập nhật thông tin
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/customer')}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProfile;
