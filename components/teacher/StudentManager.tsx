'use client';

import { FormEvent, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Box from '../ui/Box';
import Input from '../ui/Input';
import Empty from '../ui/Empty';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
};

type StudentManagerProps = {
  data: Student[];
  setData: (v: Student[]) => void;
  say: (v: string) => void;
};

function normalize(v: string) {
  return v
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normalizeCode(v: string) {
  return v
    .replace(/[^0-9۰-۹]/g, '')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

function sortStudents(v: Student[]) {
  return [...v].sort(
    (a, b) =>
      normalize(a.lastName).localeCompare(normalize(b.lastName), 'fa') ||
      normalize(a.fatherName).localeCompare(normalize(b.fatherName), 'fa') ||
      normalize(a.firstName).localeCompare(normalize(b.firstName), 'fa')
  );
}

export default function StudentManager({ data, setData, say }: StudentManagerProps) {
  const [draft, setDraft] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    nationalCode: '',
  });
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const filtered = data.filter((s) =>
    normalize(`${s.firstName} ${s.lastName} ${s.fatherName}`).includes(normalize(query))
  );

  function save(e: FormEvent) {
    e.preventDefault();
    if (
      Object.values(draft).some((v) => !v) ||
      normalizeCode(draft.nationalCode).length !== 10
    ) {
      say('همه اطلاعات را کامل کنید؛ کد ملی باید ۱۰ رقم باشد.');
      return;
    }
    const clean = { ...draft, nationalCode: normalizeCode(draft.nationalCode) };
    setData(
      editing
        ? data.map((s) => (s.id === editing ? { ...clean, id: editing } : s))
        : [...data, { ...clean, id: crypto.randomUUID() }]
    );
    setDraft({ firstName: '', lastName: '', fatherName: '', nationalCode: '' });
    setEditing(null);
    say('اطلاعات دانش‌آموز ذخیره شد.');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.4fr]">
      <Box title={editing ? 'ویرایش دانش‌آموز' : 'افزودن دانش‌آموز'}>
        <form onSubmit={save} className="mt-5 space-y-3">
          <Input
            label="نام"
            value={draft.firstName}
            set={(v) => setDraft({ ...draft, firstName: v })}
            test="student-first"
            placeholder="نام"
          />
          <Input
            label="نام خانوادگی"
            value={draft.lastName}
            set={(v) => setDraft({ ...draft, lastName: v })}
            test="student-last"
            placeholder="نام خانوادگی"
          />
          <Input
            label="نام پدر"
            value={draft.fatherName}
            set={(v) => setDraft({ ...draft, fatherName: v })}
            test="student-father"
            placeholder="نام پدر"
          />
          <Input
            label="کد ملی"
            value={draft.nationalCode}
            set={(v) =>
              setDraft({ ...draft, nationalCode: normalizeCode(v).slice(0, 10) })
            }
            test="student-code"
            placeholder="۱۰ رقم"
          />
          <button
            data-testid="save-student"
            className="min-h-12 w-full rounded-xl bg-cyan-700 font-bold text-white"
          >
            <Plus className="inline" size={17} /> ذخیره دانش‌آموز
          </button>
        </form>
      </Box>

      <Box title="فهرست دانش‌آموزان">
        <p
          data-testid="class-count"
          className="mt-2 rounded-xl bg-cyan-50 p-3 text-sm font-bold text-cyan-800"
        >
          آمار کلاس: {data.length.toLocaleString('fa-IR')} دانش‌آموز
        </p>
        <p className="mt-2 text-xs text-slate-500">
          ترتیب فهرست: نام خانوادگی و سپس نام پدر
        </p>
        <div className="relative mt-4">
          <Search className="absolute right-4 top-3 text-slate-400" size={18} />
          <input
            data-testid="student-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو با نام، نام خانوادگی یا نام پدر"
            className="min-h-12 w-full rounded-xl bg-slate-100 pr-11 px-4 text-sm"
          />
        </div>
        <div className="mt-4 space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap justify-between gap-3 rounded-2xl border p-4"
            >
              <span>
                <b>
                  {s.firstName} {s.lastName}
                </b>
                <small className="mr-2 text-slate-500">
                  پدر: {s.fatherName} | کد ملی: {s.nationalCode}
                </small>
              </span>
              <span className="flex gap-2">
                <button
                  data-testid={`edit-student-${s.id}`}
                  onClick={() => {
                    setDraft(s);
                    setEditing(s.id);
                  }}
                  className="rounded-lg bg-cyan-50 px-3 text-xs text-cyan-700"
                >
                  ویرایش
                </button>
                <button
                  data-testid={`delete-student-${s.id}`}
                  onClick={() => {
                    setData(data.filter((i) => i.id !== s.id));
                    say('دانش‌آموز حذف شد.');
                  }}
                  className="rounded-lg bg-rose-50 px-3 text-xs text-rose-600"
                >
                  حذف
                </button>
              </span>
            </div>
          ))}
          {!data.length && <Empty text="هنوز دانش‌آموزی ثبت نشده است." />}
        </div>
      </Box>
    </div>
  );
}