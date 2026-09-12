export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/10 p-16 text-center dark:border-white/15">
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
        {title}
      </h2>
      <p className="text-sm text-zinc-500">Coming soon</p>
    </div>
  );
}
