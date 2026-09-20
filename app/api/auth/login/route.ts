import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, password, nationalCode } = body;

    if (role === 'teacher') {
      const teacher = await prisma.user.findFirst({
        where: { role: 'TEACHER', name },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: 'نام کاربری یا رمز عبور درست نیست.' },
          { status: 401 }
        );
      }

      const ok = await bcrypt.compare(password, teacher.password);
      if (!ok) {
        return NextResponse.json(
          { error: 'نام کاربری یا رمز عبور درست نیست.' },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: teacher.id,
        role: 'teacher',
        name: teacher.name,
      });

      return NextResponse.json({
        token,
        user: { id: teacher.id, name: teacher.name, role: 'teacher' },
      });
    }

    if (role === 'parent') {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { nationalCode },
            { firstName: name },
          ],
        },
        include: { class: true },
      });

      if (!student) {
        return NextResponse.json(
          { error: 'اطلاعات شما توسط آموزگار ثبت نشده است. با آموزگار تماس بگیرید.' },
          { status: 404 }
        );
      }

      const token = signToken({
        userId: student.id,
        role: 'parent',
        name: `${student.firstName} ${student.lastName}`,
      });

      return NextResponse.json({
        token,
        user: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          role: 'parent',
        },
      });
    }

    return NextResponse.json({ error: 'نقش نامعتبر' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}