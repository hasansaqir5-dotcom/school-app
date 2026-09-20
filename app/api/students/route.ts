import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
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
    const body = await req.json();
    const { firstName, lastName, fatherName, nationalCode, classId } = body;

    if (!firstName || !lastName || !fatherName || !nationalCode) {
      return NextResponse.json({ error: 'همه فیلدها لازم است.' }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        fatherName,
        nationalCode,
        classId: classId || '',
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطا در ذخیره دانش‌آموز' }, { status: 500 });
  }
}