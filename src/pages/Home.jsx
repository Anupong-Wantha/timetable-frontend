import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Users,
  DoorOpen,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
} from 'lucide-react';
import { scheduleAPI, teacherAPI, subjectAPI, roomAPI } from '@/services/api';
import { toast } from 'sonner';

function Home() {
  const [stats, setStats] = useState({
    teachers: 0,
    subjects: 0,
    rooms: 0,
    schedules: 0,
    avgFitnessScore: 0,
    avgExecutionTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentSchedules, setRecentSchedules] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, subjectsRes, roomsRes, statsRes, schedulesRes] = await Promise.all([
        teacherAPI.getAll(),
        subjectAPI.getAll(),
        roomAPI.getAll(),
        scheduleAPI.getStatistics(),
        scheduleAPI.getAll(),
      ]);

      setStats({
        teachers: teachersRes.data.count || 0,
        subjects: subjectsRes.data.count || 0,
        rooms: roomsRes.data.count || 0,
        schedules: statsRes.data.data.total_schedules || 0,
        avgFitnessScore: statsRes.data.data.avg_fitness_score || 0,
        avgExecutionTime: statsRes.data.data.avg_execution_time || 0,
      });

      setRecentSchedules((schedulesRes.data.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              Fast
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ระบบจัดตารางสอนอัตโนมัติ
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            สร้างตารางสอนที่สมบูรณ์แบบด้วย Genetic Algorithm 
            ภายในไม่กี่วินาที ไม่มีข้อขัดแย้ง 100%
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/input">
              <Button size="lg" variant="secondary" className="gap-2">
                <Sparkles className="h-5 w-5" />
                เริ่มต้นใช้งาน
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/schedule">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Calendar className="h-5 w-5 mr-2" />
                ดูตารางที่สร้าง
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ครูผู้สอน"
          value={stats.teachers}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="วิชาที่สอน"
          value={stats.subjects}
          icon={BookOpen}
          color="green"
          loading={loading}
        />
        <StatCard
          title="ห้องเรียน"
          value={stats.rooms}
          icon={DoorOpen}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="ตารางที่สร้าง"
          value={stats.schedules}
          icon={Calendar}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Performance Metrics */}
      {stats.schedules > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fitness Score เฉลี่ย
              </CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.avgFitnessScore.toFixed(1)}/1000
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                คุณภาพตารางที่สร้างโดยเฉลี่ย
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                เวลาในการสร้างเฉลี่ย
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.avgExecutionTime.toFixed(1)}s
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ความเร็วในการประมวลผล
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Users}
          title="จัดการครูและวิชา"
          description="เพิ่มข้อมูลครู วิชาสอน และกำหนดเวลาไม่ว่างได้ง่ายดาย"
          features={[
            'เพิ่มครูและวิชาที่สอน',
            'กำหนดเวลาไม่ว่างของครู',
            'จำกัดชั่วโมงสอนต่อวัน',
          ]}
        />

        <FeatureCard
          icon={DoorOpen}
          title="กำหนดห้องเรียน"
          description="ระบุประเภทห้อง ขนาด และข้อกำหนดพิเศษ"
          features={[
            'ห้องเรียนปกติและ Lab',
            'กำหนดความจุห้อง',
            'จัดสรรห้องตามประเภทวิชา',
          ]}
        />

        <FeatureCard
          icon={Sparkles}
          title="สร้างตารางอัตโนมัติ"
          description="AI จะจัดตารางที่เหมาะสมภายในไม่กี่วินาที"
          features={[
            'ใช้ Genetic Algorithm',
            'ไม่มีข้อขัดแย้ง 100%',
            'Export PDF/Excel ได้',
          ]}
        />
      </div>

      {/* Recent Schedules */}
      {recentSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ตารางล่าสุด
            </CardTitle>
            <CardDescription>
              ตารางสอนที่สร้างล่าสุด 5 ตาราง
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSchedules.map((schedule) => (
                <Link
                  key={schedule.id}
                  to={`/schedule/${schedule.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{schedule.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        สร้างเมื่อ: {new Date(schedule.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant="secondary">
                          Score: {schedule.fitness_score}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {schedule.execution_time}s
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      {stats.teachers === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center max-w-2xl mx-auto">
              <Target className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold mb-2">เริ่มต้นใช้งาน</h3>
              <p className="text-gray-600 mb-6">
                เริ่มต้นด้วยการเพิ่มข้อมูลครู วิชา และห้องเรียน
                แล้วให้ AI สร้างตารางที่สมบูรณ์แบบให้คุณ
              </p>
              <Link to="/input">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  เริ่มเพิ่มข้อมูล
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, loading }) {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, description, features }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default Home;