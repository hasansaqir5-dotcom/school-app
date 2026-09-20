import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // آموزگار پیش‌فرض
  const hashedPassword = await bcrypt.hash('kelas1404', 10);
  const teacher = await prisma.user.upsert({
    where: { nationalCode: '0000000000' },
    update: {},
    create: {
      role: 'TEACHER',
      name: 'آموزگار',
      nationalCode: '0000000000',
      password: hashedPassword,
    },
  });
  console.log('✅ آموزگار پیش‌فرض ساخته شد:', teacher.name);

  // ۶ درس
  const subjects = ['ریاضی', 'فارسی', 'علوم', 'مطالعات', 'هدیه', 'قرآن'];
  console.log('✅ دروس آماده:', subjects.join(', '));

  // جملات انگیزشی
  const messages = {
    PROGRESS: [
      'آفرین! تلاش پیوسته‌ات نتیجه داده و هر روز بهتر می‌شوی.',
      'روند زیبای پیشرفتت نشان می‌دهد توانایی‌های زیادی داری.',
      'پیشرفتت عالیه! ادامه بده تا به قله برسی.',
      'هر قدمی که به جلو می‌روی، آینده‌ات رو روشن‌تر می‌کنه.',
      'تلاش امروزت، موفقیت فرداست. آفرین!',
    ],
    STABLE: [
      'مسیرت خوب است؛ با کمی تمرین بیشتر می‌توانی بدرخشی.',
      'پیوستگی در تلاش، راز موفقیت‌های بزرگ است.',
      'ثبات خوبه، ولی می‌تونی بهتر هم باشی!',
      'همینطور ادامه بده، ولی یه کم بیشتر تلاش کن.',
      'پایه‌ات محکمه، حالا وقت اوج گرفتنه.',
    ],
    DECLINE: [
      'هر روز فرصت تازه‌ای برای بهتر شدن است؛ تو از پسش برمی‌آیی.',
      'اشتباه‌ها بخشی از یادگیری‌اند؛ با امید ادامه بده.',
      'نگران نباش، همه ما پستی و بلندی داریم. دوباره بلند شو!',
      'امروز سخت‌تر تلاش کن، فردا نتیجه‌اش رو می‌بینی.',
      'تو می‌تونی! فقط کافیه دوباره شروع کنی.',
    ],
  };

  for (const [type, texts] of Object.entries(messages)) {
    for (const text of texts) {
      await prisma.motivationalMessage.create({
        data: { type, text },
      });
    }
  }
  console.log('✅ جملات انگیزشی اضافه شدند');

  console.log('\n🎉 Seed کامل شد!');
  console.log('\n📌 اطلاعات ورود آموزگار:');
  console.log('   نام کاربری: آموزگار');
  console.log('   رمز عبور: kelas1404');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });