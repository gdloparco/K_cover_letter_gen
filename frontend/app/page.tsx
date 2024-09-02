import React from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";
import logoYellow from '../public/feather_yellow.png'
import logoPurple from '../public/feather_purple.png'

export default function Home() {
  return (
    <div>
      <Navbar logoImage={logoYellow}/>
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-center font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <Image
                className="md:scale-125 lg:scale-150 mb-2"
                src={logoPurple}
                alt="small logo feather purple"
                width={90}
                height={90}
              />
            </div>
            <div className="flex flex-col items-center space-y-10 lg:space-y-16">
              <h1 className=" font-semibold text-6xl md:text-7xl lg:text-8xl text-purple-800">Kate</h1>
              <p className="px-20 lg:px-52 text-center text-xl md:text-2xl max-w-max text-stone-800">Crafting the perfect cover letter can be a time-consuming and daunting task, especially when applying to multiple job openings.</p>
              <p className="px-20 lg:px-52 text-center text-xl md:text-2xl max-w-max text-stone-800">Kate is a user-friendly Cover Letter Generator that simplifies the process, allowing you to quickly generate personalized cover letters tailored to each job description, based on your preferences.</p>
              <button className="px-6 py-2 lg:py-3 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-2xl md:text-3xl shadow-lg hover:bg-purple-900">
                Start Here
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 