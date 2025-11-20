import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User } from 'lucide-react';
import { teacherAPI } from '@/services/api';
import { toast } from 'sonner';

function TeacherForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [],
    unavailable_times: [],
    max_hours_per_day: 6,
  });

  const [currentSubject, setCurrentSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('กรุณากรอกชื่อครู');
      return;
    }

    try {
      setLoading(true);
      const response = await teacherAPI.create({
        ...formData,
        subjects: JSON.stringify(formData.subjects),
        unavailable_times: JSON.stringify(formData.unavailable_times),
      });
      
      if (response.data.success) {
        toast.success('เพิ่มครูสำเร็จ!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subjects: [],
          unavailable_times: [],
          max_hours_per_day: 6,
        });
        onSuccess?.();
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    if (currentSubject && !formData.subjects.includes(currentSubject)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, currentSubject]
      });
      setCurrentSubject('');
    }
  };

  const removeSubject = (subject) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subject)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          เพิ่มข้อมูลครู
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อครู */}
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อครู *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="อ.สมชาย ใจดี"
              required
            />
          </div>

          {/* อีเมล */}
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="somchai@example.com"
            />
          </div>

          {/* เบอร์โทร */}
          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="081-234-5678"
            />
          </div>

          {/* วิชาที่สอน */}
          <div className="space-y-2">
            <Label htmlFor="subject">วิชาที่สอน</Label>
            <div className="flex gap-2">
              <Input
                id="subject"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                placeholder="คณิตศาสตร์"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
              />
              <Button type="button" onClick={addSubject} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {subject}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeSubject(subject)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* จำนวนชั่วโมงสูงสุดต่อวัน */}
          <div className="space-y-2">
            <Label htmlFor="max_hours">จำนวนชั่วโมงสูงสุดต่อวัน</Label>
            <Input
              id="max_hours"
              type="number"
              min="1"
              max="8"
              value={formData.max_hours_per_day}
              onChange={(e) => setFormData({ ...formData, max_hours_per_day: parseInt(e.target.value) })}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : 'เพิ่มครู'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default TeacherForm;