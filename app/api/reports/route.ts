import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'شناسه دانش‌آموز لازم است.' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        evaluations: { include: { subject: true } },
        attendances: { orderBy: { date: 'desc' } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'دانش‌آموز پیدا نشد.' }, { status: 404 });
    }

    const monthOrder = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت'];

    const monthlyAverages = monthOrder.map((month) => {
      const evals = student.evaluations.filter((e) => e.month === month);
      if (!evals.length) return { month, average: 0 };
      const sum = evals.reduce((s, e) => s + e.activityScore + e.examScore, 0);
      return { month, average: sum / (evals.length * 2) };
    });

    const attendanceSummary = {
      present: student.attendances.filter((a) => a.status === 'PRESENT').length,
      absent: student.attendances.filter((a) => a.status === 'ABSENT').length,
      late: student.attendances.filter((a) => a.status === 'LATE').length,
      excused: student.attendances.filter((a) => a.status === 'EXCUSED').length,
    };

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        fatherName: student.fatherName,
        nationalCode: student.nationalCode,
      },
      class: student.class,
      evaluations: student.evaluations,
      monthlyAverages,
      attendanceSummary,
      attendances: student.attendances,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}