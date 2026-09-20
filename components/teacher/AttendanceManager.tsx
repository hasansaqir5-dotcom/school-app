'use client';

import { useState } from 'react';
import { Pencil, Save, Search, Trash2 } from 'lucide-react';
import Box from '../ui/Box';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Empty from '../ui/Empty';

type Status = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
};

type Attendance = {
  id: string;
  studentId: string;
  date: string;
  day: string;
  month: string;
  status: Status;
  reason: string;
};

type AttendanceManagerProps = {
  students: Student[];
  data: Attendance[];
  setData: (v: Attendance[]) => void;
  ready: boolean;
  say: (v: string) => void;
};

const months = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت'];
const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const statusLabels: Record<Status, string> = {
  PRESENT: 'حاضر',
  ABSENT: 'غایب',
  LATE: 'تاخیر',
  EXCUSED: 'غیبت موجه',
};

function normalize(v: string) {
  return v
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function toEnglishDigits(v: string) {
  return v.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

export default function AttendanceManager({
  students,
  data,
  setData,
  ready,
  say,
}: AttendanceManagerProps) {
  const [date, setDate] = useState('۱۴۰۴/۰۷/۱۵');
  const [day, setDay] = useState('سه‌شنبه');
  const [month, setMonth] = useState(months[0]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState<Status>('PRESENT');
  const [reason, setReason] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const matching = students.filter((s) =>
    normalize(`${s.firstName} ${s.lastName} ${s.fatherName}`).includes(
      normalize(query)
    )
  );

  const records = data
    .filter((i) => i.month === month)
    .sort((a, b) =>
      toEnglishDigits(b.date).localeCompare(toEnglishDigits(a.date))
    );

  function choose(s: Student) {
    const e = data.find((i) => i.studentId === s.id && i.date === date);
    setSelectedId(s.id);
    setStatus(e?.status ?? 'PRESENT');
    setReason(e?.reason ?? '');
    setEditingId(e?.id ?? null);
  }

  function save() {
    if (!selectedId || !date.trim()) {
      say('تاریخ و دانش‌آموز را انتخاب کنید.');
      return;
    }
    const s = students.find((i) => i.id === selectedId);
    if (!s) return;
    const r: Attendance = {
      id: editingId ?? crypto.randomUUID(),
      studentId: selectedId,
      date,
      day,
      month,
      status,
      reason: reason.trim(),
    };
    setData(editingId ? data.map((i) => (i.id === editingId ? r : i)) : [...data, r]);
    setQuery('');
    setSelectedId('');
    setStatus('PRESENT');
    setReason('');
    setEditingId(null);
    say(`گزارش ${s.firstName} ${s.lastName} ذخیره شد.`);
  }

  if (!ready) {
    return <Empty text="لطفاً ابتدا اطلاعات کلاس را تکمیل کنید." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.4fr]">
      <Box title={editingId ? 'ویرایش گزارش حضور و غیاب' : 'ثبت حضور و غیاب'}>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          وضعیت پیش‌فرض همه دانش‌آموزان «حاضر» است؛ فقط در صورت نیاز، مورد غیبت
          یا تأخیر را ثبت کنید.
        </p>
        <div className="mt-5 space-y-4">
          <Input
            label="تاریخ شمسی"
            value={date}
            set={setDate}
            test="attendance-date"
            placeholder="۱۴۰۴/۰۷/۱۵"
          />
          <Select
            label="روز هفته (انتخاب آموزگار)"
            value={day}
            set={setDay}
            test="attendance-day"
            options={weekDays.map((v) => ({ value: v, label: v }))}
          />
          <div>
            <label className="block text-sm font-bold">
              جستجو و انتخاب دانش‌آموز
            </label>
            <div className="relative mt-2">
              <Search className="absolute right-4 top-3 text-slate-400" size={18} />
              <input
                data-testid="attendance-search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedId('');
                }}
                placeholder="نام، نام خانوادگی یا نام پدر"
                className="min-h-12 w-full rounded-xl border border-slate-200 pr-11 px-4 text-sm"
              />
            </div>
            {query && (
              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border bg-white">
                {matching.map((s) => (
                  <button
                    data-testid={`attendance-pick-${s.id}`}
                    type="button"
                    key={s.id}
                    onClick={() => choose(s)}
                    className="block w-full border-b px-4 py-3 text-right text-sm hover:bg-cyan-50"
                  >
                    {s.firstName} {s.lastName}{' '}
                    <span className="text-slate-400">| {s.fatherName}</span>
                  </button>
                ))}
                {!matching.length && (
                  <p className="p-3 text-sm text-slate-500">دانش‌آموزی پیدا نشد.</p>
                )}
              </div>
            )}
          </div>
          {selectedId && (
            <p className="rounded-xl bg-cyan-50 p-3 text-sm font-bold text-cyan-800">
              دانش‌آموز انتخاب‌شده:{' '}
              {students.find((i) => i.id === selectedId)?.firstName}{' '}
              {students.find((i) => i.id === selectedId)?.lastName}
            </p>
          )}
          <Select
            label="وضعیت"
            value={status}
            set={(v) => setStatus(v as Status)}
            test="attendance-status"
            options={(Object.keys(statusLabels) as Status[]).map((k) => ({
              value: k,
              label: statusLabels[k],
            }))}
          />
          <Input
            label="علت (اختیاری)"
            value={reason}
            set={setReason}
            test="attendance-reason"
            placeholder="مثال: بیماری"
          />
          <button
            data-testid="save-attendance"
            type="button"
            onClick={save}
            className="min-h-12 w-full rounded-xl bg-cyan-700 font-bold text-white"
          >
            <Save className="inline" size={17} />{' '}
            {editingId ? 'ذخیره تغییرات' : 'ثبت گزارش'}
          </button>
        </div>
      </Box>
      <Box title="گزارش‌های ثبت‌شده">
        <Select
          label="مشاهده گزارش ماه"
          value={month}
          set={setMonth}
          test="attendance-month"
          options={months.map((v) => ({ value: v, label: v }))}
        />
        <div className="mt-5 space-y-3">
          {records.map((r) => {
            const s = students.find((i) => i.id === r.studentId);
            return (
              <div
                key={r.id}
                className="flex flex-wrap justify-between gap-3 rounded-2xl border p-4"
              >
                <div>
                  <b>
                    {s ? `${s.firstName} ${s.lastName}` : 'دانش‌آموز حذف‌شده'}
                  </b>
                  <p className="mt-1 text-sm text-slate-600">
                    {r.day} | {r.date} |{' '}
                    <span className="font-bold">{statusLabels[r.status]}</span>
                    {r.reason ? ` | علت: ${r.reason}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid={`edit-attendance-${r.id}`}
                    onClick={() => {
                      setDate(r.date);
                      setDay(r.day);
                      setMonth(r.month);
                      setSelectedId(r.studentId);
                      setStatus(r.status);
                      setReason(r.reason);
                      setEditingId(r.id);
                    }}
                    className="min-h-10 rounded-lg bg-cyan-50 px-3 text-xs text-cyan-700"
                  >
                    <Pencil className="inline" size={14} /> ویرایش
                  </button>
                  <button
                    data-testid={`delete-attendance-${r.id}`}
                    onClick={() => {
                      setData(data.filter((i) => i.id !== r.id));
                      say('گزارش حضور و غیاب حذف شد.');
                    }}
                    className="min-h-10 rounded-lg bg-rose-50 px-3 text-xs text-rose-600"
                  >
                    <Trash2 className="inline" size={14} /> حذف
                  </button>
                </div>
              </div>
            );
          })}
          {!records.length && <Empty text="برای این ماه گزارشی ثبت نشده است." />}
        </div>
      </Box>
    </div>
  );
}