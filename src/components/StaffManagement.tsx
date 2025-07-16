import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserIcon, EditIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { getUsersByRole } from "@/api/adminApi";

const StaffManagement = () => {
  const { toast } = useToast();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsersByRole("Doctor").then(res => {
      const doctors = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setStaffList(doctors);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Lọc staffList theo search
  const filteredStaffList = staffList.filter(staff =>
    [staff.name, staff.email, staff.phone]
      .some(field => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Danh sách Bác sĩ ({staffList.length})</span>
          </div>
        </CardTitle>
        <CardDescription>
          Danh sách bác sĩ hệ thống (chỉ hiển thị tên, email, số điện thoại)
        </CardDescription>
        {/* Thanh tìm kiếm */}
        <div className="mt-4 flex">
          <div className="max-w-xs w-full">
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">Đang tải danh sách bác sĩ...</div>
        ) : (
          <div className="space-y-4">
            {filteredStaffList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">Không có bác sĩ nào phù hợp</div>
            ) : (
              filteredStaffList.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">{staff.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{staff.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">{staff.phone}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
