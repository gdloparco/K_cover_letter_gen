"use client";
import Image, { StaticImageData } from "next/image";

interface NavbarProps {
  logoImage: StaticImageData;
}


export default function PlainNavbar({logoImage}: NavbarProps) {

  return (
    <nav className="bg-purple-900 sticky top-0 left-0 z-50 w-full text-amber-300 shadow-2xl font-Kanit">
      <div className="md:px-10 py-4 px-7 md:flex justify-between items-center">
        <div className="flex items-center justify-between md:w-auto w-full">
            <Image
              className="lg:w-14"
              src={logoImage}
              alt="small logo feather yellow"
              width={45}
              height={45}
            />
        </div>
      </div>
    </nav>
  );
}
