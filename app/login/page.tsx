'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

type Role = 'teacher' | 'parent';
type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('teacher');
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName('');
    setNationalCode('');
    setPassword('');
    setError('');
    setSuccess('');
  }

  function changeRole(newRole: Role) {
    setRole(newRole);
    setMode('login');
    resetForm();
  }

  // ───────────────────────────────
  // ارسال فرم
  // ───────────────────────────────
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // ثبت‌نام آموزگار
      if (mode === 'register' && role === 'teacher') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, nationalCode, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'خطا در ثبت‌نام');
          setLoading(false);
          return;
        }

        setSuccess('حساب شما با موفقیت ساخته شد. اکنون وارد شوید.');
        setMode('login');
        setName('');
        setPassword('');
        setLoading(false);
        return;
      }

      // ورود
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          nationalCode,
          password: role === 'teacher' ? password : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'خطا در ورود');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (role === 'teacher') router.push('/teacher');
      else router.push('/parent');
    } catch {
      setError('خطا در ارتباط با سرور');
      setLoading(false);
    }
  }

  // ───────────────────────────────
  // نمایش
  // ───────────────────────────────
  const title = mode === 'register'
    ? 'ایجاد حساب آموزگار'
    : 'ورود به سامانه';

  const buttonText = loading
    ? 'در حال ارسال...'
    : mode === 'register'
      ? 'ساخت حساب'
      : 'ورود به سامانه';

  return (
    <main className="min-h-screen bg-cyan-50 p-4 py-10">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-xl lg:grid-cols-2">
        {/* بخش چپ: معرفی */}
        <aside className="relative flex min-h-80 flex-col bg-[#155e75] p-9 text-white sm:p-14">
          <GraduationCap size={45} />
          <p className="mt-12 text-cyan-200">همراه آموزگار و خانواده</p>
          <h1 className="mt-3 text-4xl font-black leading-relaxed">
            رشد روشن
            <br />
            برای هر دانش‌آموز
          </h1>
          <p className="mt-4 leading-8 text-cyan-50">
            ارزشیابی توصیفی، حضور و غیاب و کارنامه ماهانه در یک جا.
          </p>
        </aside>

        {/* بخش راست: فرم */}
        <section className="p-7 sm:p-12">
          <h2 className="text-2xl font-black">{title}</h2>

          {/* تب آموزگار / والد */}
          {mode === 'login' && (
            <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => changeRole('teacher')}
                className={`rounded-xl py-3 font-bold ${
                  role === 'teacher'
                    ? 'bg-white text-cyan-700'
                    : 'text-slate-500'
                }`}
              >
                آموزگار
              </button>
              <button
                type="button"
                onClick={() => changeRole('parent')}
                className={`rounded-xl py-3 font-bold ${
                  role === 'parent'
                    ? 'bg-white text-cyan-700'
                    : 'text-slate-500'
                }`}
              >
                والد
              </button>
            </div>
          )}

          {/* فرم */}
          <form onSubmit={submit} className="mt-6 space-y-4">
            {/* فیلد نام (فقط در ثبت‌نام آموزگار) */}
            {mode === 'register' && role === 'teacher' && (
              <label className="block text-sm font-bold">
                نام و نام خانوادگی
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حسن صغیر"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-600"
                  required
                />
              </label>
            )}

            {/* فیلد کد ملی */}
            <label className="block text-sm font-bold">
              {role === 'teacher'
                ? 'کد ملی آموزگار'
                : 'کد ملی دانش‌آموز'}
              <input
                value={nationalCode}
                onChange={(e) =>
                  setNationalCode(
                    e.target.value.replace(/[^0-9۰-۹]/g, '').slice(0, 10)
                  )
                }
                placeholder="۱۰ رقم"
                inputMode="numeric"
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-600"
                required
              />
            </label>

            {/* فیلد رمز (فقط برای آموزگار) */}
            {role === 'teacher' && (
              <label className="block text-sm font-bold">
                رمز عبور
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-12 w-full rounded-xl border border-slate-200 py-2 pe-12 ps-4 font-normal"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-1 flex w-11 items-center justify-center text-slate-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>
            )}

            {/* پیام خطا */}
            {error && (
              <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                {error}
              </p>
            )}

            {/* پیام موفقیت */}
            {success && (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                {success}
              </p>
            )}

            {/* دکمه ارسال */}
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-[#0e7490] font-bold text-white disabled:opacity-50"
            >
              {buttonText}
            </button>
          </form>

          {/* دکمه‌های پایین (فقط برای آموزگار) */}
          {role === 'teacher' && (
            <div className="mt-5 space-y-3">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccess('');
                  }}
                  className="min-h-11 w-full rounded-xl border border-cyan-700 font-bold text-cyan-700"
                >
                  ایجاد حساب آموزگار
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="min-h-11 w-full rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  بازگشت به ورود
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}