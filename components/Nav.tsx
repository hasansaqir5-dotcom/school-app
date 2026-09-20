'use client';

import {
  CalendarCheck2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';

type View = 'class' | 'students' | 'evaluation' | 'attendance' | 'report';

type NavProps = {
  view: View;
  setView: (v: View) => void;
};

const links: [View, string, typeof Users][] = [
  ['class', 'کلاس', GraduationCap],
  ['students', 'دانش‌آموزان', Users],
  ['evaluation', 'ارزشیابی', ClipboardList],
  ['attendance', 'حضور و غیاب', CalendarCheck2],
  ['report', 'کارنامه', Sparkles],
];

export default function Nav({ view, setView }: NavProps) {
  return (
    <nav className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 sm:grid-cols-5">
      {links.map(([id, title, Icon]) => (
        <button
          key={id}
          data-testid={`nav-${id}`}
          onClick={() => setView(id)}
          className={`min-h-12 rounded-xl text-xs font-bold ${
            view === id
              ? 'bg-cyan-700 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Icon className="mx-auto mb-1" size={16} />
          {title}
        </button>
      ))}
    </nav>
  );
}