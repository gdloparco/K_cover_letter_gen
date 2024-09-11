import Navbar from "../../components/Navbar";
import ContactForm from "../../components/ContactForm";
import React from "react";
import logoYellow from "../../public/feather_yellow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faSquareGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function Contact() {
  return (
    <div>
      <Navbar logoImage={logoYellow} />
      <div className="bg-amber-300 min-h-svh flex flex-col font-Kanit">
        <main className="flex flex-col items-center py-10">
          <div className="md:py-5 lg:py-10 md:mb-6 w-full transition-all duration-500 ease-in md:static md:z-auto">
            <div className="flex flex-col items-center justify-center py-10 gap-8">
              <p className="text-center text-2xl md:text-3xl lg:text-4xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
                Interested in this project?
              </p>
              <p className="text-center text-2xl md:text-3xl lg:text-4xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
                Get in touch!
              </p>
            </div>
            <div className="flex flex-col md:flex-row px-20 py-4 md:gap-4 justify-between md:justify-around w-full">
              <div className="flex flex-row items-center justify-center py-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-500 ease-in md:static md:z-auto">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
                  LinkedIn
                </p>
                <a href="https://www.linkedin.com/in/dom-loparco/">
                  <FontAwesomeIcon
                    className="md:scale-125 lg:scale-150"
                    icon={faLinkedin}
                    style={{ color: "#0a66c2" }}
                    width={35}
                    height={35}
                  />
                </a>
              </div>
              <div className="flex flex-row items-center justify-center py-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-500 ease-in md:static md:z-auto">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
                  gdloparco.com
                </p>
                <a href="https://www.gdloparco.com/">
                  <Image
                    className="md:scale-125 lg:scale-150"
                    src="/website-logo.png"
                    alt="small dom website logo"
                    width={35}
                    height={35}
                  />
                </a>
              </div>
              <div className="flex flex-row items-center justify-center py-4 gap-4 md:gap-6 lg:gap-8 transition-all duration-500 ease-in md:static md:z-auto">
                <p className="text-center text-xl md:text-2xl lg:text-3xl max-w-max text-stone-800 transition-all duration-500 ease-in md:static md:z-auto">
                  GitHub
                </p>
                <a href="https://github.com/gdloparco/">
                  <FontAwesomeIcon
                    className="md:scale-125 lg:scale-150"
                    icon={faSquareGithub}
                    style={{ color: "#000000" }}
                    width={35}
                    height={35}
                  />
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </main>
      </div>
    </div>
  );
}
