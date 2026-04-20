import React from "react";
import Link from "next/link";
import FeatherIcon from "@/components/FeatherIcon";

const STEPS = [
  {
    num: "01",
    label: "Add company website",
    desc: "Kate visits the site and pulls out the values and culture that matter.",
  },
  {
    num: "02",
    label: "Paste the job description",
    desc: "The role requirements are extracted and matched to your experience.",
  },
  {
    num: "03",
    label: "Upload your CV",
    desc: "Your background becomes the foundation of a letter written just for this role.",
  },
];

export default function Home() {
  return (
    <div className="min-h-svh bg-amber-300 font-Kanit flex flex-col">
      {/* Thin top bar */}
      <header className="w-full px-8 py-4 flex items-center gap-3 border-b-2 border-stone-800">
        <FeatherIcon size={28} />
        <span className="text-xl font-bold text-purple-900 tracking-tight">Kate</span>
      </header>

      {/* Two-column hero — fills remaining height */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* LEFT — identity + CTA */}
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 lg:border-r-2 border-stone-800">
          {/* Big feather */}
          <div className="mb-8">
            <FeatherIcon size={80} />
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-purple-900 leading-none tracking-tight mb-6">
            Kate
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-stone-800 leading-snug mb-4">
            Handcrafted cover letters,<br />assembled in seconds.
          </p>

          <p className="text-base md:text-lg text-stone-600 max-w-md mb-10 leading-relaxed">
            Stop rewriting the same letter for every application.
            Give Kate the job description, the company website, and your CV —
            she'll do the rest.
          </p>

          <div>
            <Link href="/assembler">
              <button className="px-10 py-4 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-2xl font-bold shadow-[6px_6px_0px_#1c1917] hover:bg-purple-900 hover:shadow-[3px_3px_0px_#1c1917] hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                Start Here →
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT — step cards */}
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 gap-5">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
            How it works
          </p>
          {STEPS.map(({ num, label, desc }, i) => (
            <div
              key={num}
              className="bg-white rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1c1917] px-7 py-6"
              style={{ transform: `rotate(${i % 2 === 0 ? "-0.4deg" : "0.4deg"})` }}
            >
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                {num}
              </span>
              <p className="font-bold text-stone-800 text-lg mt-1">{label}</p>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
