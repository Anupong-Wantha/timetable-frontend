import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, Calendar, Users, DoorOpen } from 'lucide-react';
import { toast } from 'sonner';

function ScheduleTable({ schedule, onExportPDF, onExportExcel }) {
  const [viewType, setViewType] = useState('grid');

  if (!schedule || schedule.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">ยังไม่มีตารางสอน</p>
          <p className="text-sm mt-2">กรุณาสร้างตารางก่อนดูผลลัพธ์</p>
        </CardContent>
      </Card>
    );
  }

  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
  const dayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
  
  // Get unique times
  const times = [...new Set(schedule.map(item => item.time))].sort();

  // Build grid
  const grid = times.map(time => {
    const row = { time, days: [] };
    
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(day => {
      const timeslot = `${day}-${time}`;
      const item = schedule.find(s => s.timeslot === timeslot);
      row.days.push(item || null);
    });
    
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            ตารางสอน
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportExcel}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              พิมพ์
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={viewType} onValueChange={setViewType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grid">
              <Calendar className="mr-2 h-4 w-4" />
              ตารางรวม
            </TabsTrigger>
            <TabsTrigger value="teacher">
              <Users className="mr-2 h-4 w-4" />
              ตามครู
            </TabsTrigger>
            <TabsTrigger value="room">
              <DoorOpen className="mr-2 h-4 w-4" />
              ตามห้อง
            </TabsTrigger>
            <TabsTrigger value="subject">
              ตามวิชา
            </TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid" className="mt-4">
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="border p-3 font-semibold text-left w-24">เวลา</th>
                    {days.map((day, index) => (
                      <th key={index} className="border p-3 font-semibold text-center">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      <td className="border p-3 font-semibold bg-muted/30">
                        {row.time}
                      </td>
                      {row.days.map((item, dayIdx) => (
                        <td key={dayIdx} className="border p-3">
                          {item ? (
                            <div className="bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                              <div className="font-semibold text-blue-900 text-sm">
                                {item.subject_name}
                              </div>
                              <div className="text-xs text-gray-700 mt-1 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {item.teacher_name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <DoorOpen className="h-3 w-3" />
                                {item.room_number}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-300 text-center">-</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Other views... */}
          <TabsContent value="teacher">
            <p className="text-center py-8 text-muted-foreground">
              View by Teacher - Coming soon
            </p>
          </TabsContent>

          <TabsContent value="room">
            <p className="text-center py-8 text-muted-foreground">
              View by Room - Coming soon
            </p>
          </TabsContent>

          <TabsContent value="subject">
            <p className="text-center py-8 text-muted-foreground">
              View by Subject - Coming soon
            </p>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {schedule.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                คาบเรียนทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {[...new Set(schedule.map(s => s.teacher_id))].length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ครูที่สอน
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {[...new Set(schedule.map(s => s.room_id))].length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ห้องที่ใช้
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScheduleTable;