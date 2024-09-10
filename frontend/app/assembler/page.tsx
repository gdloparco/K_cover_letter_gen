import Navbar from "../../components/Navbar";
import React from "react";
import logoYellow from "../../public/feather_yellow.png";

export default function Assembler() {
  return (
    <div>
      <Navbar logoImage={logoYellow} />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-center font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <p className="px-20 lg:px-52 text-center text-xl md:text-2xl max-w-max text-stone-800">
                Something happens here.
              </p>
              <button className="px-6 py-2 lg:py-3 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-2xl md:text-3xl shadow-lg hover:bg-purple-900">
                Submit Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
