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

    const students = await prisma.student.findMany({
      where: {
        class: {
          teacherId: payload.userId,
        },
      },
      orderBy: [
        { lastName: 'asc' },
        { fatherName: 'asc' },
        { firstName: 'asc' },
      ],
    });

    return NextResponse.json(students);
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
    const { firstName, lastName, fatherName, nationalCode, classId } = body;

    if (!firstName || !lastName || !fatherName || !nationalCode) {
      return NextResponse.json(
        { error: 'همه فیلدها لازم است.' },
        { status: 400 }
      );
    }

    // بررسی که کلاس مربوط به این آموزگار باشه
    const cls = await prisma.class.findFirst({
      where: {
        id: classId || '',
        teacherId: payload.userId,
      },
    });

    if (!cls) {
      return NextResponse.json(
        { error: 'کلاس معتبر نیست.' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        fatherName,
        nationalCode,
        classId: cls.id,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'خطا در ذخیره دانش‌آموز' },
      { status: 500 }
    );
  }
}