type Attendance = {
  id: string;
  studentId: string;
  date: string;
  day: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  reason: string;
};

type AttendanceReportProps = {
  records: Attendance[];
};

const statusLabels: Record<string, string> = {
  PRESENT: 'حاضر',
  ABSENT: 'غایب',
  LATE: 'تاخیر',
  EXCUSED: 'غیبت موجه',
};

export default function AttendanceReport({ records }: AttendanceReportProps) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5">
      <p className="font-black">گزارش حضور و غیاب سال تحصیلی</p>
      <p className="mt-1 text-sm text-slate-500">
        گزارش‌های ثبت‌شده از مهر تا پایان اردیبهشت
      </p>
      {records.length ? (
        <div data-testid="attendance-full-report" className="mt-4 space-y-3">
          {records.map((i) => (
            <p
              key={i.id}
              className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"
            >
              <b>{statusLabels[i.status]}</b> | {i.day} | {i.date}
              {i.reason ? ` | علت: ${i.reason}` : ''}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          هیچ گزارش غیبت، تأخیر یا غیبت موجهی برای این دانش‌آموز ثبت نشده است.
        </p>
      )}
    </div>
  );
}