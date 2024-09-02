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
        </div>
      </div>
    </nav>
  );
}
