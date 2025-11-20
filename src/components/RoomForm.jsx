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
import { DoorOpen, PlusCircle } from 'lucide-react';
import { roomAPI } from '@/services/api';
import { toast } from 'sonner';

function RoomForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    room_number: '',
    building: '',
    capacity: 40,
    room_type: 'lecture', // lecture, lab, hall
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.room_number || !formData.building) {
      toast.error('กรุณากรอกเลขห้องและชื่ออาคาร');
      return;
    }

    try {
      setLoading(true);
      const response = await roomAPI.create({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      
      if (response.data.success) {
        toast.success('เพิ่มห้องเรียนสำเร็จ!');
        setFormData({
          room_number: '',
          building: '',
          capacity: 40,
          room_type: 'lecture',
        });
        onSuccess?.();
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5" />
          เพิ่มห้องเรียน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* เลขห้อง */}
          <div className="space-y-2">
            <Label htmlFor="room_number">หมายเลขห้อง *</Label>
            <Input
              id="room_number"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              placeholder="101, Lab-1"
              required
            />
          </div>

          {/* อาคาร */}
          <div className="space-y-2">
            <Label htmlFor="building">อาคาร/ตึก *</Label>
            <Input
              id="building"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              placeholder="อาคาร 1"
              required
            />
          </div>

          {/* ความจุ */}
          <div className="space-y-2">
            <Label htmlFor="capacity">ความจุ (คน)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>

          {/* ประเภทห้อง */}
          <div className="space-y-2">
            <Label htmlFor="room_type">ประเภทห้อง</Label>
            <Select 
              value={formData.room_type} 
              onValueChange={(val) => setFormData({ ...formData, room_type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">ห้องเรียนปกติ</SelectItem>
                <SelectItem value="lab">ห้องปฏิบัติการ (Lab)</SelectItem>
                <SelectItem value="hall">ห้องประชุม/โรงยิม</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : (
              <span className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                บันทึกห้องเรียน
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default RoomForm;