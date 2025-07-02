
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PatientProfileProps {
  patient: any;
  isOpen: boolean;
  onClose: () => void;
}

const PatientProfile = ({ patient, isOpen, onClose }: PatientProfileProps) => {
  if (!patient) return null;

  // Mock data cho hồ sơ bệnh nhân
  const testResults = [
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
  ];

  const prescriptions = [
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
  ];

  const examResults = [
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
  ];

  const treatmentPlan = [
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
  ];

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
                  <CardTitle>Kết quả xét nghiệm</CardTitle>
                  <CardDescription>Danh sách các xét nghiệm và kết quả</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testResults.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{test.type}</h4>
                            <p className="text-sm text-muted-foreground">{test.date}</p>
                          </div>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn thuốc</CardTitle>
                  <CardDescription>Danh sách thuốc đã kê và hướng dẫn sử dụng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{prescription.medicine}</h4>
                            <p className="text-sm text-muted-foreground">{prescription.date}</p>
                          </div>
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examinations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả khám bệnh</CardTitle>
                  <CardDescription>Các lần khám bệnh và kết quả chẩn đoán</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {examResults.map((exam) => (
                      <div key={exam.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{exam.examination}</h4>
                            <p className="text-sm text-muted-foreground">{exam.date} • {exam.doctor}</p>
                          </div>
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
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{phase.phase}: {phase.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {phase.startDate} - {phase.endDate}
                            </p>
                          </div>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Các hoạt động:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {phase.activities.map((activity, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
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

export default PatientProfile;
