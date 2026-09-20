type BoxProps = {
  title: string;
  children: React.ReactNode;
};

export default function Box({ title, children }: BoxProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </section>
  );
}