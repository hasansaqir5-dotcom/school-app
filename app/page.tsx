'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'teacher') {
          router.push('/teacher');
          return;
        }
        if (user.role === 'parent') {
          router.push('/parent');
          return;
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    router.push('/login');
  }, [router]);

  return (
    <main className="min-h-screen bg-cyan-50 flex items-center justify-center">
      <p className="text-cyan-800 font-bold">در حال هدایت...</p>
    </main>
  );
}