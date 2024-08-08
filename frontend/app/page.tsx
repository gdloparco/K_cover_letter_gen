import React from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-center font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <Image
                className="sm:scale-100 md:scale-125 lg:scale-150 mb-2"
                src="/feather_purple.png"
                alt="small logo feather purple"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col items-center space-y-10 lg:space-y-16">
              <h1 className="text-7xl lg:text-8xl text-purple-800">K</h1>
              <p className="text-center text-2xl md:text-3xl lg:text-4xl max-w-md">Cover Letter Generator</p>
              <button className="px-7 py-3 lg:px-9 lg:py-5 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-2xl md:text-3xl lg:text-4xl shadow-lg hover:bg-purple-900">
                Start Here
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 