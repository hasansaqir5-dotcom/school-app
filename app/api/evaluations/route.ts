import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getTokenFromRequest(req);
    if (!payload || payload.role !== 'teacher') {
      return NextResponse.json(
        { error: 'دسترسی غیرمجاز' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const month = searchParams.get('month');

    // چک اینکه دانش‌آموز به این آموزگار تعلق داره
    if (studentId) {
      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
          class: {
            teacherId: payload.userId,
          },
        },
      });
      if (!student) {
        return NextResponse.json(
          { error: 'دسترسی غیرمجاز' },
          { status: 401 }
        );
      }
    }

    const where: { studentId?: string; month?: string } = {};
    if (studentId) where.studentId = studentId;
    if (month) where.month = month;

    const evaluations = await prisma.evaluation.findMany({
      where: {
        ...where,
        student: {
          class: {
            teacherId: payload.userId,
          },
        },
      },
      include: { subject: true },
    });

    return NextResponse.json(evaluations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getTokenFromRequest(req);
    if (!payload || payload.role !== 'teacher') {
      return NextResponse.json(
        { error: 'دسترسی غیرمجاز' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { studentId, month, scores } = body as {
      studentId: string;
      month: string;
      scores: { subjectId: string; activity: number; exam: number }[];
    };

    if (!studentId || !month || !scores) {
      return NextResponse.json(
        { error: 'اطلاعات ناقص است.' },
        { status: 400 }
      );
    }

    // چک اینکه دانش‌آموز به این آموزگار تعلق داره
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        class: {
          teacherId: payload.userId,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'دسترسی غیرمجاز' },
        { status: 401 }
      );
    }

    await prisma.$transaction(
      scores.map((s) =>
        prisma.evaluation.upsert({
          where: {
            studentId_subjectId_month: {
              studentId,
              subjectId: s.subjectId,
              month,
            },
          },
          update: {
            activityScore: s.activity,
            examScore: s.exam,
          },
          create: {
            studentId,
            subjectId: s.subjectId,
            month,
            activityScore: s.activity,
            examScore: s.exam,
          },
        })
      )
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'خطا در ذخیره ارزشیابی' },
      { status: 500 }
    );
  }
}