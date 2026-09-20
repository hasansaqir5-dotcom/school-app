'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

type Role = 'teacher' | 'parent';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('teacher');
  const [creating, setCreating] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [recoveryNote, setRecoveryNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name,
          password: role === 'teacher' ? password : undefined,
          nationalCode: role === 'parent' ? code : undefined,
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

  return (
    <main className="min-h-screen bg-cyan-50 p-4 py-10">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-xl lg:grid-cols-2">
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

        <section className="p-7 sm:p-12">
          <h2 className="text-2xl font-black">
            {creating ? 'ایجاد حساب آموزگار' : 'ورود به سامانه'}
          </h2>

          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setCreating(false);
                setError('');
                setName('');
                setPassword('');
                setCode('');
              }}
              className={`rounded-xl py-3 font-bold ${
                role === 'teacher' ? 'bg-white text-cyan-700' : 'text-slate-500'
              }`}
            >
              آموزگار
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('parent');
                setCreating(false);
                setError('');
                setName('');
                setPassword('');
                setCode('');
              }}
              className={`rounded-xl py-3 font-bold ${
                role === 'parent' ? 'bg-white text-cyan-700' : 'text-slate-500'
              }`}
            >
              والد
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              {role === 'teacher'
                ? 'نام کاربری'
                : 'نام و نام خانوادگی دانش‌آموز'}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === 'teacher' ? 'نام کاربری' : 'مثال: علی احمدی'
                }
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-600"
                required
              />
            </label>

            {role === 'teacher' ? (
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
            ) : (
              <label className="block text-sm font-bold">
                کد ملی دانش‌آموز
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="۱۰ رقم"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal"
                  required
                />
              </label>
            )}

            {error && (
              <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-[#0e7490] font-bold text-white disabled:opacity-50"
            >
              {loading ? 'در حال ورود...' : 'ورود به سامانه'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}