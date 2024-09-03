import Navbar from "../../components/Navbar";
import React from "react";
import logoYellow from "../../public/feather_yellow.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'


export default function Contact() {
  return (
    <div>
      <Navbar logoImage={logoYellow} />
      <div className="bg-amber-300 min-h-svh flex flex-col items-center justify-start font-Kanit">
        <main className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="md:py-5 lg:py-10">
              <div className="flex flex-col items-center justify-center py-10 gap-8">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                  Interested in this project?
                </p>
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                  Get in touch!
                </p>
              </div>
              <div className="flex flex-row items-center justify-center py-10 gap-4">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                  LinkedIn
                </p>
                <a href="https://www.linkedin.com/in/dom-loparco/">
                  <FontAwesomeIcon 
                    icon={faLinkedin} 
                    style={{color: "#0a66c2",}}
                    width={50}
                    height={50}
                  />
                </a>
              </div>
              <div className="flex flex-row items-center justify-center py-10 gap-4">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800">
                  gdloparco.com
                </p>
                <a href="https://www.gdloparco.com/">
                  <Image 
                    src={'../../public/website-logo.png'}
                    // BROKEN HERE ABOVE FOR LINK
                    alt="small dom website logo"
                    width={50}
                    height={50}
                  />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
