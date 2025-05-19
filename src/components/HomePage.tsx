"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/HomePage/Navbar";
import HeroSection from "@/components/layout/HomePage/HeroSection";
import HowItWorks from "@/components/layout/HomePage/HowItWorks";
import CtaSection from "@/components/layout/HomePage/CTASection";
import Footer from "@/components/layout/HomePage/Footer";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Safe to access localStorage inside useEffect
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);

    const newTheme = newIsDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <HeroSection />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </div>
  );
}
