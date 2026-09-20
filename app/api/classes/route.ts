import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
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
    const body = await req.json();
    const { name, grade, schoolName, academicYear, teacherId } = body;

    if (!name || !grade || !schoolName || !academicYear || !teacherId) {
      return NextResponse.json({ error: 'همه فیلدها لازم است.' }, { status: 400 });
    }

    const cls = await prisma.class.create({
      data: { name, grade, schoolName, academicYear, teacherId },
    });

    return NextResponse.json(cls, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطا در ذخیره کلاس' }, { status: 500 });
  }
}