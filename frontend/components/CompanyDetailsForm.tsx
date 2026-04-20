"use client";

import { FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export type FormData = {
  company_website_url: string;
  company_name: string;
  job_description: string;
  resume: FileList;
};

interface CompanyDetailsFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

type Step = 1 | 2 | 3;

const CompanyDetailsForm: FC<CompanyDetailsFormProps> = ({ defaultValues, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ defaultValues });

  const [step, setStep] = useState<Step>(1);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, onChange: registerOnChange, ...registerRest } = register("resume", {
    required: "Please upload your resume",
  });

  async function advanceTo(next: Step, fields: ("company_website_url" | "company_name" | "job_description")[]) {
    const valid = await trigger(fields);
    if (valid) setStep(next);
  }

  function advanceOnResumeUpload(file: File) {
    setFileName(file.name);
    setTimeout(() => setStep(3), 50);
  }

  const websiteValue = getValues("company_website_url");
  const companyNameValue = getValues("company_name");
  const jdValue = getValues("job_description");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">

      {/* ── STEP 1 — Company details ── */}
      {step === 1 ? (
        <div className="bg-white rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1c1917] p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-purple-800 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">1</span>
            <span className="text-xl md:text-2xl font-bold text-stone-800">Company Details</span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="company_website_url" className="block text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">
                Website URL
              </label>
              <input
                id="company_website_url"
                type="url"
                placeholder="https://www.company.com/"
                autoFocus
                className="w-full rounded-xl border-2 border-stone-300 bg-amber-50 py-3 px-5 text-base md:text-lg font-medium text-gray-700 outline-none focus:border-purple-600 focus:bg-white transition-colors"
                {...register("company_website_url", { required: "Company website is required" })}
              />
              {errors.company_website_url && (
                <p className="mt-1.5 text-red-700 text-sm font-medium">{errors.company_website_url.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                placeholder="e.g. Acme Corp"
                className="w-full rounded-xl border-2 border-stone-300 bg-amber-50 py-3 px-5 text-base md:text-lg font-medium text-gray-700 outline-none focus:border-purple-600 focus:bg-white transition-colors"
                {...register("company_name", { required: "Company name is required" })}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); advanceTo(2, ["company_website_url", "company_name"]); } }}
              />
              {errors.company_name && (
                <p className="mt-1.5 text-red-700 text-sm font-medium">{errors.company_name.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={() => advanceTo(2, ["company_website_url", "company_name"])}
              className="px-6 py-2.5 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-xl text-base font-bold shadow-[3px_3px_0px_#1c1917] hover:bg-purple-900 hover:shadow-[1px_1px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Continue →
            </button>
          </div>
        </div>
      ) : (
        <DoneCard
          step={1}
          label="Company Details"
          value={`${companyNameValue} — ${websiteValue}`}
          onEdit={() => setStep(1)}
        />
      )}

      {/* ── STEP 2 — Job Description ── */}
      {step >= 2 && (
        step === 2 ? (
          <div className="bg-white rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1c1917] p-6 md:p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full bg-purple-800 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">2</span>
              <label htmlFor="job_description" className="text-xl md:text-2xl font-bold text-stone-800">
                Job Description
              </label>
            </div>
            <textarea
              id="job_description"
              rows={9}
              autoFocus
              placeholder="Paste the full job description here"
              className="w-full resize-y rounded-xl border-2 border-stone-300 bg-amber-50 py-3 px-5 text-base md:text-lg font-medium text-gray-700 outline-none focus:border-purple-600 focus:bg-white transition-colors"
              {...register("job_description", { required: "Job description is required" })}
            />
            {errors.job_description && (
              <p className="mt-2 text-red-700 text-sm font-medium">{errors.job_description.message}</p>
            )}
            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => advanceTo(3, ["job_description"])}
                className="px-6 py-2.5 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-xl text-base font-bold shadow-[3px_3px_0px_#1c1917] hover:bg-purple-900 hover:shadow-[1px_1px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        ) : (
          <DoneCard
            step={2}
            label="Job Description"
            value={jdValue ? jdValue.slice(0, 80) + (jdValue.length > 80 ? "…" : "") : ""}
            onEdit={() => setStep(2)}
          />
        )
      )}

      {/* ── STEP 3 — Resume ── */}
      {step >= 3 && (
        <div className="bg-white rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1c1917] p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-purple-800 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">3</span>
            <label htmlFor="resume" className="text-xl md:text-2xl font-bold text-stone-800">
              Resume / CV
            </label>
          </div>
          <div
            className={`w-full rounded-xl border-2 border-dashed py-10 px-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              fileName
                ? "border-purple-600 bg-purple-50"
                : "border-stone-400 bg-amber-50 hover:border-purple-500 hover:bg-white"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {fileName ? (
              <>
                <svg className="w-8 h-8 text-purple-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-purple-800 font-bold text-lg">{fileName}</p>
                <p className="text-purple-500 text-sm mt-1">Click to change</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-stone-600 text-lg font-semibold">Click to upload your resume</p>
                <p className="text-stone-400 text-sm mt-1">PDF or DOCX — max 5MB</p>
              </>
            )}
          </div>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            {...registerRest}
            ref={(e) => { registerRef(e); fileInputRef.current = e; }}
            onChange={(e) => {
              registerOnChange(e);
              const file = e.target.files?.[0];
              if (file) advanceOnResumeUpload(file);
              else setFileName("");
            }}
          />
          {errors.resume && (
            <p className="mt-2 text-red-700 text-sm font-medium">{errors.resume.message as string}</p>
          )}

          {fileName && (
            <div className="flex justify-end mt-6 animate-fade-in">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-xl font-bold shadow-[4px_4px_0px_#1c1917] hover:bg-purple-900 hover:shadow-[2px_2px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Generate Cover Letter →
              </button>
            </div>
          )}
        </div>
      )}

    </form>
  );
};

interface DoneCardProps {
  step: number;
  label: string;
  value: string;
  onEdit: () => void;
}

const DoneCard: FC<DoneCardProps> = ({ step, label, value, onEdit }) => (
  <div className="bg-amber-50 rounded-2xl border-2 border-stone-300 px-6 py-4 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-7 h-7 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
        ✓
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-stone-700 truncate">{value}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onEdit}
      className="text-xs font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 shrink-0 transition-colors"
    >
      Edit
    </button>
  </div>
);

export default CompanyDetailsForm;
