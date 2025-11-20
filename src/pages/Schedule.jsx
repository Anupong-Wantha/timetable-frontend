import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { scheduleAPI } from '@/services/api';
import ScheduleTable from '@/components/ScheduleTable'; // ต้องมั่นใจว่าไฟล์นี้อยู่ใน components
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

function Schedule() {
  const { id } = useParams(); // รองรับกรณีดูตาม ID
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      let response;
      
      if (id) {
        // ถ้ามี ID ให้ดึงตารางนั้นๆ
        response = await scheduleAPI.getById(id);
      } else {
        // ถ้าไม่มี ID ดึงตารางล่าสุด หรือทั้งหมด (ขึ้นอยู่กับ Backend API ของคุณ)
        // ในที่นี้สมมติว่าดึงทั้งหมดแล้วเอาอันล่าสุดมาแสดง
        const allSchedules = await scheduleAPI.getAll();
        if (allSchedules.data.data && allSchedules.data.data.length > 0) {
            // สมมติโครงสร้าง data ที่ได้มามี list ของ schedules
            // คุณอาจต้องปรับตรงนี้ตามโครงสร้าง JSON จริงจาก Backend
             const latestId = allSchedules.data.data[0].id;
             response = await scheduleAPI.getById(latestId);
        } else {
            setScheduleData([]);
            setLoading(false);
            return;
        }
      }

      // สมมติว่า response.data.data คือ array ของตารางเรียน
      setScheduleData(response.data.data || []);
      
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error('ไม่สามารถโหลดข้อมูลตารางสอนได้');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!id) return toast.error('ไม่พบรหัสตารางสอน');
    try {
      const response = await scheduleAPI.exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export PDF ล้มเหลว');
    }
  };

  const handleExportExcel = async () => {
    if (!id) return toast.error('ไม่พบรหัสตารางสอน');
    try {
      const response = await scheduleAPI.exportExcel(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule-${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export Excel ล้มเหลว');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">กำลังโหลดตารางสอน...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ตารางสอน</h1>
        <Button variant="outline" onClick={fetchSchedule} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          โหลดข้อมูลใหม่
        </Button>
      </div>

      <ScheduleTable 
        schedule={scheduleData} 
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />
    </div>
  );
}

export default Schedule;