import type { FormData as CoverLetterFormData } from "@/components/CompanyDetailsForm";

export async function submitCoverLetterRequest(
  data: CoverLetterFormData
): Promise<Record<string, unknown>> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8083";

  const form = new FormData();
  form.append("company_website_url", data.company_website_url);
  form.append("company_name", data.company_name ?? "");
  form.append("job_description", data.job_description);

  const resumeFile = data.resume?.[0];
  if (resumeFile) {
    form.append("resume", resumeFile, resumeFile.name);
  }

  const res = await fetch(`${backendUrl}/formdata/cover-letter`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }

  return res.json();
}
