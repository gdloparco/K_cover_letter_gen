import CompanyDetailsForm from "@/components/CompanyDetailsForm";
import PlainNavbar from "@/components/PlainNavbar";
import logoYellow from "@/public/feather_yellow.png";
import React from "react";

export default function Assembler() {
  return (
    <div>
      <PlainNavbar logoImage={logoYellow}/>
      <main className="bg-amber-300 min-h-svh flex flex-col items-center font-Kanit">
          <div className="md:py-5 lg:py-10 md:mb-6 w-full transition-all duration-500 ease-in md:static md:z-auto">
            <CompanyDetailsForm />
          </div>
        </main>
    </div>
  );
}
