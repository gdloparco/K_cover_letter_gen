"use client";

import CompanyDetailsForm, { type FormData } from "@/components/CompanyDetailsForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import FeatherIcon from "@/components/FeatherIcon";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitCoverLetterRequest } from "@/utils/send-company-data";

export default function Assembler() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await submitCoverLetterRequest(data);
      // Store the user-provided company name as a reliable fallback for the result page
      const resultWithFallback = {
        ...result,
        _company_name_fallback: data.company_name,
      };
      sessionStorage.setItem("coverLetterResult", JSON.stringify(resultWithFallback));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-svh bg-amber-300 font-Kanit">
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b-2 border-stone-800">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <FeatherIcon size={28} />
          <span className="text-2xl font-bold text-purple-900">Kate</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 md:py-14">
        {/* Page title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
            Build your cover letter
          </h1>
          <p className="text-stone-600 text-base md:text-lg">
            Three inputs. One handcrafted letter.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 text-red-800 rounded-xl font-medium">
            {error}
          </div>
        )}

        <CompanyDetailsForm onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}
