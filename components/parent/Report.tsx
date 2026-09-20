'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '../ui/Box';
import Select from '../ui/Select';
import Empty from '../ui/Empty';
import Trend from './Trend';
import AttendanceReport from './AttendanceReport';

type Score = 1 | 2 | 3 | 4;

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
};

type Evaluation = {
  studentId: string;
  month: string;
  subject: string;
  activity: Score;
  exam: Score;
};

type Attendance = {
  id: string;
  studentId: string;
  date: string;
  day: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  reason: string;
};

type ReportProps = {
  students: Student[];
  allStudents: Student[];
  evaluations: Evaluation[];
  attendances: Attendance[];
  parentView: boolean;
};

const months = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت'];
const subjects = ['ریاضی', 'فارسی', 'علوم', 'مطالعات', 'هدیه', 'قرآن'];
const scoreLabels: Record<Score, string> = {
  1: 'نیاز به تلاش',
  2: 'قابل قبول',
  3: 'خوب',
  4: 'خیلی خوب',
};

function average(v: Evaluation[]) {
  return v.length ? v.reduce((s, e) => s + e.activity + e.exam, 0) / (v.length * 2) : 0;
}

function ordinal(v: number) {
  return v === 1 ? 'اول' : v === 2 ? 'دوم' : v === 3 ? 'سوم' : `${v}م`;
}

export default function Report({
  students,
  allStudents,
  evaluations,
  attendances,
  parentView,
}: ReportProps) {
  const [id, setId] = useState(students[0]?.id ?? '');
  const [month, setMonth] = useState(months[0]);

  useEffect(() => setId(students[0]?.id ?? ''), [students]);

  const student = students.find((s) => s.id === id);
  const entries = evaluations.filter((e) => e.studentId === id && e.month === month);
  const total = average(entries);

  const trend = useMemo(
    () =>
      months
        .slice(0, months.indexOf(month) + 1)
        .map((m) => ({
          month: m,
          score: average(evaluations.filter((e) => e.studentId === id && e.month === m)),
        }))
        .filter((i) => i.score > 0),
    [id, month, evaluations]
  );

  const rankings = allStudents
    .map((s) => ({
      id: s.id,
      score: average(evaluations.filter((e) => e.studentId === s.id && e.month === month)),
      entries: evaluations.filter((e) => e.studentId === s.id && e.month === month).length,
    }))
    .filter((r) => r.entries > 0)
    .sort((a, b) => b.score - a.score);

  const current = rankings.find((r) => r.id === id);
  const rank = current ? rankings.filter((r) => r.score > current.score).length + 1 : 0;
  const tied = current ? rankings.filter((r) => r.score === current.score).length : 0;
  const tieText =
    tied > 1
      ? `شما و ${(tied - 1).toLocaleString('fa-IR')} دانش‌آموز دیگر در این رتبه مشترک هستید.`
      : '';

  const allAttendance = attendances
    .filter((a) => a.studentId === id && a.status !== 'PRESENT')
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Box title={parentView ? 'کارنامه فرزند شما' : 'کارنامه و روند تحصیلی'}>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {!parentView && (
          <Select
            label="دانش‌آموز"
            value={id}
            set={setId}
            test="report-student"
            options={students.map((s) => ({
              value: s.id,
              label: `${s.firstName} ${s.lastName}`,
            }))}
          />
        )}
        <Select
          label="ماه"
          value={month}
          set={setMonth}
          test="report-month"
          options={months.map((v) => ({ value: v, label: v }))}
        />
      </div>

      {student ? (
        <div
          data-testid="report-card"
          className="mt-7 overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-5 sm:p-8"
        >
          <div className="flex flex-wrap justify-between gap-3 border-b border-cyan-100 pb-5">
            <div>
              <p className="text-xs font-bold text-cyan-700">کارنامه ماهانه</p>
              <h3 className="mt-1 text-2xl font-black">
                {student.firstName} {student.lastName}
              </h3>
            </div>
            <span className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white">
              {month}
            </span>
          </div>

          {entries.length ? (
            <>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-right">درس</th>
                      <th>فعالیت کلاسی</th>
                      <th>آزمون مداد کاغذی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => {
                      const e = entries.find((i) => i.subject === s);
                      return (
                        <tr className="border-b border-cyan-100/70" key={s}>
                          <td className="p-3 font-bold">{s}</td>
                          <td>{e ? scoreLabels[e.activity] : '—'}</td>
                          <td>{e ? scoreLabels[e.exam] : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-500">معدل کل ماه</p>
                  <p
                    data-testid="month-average"
                    className="mt-1 text-4xl font-black text-cyan-700"
                  >
                    {total.toFixed(2)} <span className="text-sm">از ۴</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5">
                  <p className="text-sm text-amber-800">
                    رتبه در کلاس (عملکرد {month})
                  </p>
                  <p
                    data-testid="student-rank"
                    className="mt-2 text-lg font-black leading-8 text-amber-900"
                  >
                    {rank
                      ? `شما در رتبه ${ordinal(rank)} از ${rankings.length.toLocaleString('fa-IR')} دانش‌آموز دارای ارزشیابی قرار گرفته‌اید`
                      : 'رتبه‌ای ثبت نشده است'}
                  </p>
                  {tieText && (
                    <p
                      data-testid="shared-rank"
                      className="mt-2 rounded-xl bg-amber-100 p-3 text-sm font-bold leading-7 text-amber-900"
                    >
                      {tieText}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl bg-[#155e75] p-5 text-white">
                  <p className="text-sm text-cyan-100">پیام انگیزشی</p>
                  <p
                    data-testid="motivational-message"
                    className="mt-2 font-bold leading-8"
                  >
                    {total > 3 ? 'آفرین! روند زیبای پیشرفتت نشان می‌دهد توانایی‌های زیادی داری.' : 'هر روز فرصت تازه‌ای برای بهتر شدن است؛ تو از پسش برمی‌آیی.'}
                  </p>
                </div>
              </div>

              <Trend trend={trend} />
              <AttendanceReport records={allAttendance} />
            </>
          ) : (
            <Empty text="برای این ماه هنوز ارزشیابی ثبت نشده است." />
          )}
        </div>
      ) : (
        <Empty text="دانش‌آموزی برای نمایش وجود ندارد." />
      )}
    </Box>
  );
}