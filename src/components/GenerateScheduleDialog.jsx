import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Loader2, Play, Settings2 } from 'lucide-react';
import { scheduleAPI } from '@/services/api'; // Make sure to add this to your api.js
import { toast } from 'sonner';

export default function GenerateScheduleDialog({ 
  open, 
  onOpenChange, 
  teachers, 
  subjects, 
  rooms, 
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  
  // Genetic Algorithm Parameters
  const [params, setParams] = useState({
    population_size: 100,
    mutation_rate: 0.01,
    max_generations: 1000,
    elite_size: 2
  });

  const handleGenerate = async () => {
    try {
      setLoading(true);
      
      // Prepare payload
      const payload = {
        teachers,
        subjects,
        rooms,
        parameters: params
      };

      // Call the backend API to start the Genetic Algorithm
      // Ensure scheduleAPI.generate(payload) exists in your services
      await scheduleAPI.generate(payload);
      
      toast.success('สร้างตารางสอนเรียบร้อยแล้ว');
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการสร้างตารางสอน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            ตั้งค่าการประมวลผล
          </DialogTitle>
          <DialogDescription>
            กำหนดค่าพารามิเตอร์สำหรับ Genetic Algorithm เพื่อสร้างตารางสอน
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Summary of Input Data */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="font-bold text-slate-900">{teachers.length}</p>
              <p className="text-slate-500">ครู</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">{subjects.length}</p>
              <p className="text-slate-500">วิชา</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">{rooms.length}</p>
              <p className="text-slate-500">ห้อง</p>
            </div>
          </div>

          <Separator />

          {/* GA Parameters Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pop-size" className="text-right col-span-1">
                Population
              </Label>
              <Input
                id="pop-size"
                type="number"
                value={params.population_size}
                onChange={(e) => setParams({...params, population_size: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="generations" className="text-right col-span-1">
                Generations
              </Label>
              <Input
                id="generations"
                type="number"
                value={params.max_generations}
                onChange={(e) => setParams({...params, max_generations: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mutation" className="text-right col-span-1">
                Mutation Rate
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <Slider
                  value={[params.mutation_rate * 100]}
                  max={100}
                  step={1}
                  onValueChange={(val) => setParams({...params, mutation_rate: val[0] / 100})}
                  className="flex-1"
                />
                <span className="w-12 text-sm text-right">
                  {(params.mutation_rate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            ยกเลิก
          </Button>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังประมวลผล...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                เริ่มสร้างตาราง
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}