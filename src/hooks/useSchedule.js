import { useState, useCallback } from 'react';
import { scheduleAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all schedules
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getAll();
      setSchedules(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('ไม่สามารถโหลดตารางได้');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch schedule by ID
  const fetchScheduleById = useCallback(async (id, viewType = 'grid') => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getById(id, viewType);
      setCurrentSchedule(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      toast.error('ไม่สามารถโหลดตารางได้');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate schedule
  const generateSchedule = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await scheduleAPI.generate(data);
      
      if (response.data.success) {
        toast.success('สร้างตารางสำเร็จ!');
        await fetchSchedules(); // Refresh list
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error(`เกิดข้อผิดพลาด: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSchedules]);

  // Delete schedule
  const deleteSchedule = useCallback(async (id) => {
    try {
      setLoading(true);
      await scheduleAPI.delete(id);
      toast.success('ลบตารางสำเร็จ');
      await fetchSchedules();
      return true;
    } catch (err) {
      toast.error('ไม่สามารถลบตารางได้');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSchedules]);

  // Export PDF
  const exportPDF = useCallback(async (id, filename) => {
    try {
      const response = await scheduleAPI.exportPDF(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `schedule_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('ดาวน์โหลด PDF สำเร็จ');
    } catch (err) {
      toast.error('ไม่สามารถ Export PDF ได้');
    }
  }, []);

  // Export Excel
  const exportExcel = useCallback(async (id, filename) => {
    try {
      const response = await scheduleAPI.exportExcel(id);
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `schedule_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('ดาวน์โหลด Excel สำเร็จ');
    } catch (err) {
      toast.error('ไม่สามารถ Export Excel ได้');
    }
  }, []);

  return {
    schedules,
    currentSchedule,
    loading,
    error,
    fetchSchedules,
    fetchScheduleById,
    generateSchedule,
    deleteSchedule,
    exportPDF,
    exportExcel,
  };
};