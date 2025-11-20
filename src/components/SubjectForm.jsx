import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, BookCheck } from 'lucide-react';
import { subjectAPI } from '@/services/api';
import { toast } from 'sonner';

function SubjectForm({ teachers = [], onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    hours_per_week: 2,
    teacher_id: '',
    requires_lab: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.teacher_id) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      const response = await subjectAPI.create({
        ...formData,
        hours_per_week: parseInt(formData.hours_per_week),
        teacher_id: parseInt(formData.teacher_id),
        requires_lab: formData.requires_lab ? 1 : 0 // Convert boolean to 0/1 for backend if needed
      });
      
      if (response.data.success) {
        toast.success('เพิ่มวิชาสำเร็จ!');
        setFormData({
          code: '',
          name: '',
          hours_per_week: 2,
          teacher_id: '',
          requires_lab: false,
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          เพิ่มรายวิชา
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* รหัสวิชา */}
          <div className="space-y-2">
            <Label htmlFor="code">รหัสวิชา *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="ว30101"
              required
            />
          </div>

          {/* ชื่อวิชา */}
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อวิชา *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="วิทยาศาสตร์พื้นฐาน"
              required
            />
          </div>

          {/* จำนวนชั่วโมง */}
          <div className="space-y-2">
            <Label htmlFor="hours">จำนวนชั่วโมง/สัปดาห์</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="10"
              value={formData.hours_per_week}
              onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
              required
            />
          </div>

          {/* ครูผู้สอน */}
          <div className="space-y-2">
            <Label htmlFor="teacher">ครูผู้สอน *</Label>
            <Select 
              value={formData.teacher_id.toString()} 
              onValueChange={(val) => setFormData({ ...formData, teacher_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกครูผู้สอน" />
              </SelectTrigger>
              <SelectContent>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    ยังไม่มีข้อมูลครู
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ต้องการห้อง Lab หรือไม่ */}
          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md bg-slate-50">
            <Label htmlFor="lab-required" className="cursor-pointer flex-1">
              ต้องการห้องปฏิบัติการ (Lab)?
            </Label>
            <Switch
              id="lab-required"
              checked={formData.requires_lab}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_lab: checked })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : (
              <span className="flex items-center gap-2">
                <BookCheck className="h-4 w-4" />
                บันทึกรายวิชา
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SubjectForm;