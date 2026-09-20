type EmptyProps = {
  text: string;
};

export default function Empty({ text }: EmptyProps) {
  return (
    <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}