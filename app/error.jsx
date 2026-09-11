"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => { console.error("Application error:", error); }, [error]);
  return (
    <main dir="auto" className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-16 text-[var(--foreground)]">
      <section className="w-full max-w-xl rounded-[28px] border border-[#c9a34a]/35 bg-black/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#c9a34a] bg-[#c9a34a]/10 text-4xl font-bold text-[#c9a34a]">!</div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#c9a34a]">WasetTravel</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 leading-7 opacity-75">We could not complete this request. Please try again or return to the homepage.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => reset()} className="min-h-12 rounded-xl bg-[#c9a34a] px-7 py-3 font-bold text-white transition hover:bg-[#b5892e] focus:outline-none focus:ring-4 focus:ring-[#c9a34a]/30">Try again</button><a href="/en" className="min-h-12 rounded-xl border border-[#c9a34a] px-7 py-3 font-bold text-[#c9a34a] transition hover:bg-[#c9a34a]/10">Back to home</a></div>
      </section>
    </main>
  );
}
