import React from "react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-8"
                src="../logo-test.png"
                alt="Logo"
              />
            </div>
            <div className="md:flex space-x-4">
              <h1>1</h1>
            </div>
            <div className="md:flex space-x-4">
              <h1>4</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
