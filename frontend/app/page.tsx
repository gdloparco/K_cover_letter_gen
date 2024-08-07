import React from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-center">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="md:py-5 lg:py-10">
              <Image
                className="sm:scale-100 md:scale-125 lg:scale-150"
                src="/feather_purple.png"
                alt="small logo feather purple"
                width={100}
                height={100}
              />
            </div>
            <h1 className="text-7xl font-bold text-purple-800">K</h1>
            <p className="text-center max-w-md">Cover Letter Generator</p>
            <button className="px-7 py-3 border-1 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl shadow-lg hover:bg-purple-900">
              Start Here
            </button>
          </div>
        </main>
      </div>
    </div>
  );
} 