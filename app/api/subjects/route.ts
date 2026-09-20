import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    const where = classId ? { classId } : {};

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(subjects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, classId } = body;

    if (!name || !classId) {
      return NextResponse.json({ error: 'نام درس و کلاس لازم است.' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: { name, classId },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطا در ذخیره درس' }, { status: 500 });
  }
}