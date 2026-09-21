import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nationalCode, password } = body;

    // چک فیلدها
    if (!name || !nationalCode || !password) {
      return NextResponse.json(
        { error: 'نام، کد ملی و رمز عبور لازم است.' },
        { status: 400 }
      );
    }

    // چک طول کد ملی
    if (nationalCode.length !== 10) {
      return NextResponse.json(
        { error: 'کد ملی باید ۱۰ رقم باشد.' },
        { status: 400 }
      );
    }

    // چک طول رمز
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' },
        { status: 400 }
      );
    }

    // چک تکراری نبودن کد ملی
    const existing = await prisma.user.findUnique({
      where: { nationalCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'این کد ملی قبلاً ثبت شده است.' },
        { status: 400 }
      );
    }

    // هش رمز
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت آموزگار
    const teacher = await prisma.user.create({
      data: {
        role: 'TEACHER',
        name,
        nationalCode,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        id: teacher.id,
        name: teacher.name,
        nationalCode: teacher.nationalCode,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}