const symbols = ["𓂀", "𓋹", "𓆣", "𓇼", "𓊹", "𓎟"];

export default function StatusPage({ code, title, description, actionHref = "/en", actionLabel = "Back to home", loading = false }) {
  return (
    <main dir="auto" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-16 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        {symbols.map((symbol, index) => <span key={`${symbol}-${index}`} className="status-symbol absolute text-5xl text-[#c9a34a]" style={{ top: `${12 + index * 14}%`, left: `${8 + ((index * 17) % 84)}%`, animationDelay: `${index * 0.45}s` }}>{symbol}</span>)}
      </div>
      <section className="relative z-10 w-full max-w-xl rounded-[28px] border border-[#c9a34a]/35 bg-black/10 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#c9a34a] bg-[#c9a34a]/10 text-4xl font-bold text-[#c9a34a] shadow-[0_0_30px_rgba(201,163,74,0.25)]">{loading ? <span className="status-spinner" aria-hidden="true" /> : code}</div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#c9a34a]">WasetTravel</p>
        <h1 className="text-3xl font-extrabold tracking-wide sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 opacity-75">{description}</p>
        {!loading && <a href={actionHref} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#c9a34a] px-7 py-3 font-bold text-white shadow-lg transition hover:bg-[#b5892e] focus:outline-none focus:ring-4 focus:ring-[#c9a34a]/30">{actionLabel}</a>}
      </section>
    </main>
  );
}
