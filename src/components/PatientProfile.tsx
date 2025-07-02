
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Edit, Save, X, Plus } from "lucide-react";

interface PatientProfileProps {
  patient: any;
  isOpen: boolean;
  onClose: () => void;
}

const PatientProfile = ({ patient, isOpen, onClose }: PatientProfileProps) => {
  if (!patient) return null;

  const [editingTest, setEditingTest] = useState<number | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<number | null>(null);
  const [editingExam, setEditingExam] = useState<number | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<number | null>(null);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);

  // State for form data
  const [testResults, setTestResults] = useState([
    {
      id: 1,
      date: "2024-06-15",
      type: "Xét nghiệm hormone FSH",
      result: "8.2 mIU/mL",
      status: "Bình thường",
      range: "1.5-12.4 mIU/mL"
    },
    {
      id: 2,
      date: "2024-06-10",
      type: "Xét nghiệm AMH",
      result: "2.1 ng/mL",
      status: "Bình thường",
      range: "1.0-3.5 ng/mL"
    },
    {
      id: 3,
      date: "2024-06-05",
      type: "Siêu âm buồng trứng",
      result: "Số nang noãn: 12",
      status: "Tốt",
      range: "6-20"
    }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      date: "2024-06-15",
      medicine: "Clomiphene Citrate",
      dosage: "50mg",
      frequency: "Ngày 1 viên",
      duration: "5 ngày",
      instructions: "Uống từ ngày thứ 3-7 của chu kỳ kinh"
    },
    {
      id: 2,
      date: "2024-06-10",
      medicine: "Folic Acid",
      dosage: "5mg",
      frequency: "Ngày 1 viên",
      duration: "30 ngày",
      instructions: "Uống sau ăn"
    }
  ]);

  const [examResults, setExamResults] = useState([
    {
      id: 1,
      date: "2024-06-15",
      examination: "Khám phụ khoa tổng quát",
      findings: "Tử cung bình thường, buồng trứng hoạt động tốt",
      conclusion: "Không có bất thường",
      doctor: "BS. Trần Văn Nam"
    },
    {
      id: 2,
      date: "2024-06-10",
      examination: "Siêu âm tử cung phần phụ",
      findings: "Nội mạc tử cung dày 8mm, buồng trứng có nhiều nang noãn",
      conclusion: "Phù hợp cho quá trình kích thích buồng trứng",
      doctor: "BS. Trần Văn Nam"
    }
  ]);

  const [treatmentPlan, setTreatmentPlan] = useState([
    {
      id: 1,
      phase: "Giai đoạn 1",
      title: "Chuẩn bị và kích thích buồng trứng",
      startDate: "2024-06-01",
      endDate: "2024-06-15",
      status: "Hoàn thành",
      activities: [
        "Xét nghiệm hormone cơ bản",
        "Siêu âm đánh giá buồng trứng",
        "Kích thích buồng trứng với Clomiphene"
      ]
    },
    {
      id: 2,
      phase: "Giai đoạn 2",
      title: "Theo dõi phát triển nang noãn",
      startDate: "2024-06-16",
      endDate: "2024-06-25",
      status: "Đang thực hiện",
      activities: [
        "Siêu âm theo dõi nang noãn",
        "Xét nghiệm hormone LH, E2",
        "Điều chỉnh liều thuốc kích thích"
      ]
    },
    {
      id: 3,
      phase: "Giai đoạn 3",
      title: "Thu thập trứng và thụ tinh",
      startDate: "2024-06-26",
      endDate: "2024-06-30",
      status: "Chưa bắt đầu",
      activities: [
        "Tiêm kích thích phóng noãn",
        "Thu thập trứng",
        "Thụ tinh trong phòng thí nghiệm"
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-800';
      case 'Chưa bắt đầu':
        return 'bg-gray-100 text-gray-800';
      case 'Bình thường':
      case 'Tốt':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveTest = (id: number, updatedData: any) => {
    setTestResults(prev => prev.map(test => test.id === id ? { ...test, ...updatedData } : test));
    setEditingTest(null);
  };

  const handleSavePrescription = (id: number, updatedData: any) => {
    setPrescriptions(prev => prev.map(prescription => prescription.id === id ? { ...prescription, ...updatedData } : prescription));
    setEditingPrescription(null);
  };

  const handleSaveExam = (id: number, updatedData: any) => {
    setExamResults(prev => prev.map(exam => exam.id === id ? { ...exam, ...updatedData } : exam));
    setEditingExam(null);
  };

  const handleSaveTreatment = (id: number, updatedData: any) => {
    setTreatmentPlan(prev => prev.map(treatment => treatment.id === id ? { ...treatment, ...updatedData } : treatment));
    setEditingTreatment(null);
  };

  const handleAddTest = (newTest: any) => {
    const id = Math.max(...testResults.map(t => t.id)) + 1;
    setTestResults(prev => [...prev, { ...newTest, id }]);
    setShowAddTest(false);
  };

  const handleAddPrescription = (newPrescription: any) => {
    const id = Math.max(...prescriptions.map(p => p.id)) + 1;
    setPrescriptions(prev => [...prev, { ...newPrescription, id }]);
    setShowAddPrescription(false);
  };

  const handleAddExam = (newExam: any) => {
    const id = Math.max(...examResults.map(e => e.id)) + 1;
    setExamResults(prev => [...prev, { ...newExam, id }]);
    setShowAddExam(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hồ sơ bệnh nhân - {patient.name}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về quá trình điều trị và kết quả khám bệnh
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="tests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tests">Xét nghiệm</TabsTrigger>
              <TabsTrigger value="prescriptions">Đơn thuốc</TabsTrigger>
              <TabsTrigger value="examinations">Kết quả khám</TabsTrigger>
              <TabsTrigger value="treatment">Liệu trình</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Kết quả xét nghiệm</CardTitle>
                      <CardDescription>Danh sách các xét nghiệm và kết quả</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddTest(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm xét nghiệm
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {showAddTest && (
                      <AddTestForm onSave={handleAddTest} onCancel={() => setShowAddTest(false)} />
                    )}
                    {testResults.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        {editingTest === test.id ? (
                          <EditTestForm test={test} onSave={handleSaveTest} onCancel={() => setEditingTest(null)} />
                        ) : (
                          <TestDisplay test={test} onEdit={() => setEditingTest(test.id)} getStatusColor={getStatusColor} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Đơn thuốc</CardTitle>
                      <CardDescription>Danh sách thuốc đã kê và hướng dẫn sử dụng</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddPrescription(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm đơn thuốc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {showAddPrescription && (
                      <AddPrescriptionForm onSave={handleAddPrescription} onCancel={() => setShowAddPrescription(false)} />
                    )}
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        {editingPrescription === prescription.id ? (
                          <EditPrescriptionForm prescription={prescription} onSave={handleSavePrescription} onCancel={() => setEditingPrescription(null)} />
                        ) : (
                          <PrescriptionDisplay prescription={prescription} onEdit={() => setEditingPrescription(prescription.id)} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examinations" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Kết quả khám bệnh</CardTitle>
                      <CardDescription>Các lần khám bệnh và kết quả chẩn đoán</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddExam(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm kết quả khám
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {showAddExam && (
                      <AddExamForm onSave={handleAddExam} onCancel={() => setShowAddExam(false)} />
                    )}
                    {examResults.map((exam) => (
                      <div key={exam.id} className="border rounded-lg p-4">
                        {editingExam === exam.id ? (
                          <EditExamForm exam={exam} onSave={handleSaveExam} onCancel={() => setEditingExam(null)} />
                        ) : (
                          <ExamDisplay exam={exam} onEdit={() => setEditingExam(exam.id)} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Liệu trình điều trị</CardTitle>
                  <CardDescription>Kế hoạch điều trị chi tiết theo từng giai đoạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {treatmentPlan.map((phase) => (
                      <div key={phase.id} className="border rounded-lg p-4">
                        {editingTreatment === phase.id ? (
                          <EditTreatmentForm treatment={phase} onSave={handleSaveTreatment} onCancel={() => setEditingTreatment(null)} />
                        ) : (
                          <TreatmentDisplay treatment={phase} onEdit={() => setEditingTreatment(phase.id)} getStatusColor={getStatusColor} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component con cho hiển thị xét nghiệm
const TestDisplay = ({ test, onEdit, getStatusColor }: any) => (
  <>
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-semibold">{test.type}</h4>
        <p className="text-sm text-muted-foreground">{test.date}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(test.status)}>
          {test.status}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium">Kết quả:</p>
        <p className="text-sm">{test.result}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Khoảng bình thường:</p>
        <p className="text-sm">{test.range}</p>
      </div>
    </div>
  </>
);

// Component con cho chỉnh sửa xét nghiệm
const EditTestForm = ({ test, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(test);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(test.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Loại xét nghiệm</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="date">Ngày xét nghiệm</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="result">Kết quả</Label>
          <Input
            id="result"
            value={formData.result}
            onChange={(e) => setFormData({...formData, result: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="range">Khoảng bình thường</Label>
          <Input
            id="range"
            value={formData.range}
            onChange={(e) => setFormData({...formData, range: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bình thường">Bình thường</SelectItem>
              <SelectItem value="Tốt">Tốt</SelectItem>
              <SelectItem value="Cần theo dõi">Cần theo dõi</SelectItem>
              <SelectItem value="Bất thường">Bất thường</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      </div>
    </form>
  );
};

// Component thêm xét nghiệm mới
const AddTestForm = ({ onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    status: 'Bình thường',
    range: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      type: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      status: 'Bình thường',
      range: ''
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Thêm xét nghiệm mới</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-type">Loại xét nghiệm</Label>
            <Input
              id="new-type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-date">Ngày xét nghiệm</Label>
            <Input
              id="new-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-result">Kết quả</Label>
            <Input
              id="new-result"
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-range">Khoảng bình thường</Label>
            <Input
              id="new-range"
              value={formData.range}
              onChange={(e) => setFormData({...formData, range: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bình thường">Bình thường</SelectItem>
                <SelectItem value="Tốt">Tốt</SelectItem>
                <SelectItem value="Cần theo dõi">Cần theo dõi</SelectItem>
                <SelectItem value="Bất thường">Bất thường</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

// Các component tương tự cho đơn thuốc
const PrescriptionDisplay = ({ prescription, onEdit }: any) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-lg">{prescription.medicine}</h4>
        <p className="text-sm text-muted-foreground">{prescription.date}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium">Liều lượng:</p>
        <p className="text-sm">{prescription.dosage}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Tần suất:</p>
        <p className="text-sm">{prescription.frequency}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Thời gian:</p>
        <p className="text-sm">{prescription.duration}</p>
      </div>
    </div>
    <div className="mt-3">
      <p className="text-sm font-medium">Hướng dẫn sử dụng:</p>
      <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
    </div>
  </>
);

const EditPrescriptionForm = ({ prescription, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(prescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prescription.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicine">Tên thuốc</Label>
          <Input
            id="medicine"
            value={formData.medicine}
            onChange={(e) => setFormData({...formData, medicine: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="date">Ngày kê đơn</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="dosage">Liều lượng</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="frequency">Tần suất</Label>
          <Input
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="duration">Thời gian</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instructions">Hướng dẫn sử dụng</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      </div>
    </form>
  );
};

const AddPrescriptionForm = ({ onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    medicine: '',
    date: new Date().toISOString().split('T')[0],
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      medicine: '',
      date: new Date().toISOString().split('T')[0],
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Thêm đơn thuốc mới</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-medicine">Tên thuốc</Label>
            <Input
              id="new-medicine"
              value={formData.medicine}
              onChange={(e) => setFormData({...formData, medicine: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-date">Ngày kê đơn</Label>
            <Input
              id="new-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-dosage">Liều lượng</Label>
            <Input
              id="new-dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-frequency">Tần suất</Label>
            <Input
              id="new-frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-duration">Thời gian</Label>
            <Input
              id="new-duration"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="new-instructions">Hướng dẫn sử dụng</Label>
          <Textarea
            id="new-instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

// Các component cho kết quả khám
const ExamDisplay = ({ exam, onEdit }: any) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold">{exam.examination}</h4>
        <p className="text-sm text-muted-foreground">{exam.date} • {exam.doctor}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Kết quả khám:</p>
        <p className="text-sm">{exam.findings}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Kết luận:</p>
        <p className="text-sm">{exam.conclusion}</p>
      </div>
    </div>
  </>
);

const EditExamForm = ({ exam, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(exam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(exam.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="examination">Loại khám</Label>
          <Input
            id="examination"
            value={formData.examination}
            onChange={(e) => setFormData({...formData, examination: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="date">Ngày khám</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="doctor">Bác sĩ</Label>
          <Input
            id="doctor"
            value={formData.doctor}
            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="findings">Kết quả khám</Label>
        <Textarea
          id="findings"
          value={formData.findings}
          onChange={(e) => setFormData({...formData, findings: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="conclusion">Kết luận</Label>
        <Textarea
          id="conclusion"
          value={formData.conclusion}
          onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      </div>
    </form>
  );
};

const AddExamForm = ({ onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    examination: '',
    date: new Date().toISOString().split('T')[0],
    findings: '',
    conclusion: '',
    doctor: 'BS. Trần Văn Nam'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      examination: '',
      date: new Date().toISOString().split('T')[0],
      findings: '',
      conclusion: '',
      doctor: 'BS. Trần Văn Nam'
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Thêm kết quả khám mới</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-examination">Loại khám</Label>
            <Input
              id="new-examination"
              value={formData.examination}
              onChange={(e) => setFormData({...formData, examination: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-date">Ngày khám</Label>
            <Input
              id="new-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-doctor">Bác sĩ</Label>
            <Input
              id="new-doctor"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="new-findings">Kết quả khám</Label>
          <Textarea
            id="new-findings"
            value={formData.findings}
            onChange={(e) => setFormData({...formData, findings: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="new-conclusion">Kết luận</Label>
          <Textarea
            id="new-conclusion"
            value={formData.conclusion}
            onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

// Component cho liệu trình điều trị
const TreatmentDisplay = ({ treatment, onEdit, getStatusColor }: any) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-lg">{treatment.phase}: {treatment.title}</h4>
        <p className="text-sm text-muted-foreground">
          {treatment.startDate} - {treatment.endDate}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(treatment.status)}>
          {treatment.status}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div>
      <p className="text-sm font-medium mb-2">Các hoạt động:</p>
      <ul className="list-disc list-inside space-y-1">
        {treatment.activities.map((activity: string, index: number) => (
          <li key={index} className="text-sm text-muted-foreground">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  </>
);

const EditTreatmentForm = ({ treatment, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    ...treatment,
    activities: treatment.activities.join('\n')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      activities: formData.activities.split('\n').filter(activity => activity.trim() !== '')
    };
    onSave(treatment.id, updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phase">Giai đoạn</Label>
          <Input
            id="phase"
            value={formData.phase}
            onChange={(e) => setFormData({...formData, phase: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
              <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
              <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Ngày bắt đầu</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Ngày kết thúc</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="title">Tên giai đoạn</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="activities">Các hoạt động (mỗi dòng một hoạt động)</Label>
        <Textarea
          id="activities"
          value={formData.activities}
          onChange={(e) => setFormData({...formData, activities: e.target.value})}
          rows={5}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default PatientProfile;
