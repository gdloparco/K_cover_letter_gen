import Navbar from "@/components/Navbar";
import React from "react";
import logoYellow from "@/public/feather_yellow.png";
import Link from "next/link";

export default function About() {
  return (
    <div>
      <Navbar logoImage={logoYellow} />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-center font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <h3 className="px-20 md:px-20 lg:px-36 my-8 text-center text-3xl md:text-5xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
            About
          </h3>
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <p className="px-10 md:px-20 lg:px-36 mb-6 text-justify text-xl md:text-2xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto leading-7 md:leading-10">
                As a <b>Software Developer</b> passionate about efficiency and
                modern technologies, I created Kate — a Cover Letter Assembler
                that shows my dedication to improving processes. The idea for
                Kate came from my frustration with{" "}
                <b>job applications consuming too much of my coding time</b>. I
                wanted to optimize my time management, so I turned this problem
                into a project.
              </p>
              <p className="px-10 md:px-20 lg:px-36 mb-6 text-justify text-xl md:text-2xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto leading-7 md:leading-10">
                Kate is <b>fully containerised</b> and its development allowed
                me to learn more about the use of Docker. It also provided an
                opportunity to expand my Frontend skills, leveraging{" "}
                <b>React, Tailwind and TypeScript</b> to build a responsive and intuitive
                UI.
              </p>
              <p className="px-10 md:px-20 lg:px-36 mb-6 text-justify text-xl md:text-2xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto leading-7 md:leading-10">
                For now Kate is tailored to my journey, but by integrating a
                Large Language Model API and a PostgreSQL database, I've created
                a system that's not only efficient but also{" "}
                <b>quickly adaptable for wider use</b>.
              </p>
              <p className="px-10 md:px-20 lg:px-36 mb-6 text-justify text-xl md:text-2xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto leading-7 md:leading-10">
                This project reflects my belief that technology should make our
                lives easier, allowing us to{" "}
                <b>focus on what's truly important</b>.
              </p>
            </div>
            <Link href="/assembler">
              <button className="px-6 py-2 my-6 lg:py-3 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-xl md:text-2xl lg:text-3xl shadow-lg hover:bg-purple-900 transition-all duration-500 ease-in md:static md:z-auto">
                Get faster, with Kate.
              </button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
