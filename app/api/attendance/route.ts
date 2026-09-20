import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    const where = studentId ? { studentId } : {};

    const attendances = await prisma.attendance.findMany({
      where,
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
    const body = await req.json();
    const { studentId, date, dayOfWeek, status, reason } = body;

    if (!studentId || !date || !dayOfWeek || !status) {
      return NextResponse.json({ error: 'اطلاعات ناقص است.' }, { status: 400 });
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
    return NextResponse.json({ error: 'خطا در ذخیره حضور' }, { status: 500 });
  }
}