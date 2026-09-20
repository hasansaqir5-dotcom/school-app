type SelectProps = {
  label: string;
  value: string;
  set: (v: string) => void;
  options: { value: string; label: string }[];
  test: string;
};

export default function Select({
  label,
  value,
  set,
  options,
  test,
}: SelectProps) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <select
        data-testid={test}
        value={value}
        onChange={(e) => set(e.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}