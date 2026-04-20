"use client";

import { useEffect, useState } from "react";
import FeatherIcon from "@/components/FeatherIcon";

const MESSAGES = [
  "Visiting the company website...",
  "Reading about the company culture...",
  "Extracting your CV details...",
  "Understanding the job description...",
  "Identifying company values...",
  "Matching your experience to the role...",
  "Picking the best paragraphs...",
  "Crafting your opening...",
  "Writing the middle bit...",
  "Polishing the closing lines...",
  "Running a spell check...",
  "Asking Monica to proofread it...",
  "Monica said it's great.",
  "Almost there...",
  "Promise, almost ready...",
  "Look, you are not even paying for this...",
  "Wait, where's my pen...",
  "George, can you get that phone please?",
  "Still going...",
  "It would have taken you longer to write it by hand anyway...",
  "Ok, here we are...",
];

const FINAL_INDEX = MESSAGES.length - 1;

export default function LoadingOverlay() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index >= FINAL_INDEX) return;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => Math.min(i + 1, FINAL_INDEX));
        setVisible(true);
      }, 350);
    }, 3000);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-300/95 backdrop-blur-sm">
      {/* Feather — always bouncing */}
      <div className="mb-10 animate-bounce">
        <FeatherIcon size={72} />
      </div>

      {/* Message */}
      <div className="h-14 flex items-center justify-center px-8">
        <p
          className={`text-xl md:text-2xl font-semibold text-purple-900 text-center transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {MESSAGES[index]}
        </p>
      </div>

      {/* Dots — always visible */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-purple-800 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
