'use client';

import { BookOpen, LogOut } from 'lucide-react';

type ClassInfo = {
  teacherName: string;
  grade: string;
  name: string;
  schoolName: string;
  academicYear: string;
};

type HeaderProps = {
  info: ClassInfo;
  logout: () => void;
};

export default function Header({ info, logout }: HeaderProps) {
  const displayText = info.schoolName
    ? `${info.schoolName} | پایه ${info.grade} | ${info.name} | ${info.academicYear}`
    : 'سامانه ارزشیابی توصیفی';

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-black text-cyan-800">
            <BookOpen size={20} />
            {displayText}
          </p>
          <small className="text-slate-500">
            آموزگار: {info.teacherName || 'تکمیل نشده'}
          </small>
        </div>
        <button
          data-testid="logout"
          onClick={logout}
          className="flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          خروج
        </button>
      </div>
    </header>
  );
}