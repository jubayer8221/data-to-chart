"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  {name: "Excel Converter", href: "/converter/execlToChart"},
  { name: "About", href: "/page/about" },
  { name: "Contact", href: "/page/contact" }
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#547792] text-white shadow-md w-full px-[100px]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold p-2 border rounded-lg hover:bg-[#94B4C1]">
          DFC
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-[#213448] transition-colors ${
                router.pathname === link.href
                  ? "text-blue-100 font-semibold"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-2 hover:bg-blue-800 transition-colors ${
                router.pathname === link.href ? "bg-blue-800 text-blue-100" : ""
              }`}
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
