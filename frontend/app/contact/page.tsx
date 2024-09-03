import Navbar from "../../components/Navbar";
import React from "react";
import logoYellow from "../../public/feather_yellow.png";
import Image from 'next/image'

export default function Jdforms() {
  return (
    <div>
      <Navbar logoImage={logoYellow} />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-start font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <p className="px-20 lg:px-52 text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                Interested in my project?
              </p>
              <p className="px-20 lg:px-52 text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                Get in touch!
              </p>
              <div>
                <p className="px-20 lg:px-52 text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                  LinkedIn
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
