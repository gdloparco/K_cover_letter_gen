"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CoverLetterOutput from "@/components/CoverLetterOutput";
import FeatherIcon from "@/components/FeatherIcon";
import Link from "next/link";

interface CoverLetterData {
  company_name: string;
  applicant_name: string;
  applicant_role: string;
  cover_letter_text: string;
  job_description_values?: string;
  website_values?: string;
  searched_links?: string[];
}

interface StoredResult {
  cover_letter: CoverLetterData;
  _company_name_fallback?: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("coverLetterResult");
    if (!raw) {
      setError("No cover letter found. Please go back and generate one.");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredResult;
      if (!parsed.cover_letter?.cover_letter_text) {
        setError("The response was missing cover letter content. Please try again.");
        return;
      }
      setResult(parsed);
    } catch {
      setError("Failed to parse the cover letter response. Please try again.");
    }
  }, []);

  function handleStartOver() {
    sessionStorage.removeItem("coverLetterResult");
    router.push("/assembler");
  }

  const cl = result?.cover_letter;
  // Use backend-resolved company name; fall back to what the user typed in the form
  const companyName = cl?.company_name || result?._company_name_fallback || "";

  return (
    <div className="min-h-svh bg-amber-300 font-Kanit">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b-2 border-stone-800">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <FeatherIcon size={28} />
          <span className="text-2xl font-bold text-purple-900">Kate</span>
        </Link>
        <button
          onClick={handleStartOver}
          className="text-sm font-semibold text-stone-700 hover:text-purple-800 underline underline-offset-2 transition-colors"
        >
          Generate another →
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14 pb-20">

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-6 mt-10">
            <div className="bg-red-50 border-2 border-red-400 text-red-800 rounded-2xl p-6 text-center max-w-lg font-medium">
              {error}
            </div>
            <Link href="/assembler">
              <button className="px-6 py-3 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-lg font-bold shadow-[4px_4px_0px_#1c1917] hover:bg-purple-900">
                ← Start Over
              </button>
            </Link>
          </div>
        )}

        {/* Success state */}
        {cl && (
          <>
            {/* Result header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-800 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-stone-800">
                <svg width="14" height="14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M54 4 C54 4 20 18 12 44 L20 40 C20 40 18 52 16 58 C16 58 26 46 30 38 C30 38 38 36 44 28 C50 20 54 4 54 4Z" fill="#fbbf24" />
                </svg>
                Handcrafted by Kate
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-1">
                Your Cover Letter
              </h1>
              <p className="text-stone-600 text-base md:text-lg">
                {companyName ? (
                  <>for <span className="font-semibold text-purple-900">{companyName}</span></>
                ) : null}
              </p>
            </div>

            <CoverLetterOutput
              coverLetterText={cl.cover_letter_text}
              applicantName={cl.applicant_name}
              companyName={companyName}
              applicantRole={cl.applicant_role}
              jobDescriptionValues={cl.job_description_values}
              websiteValues={cl.website_values}
              searchedLinks={cl.searched_links}
            />

            <div className="flex justify-center mt-12">
              <button
                onClick={handleStartOver}
                className="px-8 py-3 border-2 border-stone-800 bg-white text-stone-800 rounded-2xl text-lg font-bold shadow-[4px_4px_0px_#1c1917] hover:bg-amber-50 hover:shadow-[2px_2px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Generate Another →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
