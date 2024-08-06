import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-purple-900 shadow-md w-full">
      <div className="mx-auto px-6 md:px-8 lg:px-10 py-6 lg:py-8">
        <div className="flex items-center space-x-6">
              <Image
                className="sm:scale-100 md:scale-125 lg:scale-150"
                src="/feather_yellow.png"
                alt="small logo feather yellow"
                width={30}
                height={30}
              />
            <div className="md:flex space-x-4 text-amber-400 text-center">
              <a href="">Home</a>
            </div>
            <div className="md:flex space-x-4 text-amber-400 text-center">
              <a href="">About</a>
            </div>
        </div>
      </div>
    </nav>
  );
}
