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

    const classes = await prisma.class.findMany({
      where: {
        teacherId: payload.userId,
      },
      include: {
        teacher: true,
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(classes);
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
    const { name, grade, schoolName, academicYear } = body;

    if (!name || !grade || !schoolName || !academicYear) {
      return NextResponse.json(
        { error: 'همه فیلدها لازم است.' },
        { status: 400 }
      );
    }

    const cls = await prisma.class.create({
      data: {
        name,
        grade,
        schoolName,
        academicYear,
        teacherId: payload.userId,
      },
    });

    return NextResponse.json(cls, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'خطا در ذخیره کلاس' },
      { status: 500 }
    );
  }
}