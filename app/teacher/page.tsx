'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import ClassEditor from '@/components/teacher/ClassEditor';
import StudentManager from '@/components/teacher/StudentManager';
import EvaluationEditor from '@/components/teacher/EvaluationEditor';
import AttendanceManager from '@/components/teacher/AttendanceManager';
import Report from '@/components/parent/Report';

type View = 'class' | 'students' | 'evaluation' | 'attendance' | 'report';

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

export default function TeacherPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('class');
  const [students, setStudents] = useState<Student[]>([]);
  const [info, setInfo] = useState<ClassInfo>({
    teacherName: '',
    grade: '',
    name: '',
    schoolName: '',
    academicYear: '۱۴۰۴–۱۴۰۵',
  });
  const [evals, setEvals] = useState<any[]>([]);
  const [atts, setAtts] = useState<any[]>([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(user);
    if (parsed.role !== 'teacher') {
      router.push('/login');
      return;
    }
    fetchStudents();
    setLoading(false);
  }, [router]);

  async function fetchStudents() {
    try {
      const res = await apiFetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
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

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header info={info} logout={logout} />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        {notice && (
          <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
            {notice}
          </p>
        )}

        <Nav view={view} setView={setView} />

        {view === 'class' && (
          <ClassEditor
            info={info}
            setInfo={setInfo}
            teacherUsername="آموزگار"
            done={() => setNotice('اطلاعات کلاس ذخیره شد.')}
          />
        )}
        {view === 'students' && (
          <StudentManager data={students} setData={setStudents} say={setNotice} />
        )}
        {view === 'evaluation' && (
          <EvaluationEditor
            students={students}
            data={evals}
            setData={setEvals}
            ready={Boolean(info.schoolName)}
            say={setNotice}
          />
        )}
        {view === 'attendance' && (
          <AttendanceManager
            students={students}
            data={atts}
            setData={setAtts}
            ready={Boolean(info.schoolName)}
            say={setNotice}
          />
        )}
        {view === 'report' && (
          <Report
            students={students}
            allStudents={students}
            evaluations={evals}
            attendances={atts}
            parentView={false}
          />
        )}
      </div>
    </main>
  );
}