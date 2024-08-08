import React from 'react';
import Image, { StaticImageData } from "next/image";

interface NavbarProps {
  logoImage: StaticImageData;
}


export default function Navbar({logoImage}: NavbarProps) {

  return (
    // <nav className="sticky top-0 z-50 bg-purple-900 shadow-md w-full">
    //   <div className="mx-auto px-6 md:px-8 lg:px-10 py-6 lg:py-8">
    //     <div className="flex items-center space-x-6">
    //           <Image
    //             className="sm:scale-100 md:scale-125 lg:scale-150"
    //             src="/feather_yellow.png"
    //             alt="small logo feather yellow"
    //             width={30}
    //             height={30}
    //           />
    //         <div className="md:flex space-x-4 text-amber-400 text-center">
    //           <a href="">Home</a>
    //         </div>
    //         <div className="md:flex space-x-4 text-amber-400 text-center">
    //           <a href="">About</a>
    //         </div>
    //     </div>
    //   </div>
    // </nav>
    <nav className="bg-purple-900 sticky top-0 z-50 w-full text-amber-300">
      <div className="container max-w-full mr-auto px-6 md:px-8 lg:px-10 py-5 lg:py-6 md:flex items-center gap-6">
        {/* <!-- Logo --> */}
        <div className="flex items-center justify-between md:w-auto w-full">
          <Image
            className="lg:w-14"
            src={logoImage}
            alt="small logo feather yellow"
            width={45}
            height={45}
          />
          {/* <!-- Mobile Menu Button --> */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
              >
                <title>bars-3-bottom-left</title>
                <g fill="none">
                  <path
                    d="M2.5 5h18.5 M2.5 12h18.5 M2.5 19h18.5"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        {/* <!-- Primary Navigation --> */}
        <div className="hidden md:flex md:flex-row flex-col items-center justify-start space-x-1 lg:space-x-3 navigation-menu pb-3 md:pb-0 text-3xl lg:text-4xl font-Kanit">
          <a href="#" className="py-2 px-3 block">
            Home
          </a>
          <a href="#" className="py-2 px-3 block">
            About
          </a>
          <a href="#" className="py-2 px-3 block">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
