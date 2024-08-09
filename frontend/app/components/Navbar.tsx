"use client";
import React, { useState } from 'react';
import Image, { StaticImageData } from "next/image";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'

interface NavbarProps {
  logoImage: StaticImageData;
}


export default function Navbar({logoImage}: NavbarProps) {

  let Links =[
    {name: 'Home', link: '/'},
    {name: 'About', link: '/'},
    {name: 'Contact', link: '/'},
  ]

  let [isOpen, setisOpen] = useState(false)

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
    <nav className="bg-purple-900 sticky top-0 left-0 z-50 w-full text-amber-300 shadow-2xl font-Kanit">
      <div className="md:px-10 py-4 px-7 md:flex justify-between items-center">

        {/* Logo  */}

        <div className="flex items-center justify-between md:w-auto w-full">
          <Image
            className="lg:w-14"
            src={logoImage}
            alt="small logo feather yellow"
            width={45}
            height={45}
          />

        {/* Mobile Menu Icon  */}

        <div onClick={() => setisOpen(!isOpen)} className='w-9 h-9 absolute right-8 top-6 cursor-pointer md:hidden'>
          {
            isOpen ? <XMarkIcon/> : <Bars3Icon/>
          }
        </div>


        {/* Nav Links  */}

        <ul className={`
          text-xl lg:text-2xl md:flex md:items-center pb-0 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in bg-purple-900
          ${isOpen ? 'top-12' : 'top-[-350px]'}`}>
          {
            Links.map(link => (
            <li className='my-7 md:my-0 md:ml-8'>
              <a href='/'>{link.name}</a>
            </li>))
          }
        </ul>
 

          {/* <div className="md:hidden flex items-center">
            <button className="mobile-menu-button">

            md:flex pl-9 md:pl-10 lg:pl-16 text-xl lg:text-2xl md:items-center md:pb-0 pb-12 
          absolute md:z-auto z-[-1] left-0 w-full transition-all duration-500 ease-in bg-purple-900


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
        <div className="hidden md:flex md:flex-row flex-col items-center justify-start space-x-1 lg:space-x-3 navigation-menu pb-3 md:pb-0 text-3xl lg:text-4xl font-Kanit">
          <a href="#" className="py-2 px-3 block">
            Home
          </a>
          <a href="#" className="py-2 px-3 block">
            About
          </a>
          <a href="#" className="py-2 px-3 block">
            Contact
          </a> */}
        </div>
      </div>
    </nav>
  );
}
