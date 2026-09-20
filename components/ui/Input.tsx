type InputProps = {
  label: string;
  value: string;
  set: (v: string) => void;
  test: string;
  placeholder: string;
};

export default function Input({
  label,
  value,
  set,
  test,
  placeholder,
}: InputProps) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        data-testid={test}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-600"
      />
    </label>
  );
}