'use client';

import { useState } from 'react';
import Box from '../ui/Box';
import Input from '../ui/Input';

type ClassInfo = {
  teacherName: string;
  grade: string;
  name: string;
  schoolName: string;
  academicYear: string;
};

type ClassEditorProps = {
  info: ClassInfo;
  setInfo: (v: ClassInfo) => void;
  teacherUsername: string;
  done: () => void;
};

export default function ClassEditor({
  info,
  setInfo,
  teacherUsername,
  done,
}: ClassEditorProps) {
  const [draft, setDraft] = useState(info);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(draft).every(Boolean)) {
      setInfo(draft);
      done();
    }
  }

  return (
    <Box title="اطلاعات کلاس">
      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          label="نام آموزگار"
          value={draft.teacherName}
          set={(v) => setDraft({ ...draft, teacherName: v })}
          test="teacher-name"
          placeholder={`مثال: ${teacherUsername}`}
        />
        <Input
          label="پایه"
          value={draft.grade}
          set={(v) => setDraft({ ...draft, grade: v })}
          test="class-grade"
          placeholder="مثال: چهارم"
        />
        <Input
          label="نام کلاس"
          value={draft.name}
          set={(v) => setDraft({ ...draft, name: v })}
          test="class-name"
          placeholder="مثال: کلاس ۱/۲"
        />
        <Input
          label="نام مدرسه"
          value={draft.schoolName}
          set={(v) => setDraft({ ...draft, schoolName: v })}
          test="school-name"
          placeholder="نام مدرسه"
        />
        <Input
          label="سال تحصیلی"
          value={draft.academicYear}
          set={(v) => setDraft({ ...draft, academicYear: v })}
          test="academic-year"
          placeholder="۱۴۰۴–۱۴۰۵"
        />
        <button
          data-testid="save-class"
          className="min-h-12 rounded-xl bg-cyan-700 font-bold text-white sm:col-span-2"
        >
          ذخیره اطلاعات کلاس
        </button>
      </form>
    </Box>
  );
}