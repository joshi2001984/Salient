"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      gsap.to(headerRef.current, {
        backgroundColor: isScrolled ? "#ffffff" : "transparent",
        color: isScrolled ? "#000000" : "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(headerRef.current.querySelectorAll("a"), {
        color: isScrolled ? "#000000" : "#ffffff",
        duration: 0.3,
        stagger: 0.05,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.from(mobileMenuRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const navLinkClasses =
    "relative font-medium hover:text-orange-500 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-orange-500 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-transparent text-white"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 pt-7">
        {/* Logo */}
        <div className="flex items-center gap-3 mr-12">
          <Image
            src={scrolled ? "/salient.png" : "/logo.png"}
            alt="Company Logo"
            width={120}
            height={28}
            className="h-7 w-auto transition"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {["Home", "News", "Demos", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className={navLinkClasses}
              aria-current={item === "Home" ? "page" : undefined}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={`w-6 h-0.5 bg-current transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-current transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-current transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden bg-white text-black px-6 py-4 shadow-lg transition-all duration-300 ${
          menuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        {["Home", "News", "Demos", "Contact"].map((item) => (
          <a
            key={item}
            href="#"
            className="block py-3 hover:text-orange-500 transition-colors duration-300 border-b border-gray-100 last:border-0"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            {item}
          </a>
        ))}
      </div>
    </header>
  );
}

