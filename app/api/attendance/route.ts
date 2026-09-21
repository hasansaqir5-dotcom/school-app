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

    const where: { studentId?: string } = {};
    if (studentId) where.studentId = studentId;

    const attendances = await prisma.attendance.findMany({
      where: {
        ...where,
        student: {
          class: {
            teacherId: payload.userId,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(attendances);
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
    const { studentId, date, dayOfWeek, status, reason } = body;

    if (!studentId || !date || !dayOfWeek || !status) {
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

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date,
        dayOfWeek,
        status,
        reason: reason || null,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'خطا در ذخیره حضور' },
      { status: 500 }
    );
  }
}