'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Box from '../ui/Box';
import Select from '../ui/Select';
import Empty from '../ui/Empty';

type Score = 1 | 2 | 3 | 4;

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

type EvaluationEditorProps = {
  students: Student[];
  data: any[];
  setData: (v: any[]) => void;
  ready: boolean;
  say: (v: string) => void;
};

const subjects = ['ریاضی', 'فارسی', 'علوم', 'مطالعات', 'هدیه', 'قرآن'];
const months = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت'];
const scoreLabels: Record<number, string> = {
  4: 'خیلی خوب',
  3: 'خوب',
  2: 'قابل قبول',
  1: 'نیاز به تلاش',
};

export default function EvaluationEditor({
  students,
  data,
  setData,
  ready,
  say,
}: EvaluationEditorProps) {
  const [id, setId] = useState('');
  const [month, setMonth] = useState(months[0]);
  const [scores, setScores] = useState<Record<string, { activity: Score; exam: Score }>>({});

  useEffect(() => {
    const n: Record<string, { activity: Score; exam: Score }> = {};
    subjects.forEach((s) => {
      const e = data.find(
        (i) => i.studentId === id && i.month === month && i.subject === s
      );
      n[s] = { activity: e?.activity ?? 4, exam: e?.exam ?? 4 };
    });
    setScores(n);
  }, [id, month, data]);

  if (!ready) {
    return <Empty text="لطفاً ابتدا اطلاعات کلاس را تکمیل کنید." />;
  }

  return (
    <Box title="ثبت ارزشیابی ماهانه">
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="دانش‌آموز"
          value={id}
          set={setId}
          test="evaluation-student"
          options={[
            { value: '', label: 'انتخاب کنید' },
            ...students.map((s) => ({
              value: s.id,
              label: `${s.firstName} ${s.lastName}`,
            })),
          ]}
        />
        <Select
          label="ماه"
          value={month}
          set={setMonth}
          test="evaluation-month"
          options={months.map((v) => ({ value: v, label: v }))}
        />
      </div>
      {id ? (
        <>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[550px] text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">درس</th>
                  <th>فعالیت و پرسش کلاسی</th>
                  <th>آزمون مداد کاغذی</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s} className="border-b">
                    <td className="p-3 font-bold">{s}</td>
                    <td>
                      <ScoreSelect
                        value={scores[s]?.activity ?? 4}
                        set={(v) =>
                          setScores({
                            ...scores,
                            [s]: { ...scores[s], activity: v },
                          })
                        }
                      />
                    </td>
                    <td>
                      <ScoreSelect
                        value={scores[s]?.exam ?? 4}
                        set={(v) =>
                          setScores({
                            ...scores,
                            [s]: { ...scores[s], exam: v },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            data-testid="save-evaluation"
            onClick={() => {
              setData([
                ...data.filter((i) => i.studentId !== id || i.month !== month),
                ...subjects.map((s) => ({
                  studentId: id,
                  month,
                  subject: s,
                  ...scores[s],
                })),
              ]);
              say('ارزشیابی ماهانه ذخیره شد.');
            }}
            className="mt-6 min-h-12 rounded-xl bg-cyan-700 px-6 font-bold text-white"
          >
            <Save className="inline" size={17} /> ذخیره ارزشیابی
          </button>
        </>
      ) : (
        <Empty
          text={
            students.length
              ? 'دانش‌آموز را انتخاب کنید.'
              : 'ابتدا دانش‌آموز ثبت کنید.'
          }
        />
      )}
    </Box>
  );
}

function ScoreSelect({ value, set }: { value: Score; set: (v: Score) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => set(Number(e.target.value) as Score)}
      className="min-h-10 rounded-lg border bg-white px-2 text-xs"
    >
      {([4, 3, 2, 1] as Score[]).map((s) => (
        <option key={s} value={s}>
          {scoreLabels[s]}
        </option>
      ))}
    </select>
  );
}