'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
  value: string;
  set: (v: string) => void;
  label?: string;
  test?: string;
};

export default function PasswordInput({
  value,
  set,
  label = 'رمز عبور',
  test = 'password',
}: PasswordInputProps) {
  const [shown, setShown] = useState(false);

  return (
    <label className="block text-sm font-bold">
      {label}
      <div className="relative mt-2">
        <input
          data-testid={test}
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => set(e.target.value)}
          className="min-h-12 w-full rounded-xl border border-slate-200 py-2 pe-12 ps-4 font-normal"
        />
        <button
          data-testid={`${test}-toggle`}
          type="button"
          onClick={() => setShown(!shown)}
          className="absolute inset-y-0 left-1 flex w-11 items-center justify-center text-slate-500"
        >
          {shown ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </label>
  );
}