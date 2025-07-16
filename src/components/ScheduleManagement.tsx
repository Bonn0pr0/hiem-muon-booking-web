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
import { workScheduleApi } from "@/api/workScheduleApi";
import { getUsersByRole } from "@/api/adminApi";

const ScheduleManagement = () => {
  const { toast } = useToast();
  
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    workScheduleApi.getAll().then(res => {
      // Nếu res.data.data là mảng, lấy đúng trường này
      setSchedules(Array.isArray(res.data.data) ? res.data.data : []);
    });
  }, []);

  useEffect(() => {
    getUsersByRole("Doctor").then(res => {
      // Nếu res.data là object chứa mảng, lấy đúng trường
      setDoctors(Array.isArray(res.data) ? res.data : (res.data.data || []));
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    userId: "",
    startTime: "",
    endTime: "",
    notes: ""
  });

  const filteredSchedules = schedules.filter(schedule =>
    schedule.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (schedule.startTime && schedule.startTime.slice(0, 10).includes(searchTerm))
  );

  const toggleStatus = (id: number) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, status: schedule.status === 'available' ? 'unavailable' : 'available' }
        : schedule
    ));
  };

  const deleteSchedule = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule({ ...schedule });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingSchedule) return;
    
    setSchedules(schedules.map(schedule =>
      schedule.id === editingSchedule.id ? editingSchedule : schedule
    ));
    
    toast({
      title: "Cập nhật thành công!",
      description: "Lịch làm việc đã được cập nhật."
    });
    
    setIsEditDialogOpen(false);
    setEditingSchedule(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'available' ? (
      <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Không có sẵn</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch làm việc bác sĩ ({schedules.length})</CardTitle>
        <CardDescription>
          Quản lý lịch làm việc của các bác sĩ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm theo tên bác sĩ hoặc ngày..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* NÚT TẠO MỚI */}
        <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
          Tạo mới lịch làm việc
        </Button>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ làm việc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules
                .filter(schedule =>
                  schedule.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (schedule.startTime && schedule.startTime.slice(0, 10).includes(searchTerm))
                )
                .map((schedule) => (
                  <TableRow key={schedule.workId}>
                    <TableCell className="font-medium">{schedule.doctorName}</TableCell>
                    <TableCell>
                      {schedule.startTime ? schedule.startTime.slice(0, 10) : ""}
                    </TableCell>
                    <TableCell>
                      {schedule.startTime && schedule.endTime
                        ? `${schedule.startTime.slice(11, 16)} - ${schedule.endTime.slice(11, 16)}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Badge className={schedule.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {schedule.isAvailable ? "Có sẵn" : "Không có sẵn"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                          <PencilIcon className="w-4 h-4" />
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
              <DialogTitle>Chỉnh sửa lịch làm việc</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin lịch làm việc của bác sĩ
              </DialogDescription>
            </DialogHeader>
            {editingSchedule && (
              <div className="space-y-4">
                <div>
                  <Label>Bác sĩ</Label>
                  <Input value={editingSchedule.doctorName} disabled className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit-date">Ngày</Label>
                  <Input
                    id="edit-date"
                    type="datetime-local"
                    value={editingSchedule.date}
                    onChange={(e) => setEditingSchedule({...editingSchedule, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Giờ làm việc</Label>
                  <Input
                    id="edit-time"
                    type="datetime-local"
                    value={editingSchedule.time}
                    onChange={(e) => setEditingSchedule({...editingSchedule, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-patients">Số bệnh nhân</Label>
                  <Input
                    id="edit-patients"
                    value={editingSchedule.patients}
                    onChange={(e) => setEditingSchedule({...editingSchedule, patients: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={async () => {
                    await workScheduleApi.update(editingSchedule.workId, editingSchedule);
                    workScheduleApi.getAll().then(res => setSchedules(Array.isArray(res.data.data) ? res.data.data : []));
                    setIsEditDialogOpen(false);
                    setEditingSchedule(null);
                  }}>
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo mới lịch làm việc</DialogTitle>
            </DialogHeader>
            {/* Các input cho userId, startTime, endTime, notes */}
            <Label>Bác sĩ</Label>
            <select
              value={newSchedule.userId}
              onChange={e => setNewSchedule({ ...newSchedule, userId: e.target.value })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Chọn bác sĩ</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <Label>Thời gian bắt đầu</Label>
            <Input
              type="datetime-local"
              value={newSchedule.startTime}
              onChange={e => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
            />
            <Label>Thời gian kết thúc</Label>
            <Input
              type="datetime-local"
              value={newSchedule.endTime}
              onChange={e => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
            />
            <Label>Ghi chú</Label>
            <Input
              value={newSchedule.notes}
              onChange={e => setNewSchedule({ ...newSchedule, notes: e.target.value })}
            />
            <Button onClick={async () => {
              await workScheduleApi.create(newSchedule);
              workScheduleApi.getAll().then(res => setSchedules(Array.isArray(res.data.data) ? res.data.data : []));
              setIsAddDialogOpen(false);
              setNewSchedule({ userId: "", startTime: "", endTime: "", notes: "" });
            }}>Tạo mới</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ScheduleManagement;
