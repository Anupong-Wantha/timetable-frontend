import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, FileInput, Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner'; // <--- เพิ่ม import นี้

import Home from './pages/Home';
import Input from './pages/Input';
import Schedule from './pages/Schedule'; // <--- ตรวจสอบว่าไฟล์นี้มีอยู่จริงตามข้อ 1
import { Button } from '@/components/ui/button';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/input" element={<Input />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/:id" element={<Schedule />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" /> {/* <--- เพิ่มบรรทัดนี้ */}
      </div>
    </Router>
  );
}

// ... (Navbar และ Footer ใช้โค้ดเดิมของคุณได้เลย)
function Navbar() {
    // ... โค้ดเดิม
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
  
    const isActive = (path) => location.pathname === path;
  
    const navLinks = [
      { path: '/', label: 'หน้าแรก', icon: HomeIcon },
      { path: '/input', label: 'กรอกข้อมูล', icon: FileInput },
      { path: '/schedule', label: 'ตารางสอน', icon: Calendar },
    ];
  
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ระบบจัดตารางสอน
                </div>
                <div className="text-xs text-gray-500">AI-Powered Timetable System</div>
              </div>
            </Link>
  
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path}>
                    <Button
                      variant={isActive(link.path) ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
  
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
  
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(link.path) ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
  
  function Footer() {
    return (
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 ระบบจัดตารางสอนอัตโนมัติ</p>
            <p className="mt-1">Powered by Genetic Algorithm & AI</p>
          </div>
        </div>
      </footer>
    );
  }

export default App;