"use client";

import { FC, useState } from "react";

interface CoverLetterOutputProps {
  coverLetterText: string;
  applicantName: string;
  companyName: string;
  applicantRole: string;
  jobDescriptionValues?: string;
  websiteValues?: string;
  searchedLinks?: string[];
}

const CoverLetterOutput: FC<CoverLetterOutputProps> = ({
  coverLetterText,
  applicantName,
  companyName,
  applicantRole,
  jobDescriptionValues,
  websiteValues,
  searchedLinks,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const hasInsights =
    (jobDescriptionValues && jobDescriptionValues.trim().length > 0) ||
    (websiteValues && websiteValues.trim().length > 0) ||
    (searchedLinks && searchedLinks.length > 0);

  async function handleCopy() {
    await navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadPDF() {
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 22;
    const marginY = 20;
    const contentWidth = pageWidth - marginX * 2;

    // ── Purple header band ──
    doc.setFillColor(88, 28, 135);
    doc.rect(0, 0, pageWidth, 38, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(251, 191, 36);
    doc.text(applicantName || "Cover Letter", marginX, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    const subText = [applicantRole, companyName].filter(Boolean).join("  ·  ");
    if (subText) doc.text(subText, marginX, 25);

    doc.setFontSize(8);
    doc.setTextColor(200, 160, 255);
    doc.text("crafted by Kate", pageWidth - marginX, 25, { align: "right" });

    // ── Body ──
    let cursorY = 38 + 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);

    const paragraphs = coverLetterText.split(/\n\s*\n/).filter((p) => p.trim());
    const lineHeight = 5.5;
    const paraSpacing = 4;

    for (const paragraph of paragraphs) {
      const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);
      const blockHeight = lines.length * lineHeight;

      if (cursorY + blockHeight > pageHeight - marginY) {
        doc.addPage();
        cursorY = marginY;
      }

      doc.text(lines, marginX, cursorY);
      cursorY += blockHeight + paraSpacing;
    }

    // ── Footer on each page ──
    const totalPages: number = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text(applicantName || "", marginX, pageHeight - 7);
      doc.text(`${p} / ${totalPages}`, pageWidth - marginX, pageHeight - 7, { align: "right" });
    }

    const safeCompany = (companyName || "company").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`cover_letter_${safeCompany}.pdf`);
  }

  return (
    <>
      <div className="w-full">
        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 mb-4">
          {hasInsights && (
            <button
              onClick={() => setShowSources(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-stone-800 bg-amber-100 text-stone-800 rounded-xl text-sm font-bold shadow-[3px_3px_0px_#1c1917] hover:bg-amber-200 hover:shadow-[1px_1px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
              Sources
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 border-2 border-stone-800 bg-white text-stone-800 rounded-xl text-sm font-bold shadow-[3px_3px_0px_#1c1917] hover:bg-amber-50 hover:shadow-[1px_1px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-xl text-sm font-bold shadow-[3px_3px_0px_#1c1917] hover:bg-purple-900 hover:shadow-[1px_1px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Cover letter card */}
        <div className="bg-white rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1c1917] p-8 md:p-12">
          <div className="mb-8 pb-6 border-b-2 border-stone-200">
            <p className="text-xl font-bold text-stone-800">{applicantName}</p>
            <p className="text-sm text-stone-500 font-medium mt-1">
              {[applicantRole, companyName].filter(Boolean).join(" — ")}
            </p>
          </div>

          <div className="font-Kanit text-stone-800 leading-relaxed space-y-5 text-base md:text-lg">
            {coverLetterText
              .split(/\n\s*\n/)
              .filter((p) => p.trim())
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph.trim()}</p>
              ))}
          </div>
        </div>
      </div>

      {/* Sources modal */}
      {showSources && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowSources(false)}
        >
          <div
            className="bg-white rounded-2xl border-2 border-stone-800 shadow-[6px_6px_0px_#1c1917] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-stone-200">
              <h2 className="text-xl font-bold text-stone-800">What Kate found</h2>
              <button
                onClick={() => setShowSources(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-stone-300 text-stone-500 hover:border-stone-800 hover:text-stone-800 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-6">
              {/* Job description values */}
              {jobDescriptionValues && jobDescriptionValues.trim() && (
                <section>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                    From the Job Description
                  </h3>
                  <div className="bg-amber-50 rounded-xl border border-stone-200 p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-mono">
                    {jobDescriptionValues.trim()}
                  </div>
                </section>
              )}

              {/* Website values */}
              {websiteValues && websiteValues.trim() && (
                <section>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                    From the Company Website
                  </h3>
                  <div className="bg-purple-50 rounded-xl border border-stone-200 p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-mono">
                    {websiteValues.trim()}
                  </div>
                </section>
              )}

              {/* Searched links */}
              {searchedLinks && searchedLinks.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                    Pages Visited ({searchedLinks.length})
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {searchedLinks.map((link, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-stone-400 shrink-0 mt-0.5">↗</span>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-700 hover:text-purple-900 underline underline-offset-2 break-all"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {!hasInsights && (
                <p className="text-stone-400 text-sm text-center py-4">
                  No additional data was captured for this run.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoverLetterOutput;
