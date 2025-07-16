import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Edit, Save, X, Plus } from "lucide-react";
import { getReferenceRange, getAllReferenceRanges } from "@/api/referenceRangeApi";
import { createExamination, getExaminationsByBooking, getExaminationsByCustomer } from "@/api/examinationApi";
import { useAuth } from "@/contexts/AuthContext";
import { createMedicalResult, updateMedicalResult, getMedicalResultsByExam, getMedicalResultsByCustomer } from "@/api/medicalResultsApi";
import { createTreatmentPlan, getTreatmentPlansByBooking } from "@/api/treatmentPlanApi";

interface PatientProfileProps {
  patient: any;
  isOpen: boolean;
  onClose: () => void;
  isReadOnly?: boolean;
}

function isValidDate(dateString: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
}

const PatientProfile = ({ patient, isOpen, onClose, isReadOnly = false }: PatientProfileProps) => {
  if (!patient) return null;

  const [editingTest, setEditingTest] = useState<number | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<number | null>(null);
  const [editingExam, setEditingExam] = useState<number | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<number | null>(null);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showMedicalResultForm, setShowMedicalResultForm] = useState<number | null>(null);

  // State for form data
  const [testResults, setTestResults] = useState([]);

  const [examResults, setExamResults] = useState([]);

  const [treatmentPlan, setTreatmentPlan] = useState<any[]>([]);

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

  const handleAddTest = async (newTest: any) => {
    // Validate date
    if (!isValidDate(newTest.date)) {
      alert("Ngày xét nghiệm không hợp lệ!");
      return;
    }
    try {
      await createExamination({
        bookingId: patient.bookingId,
        name: newTest.type,
        examDate: newTest.date + "T00:00:00", // <-- This is the fix!
        diagnosis: newTest.result,
        normalRange: newTest.range,
        recommendation: newTest.status // <-- map từ status của form sang recommendation
      });
      // Refetch after success
      const res = await getExaminationsByBooking(patient.bookingId);
      setTestResults(res.data.data || []);
      setShowAddTest(false);
    } catch (err: any) {
      alert("Lỗi khi thêm xét nghiệm: " + (err?.response?.data?.message || err.message));
    }
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

  const handleAddTreatment = async (newTreatment: any) => {
    try {
      await createTreatmentPlan({
        bookingId: patient.bookingId,
        phase: newTreatment.phase,
        title: newTreatment.title,
        startDate: newTreatment.startDate,
        endDate: newTreatment.endDate,
        status: newTreatment.status,
        activities: newTreatment.activities, // mảng string
      });
      // Refetch sau khi tạo thành công
      const res = await getTreatmentPlansByBooking(patient.bookingId);
      setTreatmentPlan(res.data.data || []);
      setShowAddTreatment(false);
    } catch (err: any) {
      alert("Lỗi khi thêm liệu trình: " + (err?.response?.data?.message || err.message));
    }
  };

  const { user } = useAuth();
  const customerId = user?.id;

  useEffect(() => {
    if (user?.role === "Customer" && user?.id) {
      getExaminationsByCustomer(user.id).then(res => {
        setTestResults(res.data.data || []);
      });
    } else if (patient?.bookingId) {
      getExaminationsByBooking(patient.bookingId).then(res => {
        setTestResults(res.data.data || []);
      });
    }
  }, [user, patient]);

  useEffect(() => {
    if (patient?.bookingId) {
      getExaminationsByBooking(patient.bookingId).then(res => {
        // Log ra để kiểm tra cấu trúc object
        console.log("Danh sách examination:", res.data.data);
        setExamResults(res.data.data || []);
      });
    }
  }, [patient]);

  const [medicalResultsByExamId, setMedicalResultsByExamId] = useState<{ [key: number]: any }>({});
  const [medicalResults, setMedicalResults] = useState([]);

  useEffect(() => {
    if (examResults.length > 0) {
      examResults.forEach((exam) => {
        if (!medicalResultsByExamId[exam.examId]) {
          getMedicalResultsByExam(exam.examId).then(res => {
            // API trả về mảng, chỉ lấy phần tử đầu tiên nếu chỉ có 1 result/exam
            setMedicalResultsByExamId(prev => ({
              ...prev,
              [exam.examId]: res.data.data && res.data.data.length > 0 ? res.data.data[0] : null
            }));
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [examResults]);

  useEffect(() => {
    if (user?.role === "Customer" && user?.id) {
      getMedicalResultsByCustomer(user.id).then(res => {
        setMedicalResults(res.data.data || []);
      });
    }
  }, [user]);

  const handleShowMedicalResultForm = (examId: number) => {
    getMedicalResultsByExam(examId).then(res => {
      setMedicalResultsByExamId(prev => ({
        ...prev,
        [examId]: res.data.data && res.data.data.length > 0 ? res.data.data[0] : null
      }));
      // Đợi setState xong mới mở form (nếu cần, dùng callback hoặc setTimeout 0)
      setTimeout(() => setShowMedicalResultForm(examId), 0);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hồ sơ bệnh nhân - {patient.name}</DialogTitle>
          <DialogDescription>
            {isReadOnly ? "Xem thông tin chi tiết về quá trình điều trị và kết quả khám bệnh" : "Thông tin chi tiết về quá trình điều trị và kết quả khám bệnh"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="tests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tests">Xét nghiệm</TabsTrigger>
              <TabsTrigger value="examinations">Kết quả khám</TabsTrigger>
              <TabsTrigger value="treatment">Liệu trình</TabsTrigger>
              <TabsTrigger value="prescriptions">Đơn thuốc</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Kết quả xét nghiệm</CardTitle>
                      <CardDescription>Danh sách các xét nghiệm và kết quả</CardDescription>
                    </div>
                    {!isReadOnly && (
                      <Button onClick={() => setShowAddTest(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm xét nghiệm
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isReadOnly && showAddTest && (
                      <AddTestForm onSave={handleAddTest} onCancel={() => setShowAddTest(false)} patient={patient} />
                    )}
                    {testResults.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có xét nghiệm nào
                      </div>
                    ) : (
                      testResults.map((test) => (
                        <div key={test.id} className="border rounded-lg p-4 mb-3 bg-white flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">{test.name}</div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {test.examDate ? test.examDate.split('T')[0] : ""}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <span className="text-sm font-medium">Kết quả:</span>
                                <span className="text-sm ml-1">{test.diagnosis}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Khoảng bình thường:</span>
                                <span className="text-sm ml-1">{test.normalRange}</span>
                              </div>
                            </div>
                          </div>
                          {test.recommendation && (
                            <div className="mt-2 md:mt-0 md:ml-4 flex items-center gap-2 flex-shrink-0">
                              <Badge className={
                                test.recommendation === "Bình thường" ? "bg-green-100 text-green-800" :
                                test.recommendation === "Tốt" ? "bg-blue-100 text-blue-800" :
                                test.recommendation === "Cần theo dõi" ? "bg-yellow-100 text-yellow-800" :
                                test.recommendation === "Bất thường" ? "bg-red-100 text-red-800" :
                                ""
                              }>
                                {test.recommendation}
                              </Badge>
                              <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 transition"
                                onClick={() => setEditingTest(test.id)}
                                title="Chỉnh sửa"
                                type="button"
                              >
                                <Edit size={18} className="text-gray-500" />
                              </button>
                              {/* Nút nhập kết quả y khoa */}
                              {!isReadOnly && user?.role === "Doctor" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title="Nhập kết quả khám"
                                  onClick={() => handleShowMedicalResultForm(test.id)}
                                >
                                  <Plus size={18} className="text-gray-500" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
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
                    {!isReadOnly && (
                      <Button onClick={() => setShowAddExam(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm kết quả khám
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isReadOnly && showAddExam && (
                      <AddExamForm
                        onSave={handleAddExam}
                        onCancel={() => setShowAddExam(false)}
                        testResults={testResults}
                      />
                    )}
                    {user?.role === "Customer" ? (
                      medicalResults.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Chưa có kết quả y khoa nào.
                        </div>
                      ) : (
                        medicalResults.map((result) => (
                          <div key={result.resultId} className="border rounded-xl p-5 mb-4 bg-white shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                              <div className="font-semibold text-lg text-primary">
                                {result.examName || result.testName || result.examination || "Không rõ"}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 md:mt-0">
                                {result.resultDate ? result.resultDate.split('T')[0] : ""}
                              </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {result.resultValue && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Kết quả khám:</span>
                                  <span className="flex-1">{result.resultValue}</span>
                                </div>
                              )}
                              {result.conclusion && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Kết luận:</span>
                                  <span className="flex-1">{result.conclusion}</span>
                                </div>
                              )}
                              {result.doctorName && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Bác sĩ:</span>
                                  <span className="flex-1">{result.doctorName}</span>
                                </div>
                              )}
                              {result.serviceName && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Dịch vụ:</span>
                                  <span className="flex-1">{result.serviceName}</span>
                                </div>
                              )}
                              {result.normalRange && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Khoảng bình thường:</span>
                                  <span className="flex-1">{result.normalRange}</span>
                                </div>
                              )}
                              {result.examName && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Tên lần khám:</span>
                                  <span className="flex-1">{result.examName}</span>
                                </div>
                              )}
                              {result.testName && (
                                <div className="flex py-2">
                                  <span className="w-40 font-medium text-gray-700">Tên xét nghiệm:</span>
                                  <span className="flex-1">{result.testName}</span>
                                </div>
                              )}
                              {/* Thêm các trường khác nếu muốn */}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      examResults.map((exam) => {
                        const hasResult = !!medicalResultsByExamId[exam.examId]?.resultId;
                        return (
                          <div key={exam.examId} className="border rounded-lg p-4 mb-3 bg-white">
                            <div className="font-semibold text-base mb-1">
                              {exam.examination || exam.name || "Không rõ"}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {exam.examDate ? exam.examDate.split('T')[0] : ""}
                            </div>
                            {/* Nếu là Doctor thì hiện nút sửa/tạo mới */}
                            {user?.role === "Doctor" && (
                              <>
                                {!hasResult && (
                                  <Button size="sm" onClick={() => handleShowMedicalResultForm(exam.examId)}>
                                    Tạo mới kết quả y khoa
                                  </Button>
                                )}
                                {hasResult && (
                                  <Button size="sm" onClick={() => handleShowMedicalResultForm(exam.examId)}>
                                    Sửa kết quả y khoa
                                  </Button>
                                )}
                              </>
                            )}
                            {/* Nếu là Customer thì chỉ hiện kết quả, không có nút */}
                            {user?.role === "Customer" && hasResult && (
                              <div className="mt-2 p-3 bg-gray-50 rounded border">
                                <div><b>Giá trị:</b> {medicalResultsByExamId[exam.examId]?.resultValue}</div>
                                <div><b>Ngày kết quả:</b> {medicalResultsByExamId[exam.examId]?.resultDate}</div>
                                <div><b>Kết luận:</b> {medicalResultsByExamId[exam.examId]?.conclusion}</div>
                                <div><b>Bác sĩ:</b> {medicalResultsByExamId[exam.examId]?.doctorName}</div>
                              </div>
                            )}
                            {/* Nếu là Customer và chưa có result thì có thể hiện thông báo */}
                            {user?.role === "Customer" && !hasResult && (
                              <div className="mt-2 text-muted-foreground italic">Chưa có kết quả y khoa cho lần khám này.</div>
                            )}
                            {/* Form sửa/tạo chỉ cho Doctor */}
                            {user?.role === "Doctor" && showMedicalResultForm === exam.examId && (
                              <MedicalResultForm
                                key={exam.examId + '-' + (medicalResultsByExamId[exam.examId]?.resultId || '')}
                                exam={exam}
                                initialData={medicalResultsByExamId[exam.examId] || null}
                                onClose={() => setShowMedicalResultForm(null)}
                                onSuccess={() => {
                                  alert("Lưu kết quả thành công!");
                                  setShowMedicalResultForm(null);
                                  getMedicalResultsByExam(exam.examId).then(res => {
                                    setMedicalResultsByExamId(prev => ({
                                      ...prev,
                                      [exam.examId]: res.data.data && res.data.data.length > 0 ? res.data.data[0] : null
                                    }));
                                  });
                                }}
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Liệu trình điều trị</CardTitle>
                      <CardDescription>Kế hoạch điều trị chi tiết theo từng giai đoạn</CardDescription>
                    </div>
                    {!isReadOnly && (
                      <Button onClick={() => setShowAddTreatment(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm giai đoạn
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!isReadOnly && showAddTreatment && (
                      <AddTreatmentForm onSave={handleAddTreatment} onCancel={() => setShowAddTreatment(false)} />
                    )}
                    {treatmentPlan.map((phase) => (
                      <div key={phase.id} className="border rounded-lg p-4">
                        {!isReadOnly && editingTreatment === phase.id ? (
                          <EditTreatmentForm treatment={phase} onSave={handleSaveTreatment} onCancel={() => setEditingTreatment(null)} />
                        ) : (
                          <TreatmentDisplay treatment={phase} onEdit={!isReadOnly ? () => setEditingTreatment(phase.id) : undefined} getStatusColor={getStatusColor} isReadOnly={isReadOnly} />
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
                    {!isReadOnly && (
                      <Button onClick={() => setShowAddPrescription(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm đơn thuốc
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isReadOnly && showAddPrescription && (
                      <AddPrescriptionForm onSave={handleAddPrescription} onCancel={() => setShowAddPrescription(false)} />
                    )}
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        {!isReadOnly && editingPrescription === prescription.id ? (
                          <EditPrescriptionForm prescription={prescription} onSave={handleSavePrescription} onCancel={() => setEditingPrescription(null)} />
                        ) : (
                          <PrescriptionDisplay prescription={prescription} onEdit={!isReadOnly ? () => setEditingPrescription(prescription.id) : undefined} isReadOnly={isReadOnly} />
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
const TestDisplay = ({ test, onEdit, getStatusColor, isReadOnly }: any) => (
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
        {!isReadOnly && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
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
const AddTestForm = ({ onSave, onCancel, patient }: any) => {
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    status: 'Bình thường',
    range: ''
  });
  const [loadingRange, setLoadingRange] = useState(false);
  const [rangeError, setRangeError] = useState('');
  const [testTypes, setTestTypes] = useState<{testName: string, normalRange: string}[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Lấy danh sách loại xét nghiệm khi mở form
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await getAllReferenceRanges();
        setTestTypes(res.data.data || []);
      } catch (err) {
        setTestTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Khi chọn loại xét nghiệm, tự động lấy khoảng bình thường
  const handleTypeChange = async (value: string) => {
    setFormData({ ...formData, type: value });
    setRangeError('');
    if (value) {
      setLoadingRange(true);
      try {
        const res = await getReferenceRange(value);
        setFormData((prev) => ({ ...prev, range: res.data }));
      } catch (err) {
        setFormData((prev) => ({ ...prev, range: '' }));
        setRangeError('Không tìm thấy khoảng bình thường');
      } finally {
        setLoadingRange(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, range: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      bookingId: patient.bookingId, // LẤY TỪ patient props
    });
    setFormData({
      type: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      status: 'Bình thường',
      range: ''
    });
    setRangeError('');
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Thêm xét nghiệm mới</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-type">Loại xét nghiệm</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
              disabled={loadingTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTypes ? 'Đang tải...' : 'Chọn loại xét nghiệm'} />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((t) => (
                  <SelectItem key={t.testName} value={t.testName}>{t.testName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              readOnly
              disabled={loadingRange}
              placeholder={loadingRange ? 'Đang tải...' : ''}
            />
            {rangeError && <p className="text-xs text-red-500 mt-1">{rangeError}</p>}
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

// Các component cho kết quả khám
const ExamDisplay = ({ exam, onEdit, isReadOnly }: any) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold">{exam.examination}</h4>
        <p className="text-sm text-muted-foreground">{exam.date} • {exam.doctor}</p>
      </div>
      {!isReadOnly && onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
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

const AddExamForm = ({ onSave, onCancel, testResults }: any) => {
  const [formData, setFormData] = useState({
    examination: '',
    date: new Date().toISOString().split('T')[0],
    findings: '',
    conclusion: '',
    doctor: 'BS. Trần Văn Nam',
    linkedTestId: testResults.length > 0 ? testResults[0].id : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      examination: '',
      date: new Date().toISOString().split('T')[0],
      findings: '',
      conclusion: '',
      doctor: 'BS. Trần Văn Nam',
      linkedTestId: testResults.length > 0 ? testResults[0].id : ''
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
          <div>
            <Label htmlFor="linked-test">Chọn xét nghiệm liên quan</Label>
            <select
              id="linked-test"
              value={formData.linkedTestId}
              onChange={e => setFormData({...formData, linkedTestId: e.target.value})}
              required
              className="input"
            >
              {testResults.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name} ({test.examDate ? test.examDate.split('T')[0] : ''})
                </option>
              ))}
            </select>
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
const TreatmentDisplay = ({ treatment, onEdit, getStatusColor, isReadOnly }: any) => (
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
        {!isReadOnly && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
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

const AddTreatmentForm = ({ onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    phase: '',
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'Chưa bắt đầu',
    activities: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTreatment = {
      ...formData,
      activities: formData.activities.split('\n').filter(activity => activity.trim() !== '')
    };
    onSave(newTreatment);
    setFormData({
      phase: '',
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'Chưa bắt đầu',
      activities: ''
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Thêm giai đoạn mới</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-phase">Giai đoạn</Label>
            <Input
              id="new-phase"
              value={formData.phase}
              onChange={(e) => setFormData({...formData, phase: e.target.value})}
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
                <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
                <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
                <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="new-startDate">Ngày bắt đầu</Label>
            <Input
              id="new-startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-endDate">Ngày kết thúc</Label>
            <Input
              id="new-endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="new-title">Tên giai đoạn</Label>
          <Input
            id="new-title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="new-activities">Các hoạt động (mỗi dòng một hoạt động)</Label>
          <Textarea
            id="new-activities"
            value={formData.activities}
            onChange={(e) => setFormData({...formData, activities: e.target.value})}
            rows={5}
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

// Các component tương tự cho đơn thuốc
const PrescriptionDisplay = ({ prescription, onEdit, isReadOnly }: any) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-lg">{prescription.medicine}</h4>
        <p className="text-sm text-muted-foreground">{prescription.date}</p>
      </div>
      {!isReadOnly && onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
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

const MedicalResultForm = ({ exam, onClose, onSuccess, initialData }: {
  exam: any,
  onClose: () => void,
  onSuccess: () => void,
  initialData?: any // <-- dấu ? để không bắt buộc
}) => {
  const [form, setForm] = useState({
    resultValue: initialData?.resultValue || "",
    resultDate: initialData?.resultDate
      ? (typeof initialData.resultDate === "string"
          ? initialData.resultDate.split("T")[0]
          : new Date(initialData.resultDate).toISOString().split("T")[0])
      : new Date().toISOString().split("T")[0],
    conclusion: initialData?.conclusion || ""
  });

  // Đồng bộ lại state khi initialData thay đổi
  useEffect(() => {
    setForm({
      resultValue: initialData?.resultValue || "",
      resultDate: initialData?.resultDate
        ? (typeof initialData.resultDate === "string"
            ? initialData.resultDate.split("T")[0]
            : new Date(initialData.resultDate).toISOString().split("T")[0])
        : new Date().toISOString().split("T")[0],
      conclusion: initialData?.conclusion || ""
    });
  }, [initialData]);

  useEffect(() => {
    console.log("form state:", form);
  }, [form]);

  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData && !!initialData.resultId;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // Sửa: chỉ gửi các trường resultValue, resultDate, conclusion
        await updateMedicalResult(initialData.resultId, {
          resultValue: form.resultValue,
          resultDate: form.resultDate,
          conclusion: form.conclusion
        });
      } else {
        // Tạo mới: gửi examId + các trường còn lại
        await createMedicalResult({
          examId: Number(exam.examId),
          resultValue: form.resultValue,
          resultDate: form.resultDate,
          conclusion: form.conclusion
        });
      }
      onSuccess?.();
    } catch (err) {
      alert("Lỗi khi lưu kết quả!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={22} />
        </button>
        <h3 className="text-xl font-bold mb-6 text-center">
          {isEdit ? "Sửa kết quả y khoa" : "Nhập kết quả y khoa"}
        </h3>
        {/* Thông tin lần khám */}
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <div><b>Tên lần khám:</b> {exam?.examination || exam?.name || "Không rõ"}</div>
          <div><b>Ngày khám:</b> {exam?.examDate ? exam.examDate.split('T')[0] : ""}</div>
          <div><b>Bác sĩ:</b> {exam?.doctorName || "Chưa rõ"}</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-1 block">Giá trị kết quả</Label>
            <Input
              name="resultValue"
              value={form.resultValue}
              onChange={handleChange}
              required
              placeholder="Nhập giá trị kết quả"
            />
          </div>
          <div>
            <Label className="mb-1 block">Ngày kết quả</Label>
            <Input
              name="resultDate"
              type="date"
              value={form.resultDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label className="mb-1 block">Kết luận</Label>
            <Textarea
              name="conclusion"
              value={form.conclusion}
              onChange={handleChange}
              required
              placeholder="Nhập kết luận"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[80px]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-white min-w-[80px]"
            >
              {loading ? "Đang lưu..." : isEdit ? "Lưu" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
