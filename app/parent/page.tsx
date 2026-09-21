'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Header from '@/components/Header';
import Report from '@/components/parent/Report';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
};

type ClassInfo = {
  teacherName: string;
  grade: string;
  name: string;
  schoolName: string;
  academicYear: string;
};

export default function ParentPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [info, setInfo] = useState<ClassInfo>({
    teacherName: '',
    grade: '',
    name: '',
    schoolName: '',
    academicYear: '۱۴۰۴–۱۴۰۵',
  });
  const [evals, setEvals] = useState<any[]>([]);
  const [atts, setAtts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'parent') {
      router.push('/login');
      return;
    }
    setStudent({
      id: user.id,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      fatherName: '',
      nationalCode: '',
    });
    fetchReport(user.id);
  }, [router]);

  async function fetchReport(studentId: string) {
    try {
      const res = await apiFetch(`/api/reports?studentId=${studentId}`);
      const data = await res.json();
      if (data.class) setInfo(data.class);
      if (data.evaluations) {
        setEvals(
          data.evaluations.map((e: any) => ({
            studentId: e.studentId,
            month: e.month,
            subject: e.subject?.name || e.subject,
            activity: e.activityScore,
            exam: e.examScore,
          }))
        );
      }
      if (data.attendances) {
        setAtts(
          data.attendances.map((a: any) => ({
            id: a.id,
            studentId: a.studentId,
            date: a.date,
            day: a.dayOfWeek,
            status: a.status,
            reason: a.reason || '',
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-rose-600 font-bold mb-4">اطلاعات شما یافت نشد.</p>
          <button onClick={logout} className="text-cyan-700 font-bold">
            بازگشت به ورود
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header info={info} logout={logout} />

      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <Report
          students={[student]}
          allStudents={[student]}
          evaluations={evals}
          attendances={atts}
          parentView={true}
        />
      </div>
    </main>
  );
}