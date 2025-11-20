import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  BookOpen,
  DoorOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import TeacherForm from '@/components/TeacherForm';
import SubjectForm from '@/components/SubjectForm';
import RoomForm from '@/components/RoomForm';
import DataTable from '@/components/DataTable';
import GenerateScheduleDialog from '@/components/GenerateScheduleDialog';
import { teacherAPI, subjectAPI, roomAPI } from '@/services/api';
import { toast } from 'sonner';

function Input() {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [teachersRes, subjectsRes, roomsRes] = await Promise.all([
        teacherAPI.getAll(),
        subjectAPI.getAll(),
        roomAPI.getAll(),
      ]);

      setTeachers(teachersRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
      setRooms(roomsRes.data.data || []);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    const api = type === 'teacher' ? teacherAPI : type === 'subject' ? subjectAPI : roomAPI;
    
    try {
      await api.delete(id);
      toast.success('ลบข้อมูลสำเร็จ');
      fetchAllData();
    } catch (error) {
      toast.error('ไม่สามารถลบข้อมูลได้');
    }
  };

  const canGenerateSchedule = teachers.length > 0 && subjects.length > 0 && rooms.length > 0;

  const teacherColumns = [
    { header: 'ชื่อ', accessor: 'name' },
    { header: 'อีเมล', accessor: 'email' },
    {
      header: 'วิชาที่สอน',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {JSON.parse(row.subjects || '[]').map((subject, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
        </div>
      ),
    },
    { header: 'ชม./วัน', accessor: 'max_hours_per_day', className: 'text-center' },
  ];

  const subjectColumns = [
    { header: 'รหัสวิชา', accessor: 'code' },
    { header: 'ชื่อวิชา', accessor: 'name' },
    { header: 'ชม./สัปดาห์', accessor: 'hours_per_week', className: 'text-center' },
    { header: 'ครูผู้สอน', accessor: 'teacher_name' },
    {
      header: 'ห้อง Lab',
      render: (row) => (
        row.requires_lab ? (
          <Badge variant="default">ต้องการ Lab</Badge>
        ) : (
          <Badge variant="outline">ปกติ</Badge>
        )
      ),
      className: 'text-center',
    },
  ];

  const roomColumns = [
    { header: 'หมายเลขห้อง', accessor: 'room_number' },
    { header: 'อาคาร', accessor: 'building' },
    { header: 'ความจุ', accessor: 'capacity', className: 'text-center' },
    {
      header: 'ประเภท',
      render: (row) => (
        <Badge variant={row.room_type === 'lab' ? 'default' : 'secondary'}>
          {row.room_type === 'lab' ? 'Lab' : row.room_type === 'hall' ? 'ห้องประชุม' : 'ห้องเรียน'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">กรอกข้อมูล</h1>
          <p className="text-gray-600 mt-1">
            เพิ่มข้อมูลครู วิชา และห้องเรียน เพื่อสร้างตารางสอน
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => setShowGenerateDialog(true)}
          disabled={!canGenerateSchedule}
          className="gap-2"
        >
          <Sparkles className="h-5 w-5" />
          สร้างตารางสอน
        </Button>
      </div>

      {/* Alert */}
      {!canGenerateSchedule && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            กรุณาเพิ่มข้อมูลครู วิชา และห้องเรียนอย่างน้อยอย่างละ 1 รายการ
            เพื่อสร้างตารางสอน
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="ครูผู้สอน"
          count={teachers.length}
          icon={Users}
          color="blue"
          isActive={activeTab === 'teachers'}
          onClick={() => setActiveTab('teachers')}
        />
        <SummaryCard
          title="วิชาที่สอน"
          count={subjects.length}
          icon={BookOpen}
          color="green"
          isActive={activeTab === 'subjects'}
          onClick={() => setActiveTab('subjects')}
        />
        <SummaryCard
          title="ห้องเรียน"
          count={rooms.length}
          icon={DoorOpen}
          color="purple"
          isActive={activeTab === 'rooms'}
          onClick={() => setActiveTab('rooms')}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teachers" className="gap-2">
            <Users className="h-4 w-4" />
            ครู ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookOpen className="h-4 w-4" />
            วิชา ({subjects.length})
          </TabsTrigger>
          <TabsTrigger value="rooms" className="gap-2">
            <DoorOpen className="h-4 w-4" />
            ห้อง ({rooms.length})
          </TabsTrigger>
        </TabsList>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TeacherForm onSuccess={fetchAllData} />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>รายการครู</CardTitle>
                  <CardDescription>
                    ครูทั้งหมด {teachers.length} คน
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <DataTable
                      data={teachers}
                      columns={teacherColumns}
                      onDelete={(row) => handleDelete('teacher', row.id)}
                      emptyMessage="ยังไม่มีข้อมูลครู"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SubjectForm 
                teachers={teachers} 
                onSuccess={fetchAllData} 
              />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>รายการวิชา</CardTitle>
                  <CardDescription>
                    วิชาทั้งหมด {subjects.length} วิชา
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <DataTable
                      data={subjects}
                      columns={subjectColumns}
                      onDelete={(row) => handleDelete('subject', row.id)}
                      emptyMessage="ยังไม่มีข้อมูลวิชา"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RoomForm onSuccess={fetchAllData} />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>รายการห้องเรียน</CardTitle>
                  <CardDescription>
                    ห้องทั้งหมด {rooms.length} ห้อง
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <DataTable
                      data={rooms}
                      columns={roomColumns}
                      onDelete={(row) => handleDelete('room', row.id)}
                      emptyMessage="ยังไม่มีข้อมูลห้องเรียน"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for generating schedule */}
      <GenerateScheduleDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        teachers={teachers}
        subjects={subjects}
        rooms={rooms}
        onSuccess={() => {
            toast.success('สร้างตารางสอนเสร็จสิ้น');
            setShowGenerateDialog(false);
            // Optional: Redirect to results page
        }}
      />
    </div>
  );
}

// Helper Component for the top summary cards
function SummaryCard({ title, count, icon: Icon, color, isActive, onClick }) {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const borderStyle = isActive 
    ? `ring-2 ring-offset-2 ${
        color === 'blue' ? 'ring-blue-500' : 
        color === 'green' ? 'ring-green-500' : 'ring-purple-500'
      }` 
    : '';

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${borderStyle}`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{count}</h3>
        </div>
        <div className={`p-3 rounded-full ${colorStyles[color] || 'bg-gray-100'}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

export default Input;