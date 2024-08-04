import React from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Navbar />

      <main className="flex flex-col items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24">
            <Image
              src="/logo-test.png"
              alt="Small Logo"
              width={96}
              height={96}
            />
          </div>
          <h1 className="text-3xl font-bold">God exists</h1>
          <p className="text-center max-w-md">Description of your homepage.</p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}