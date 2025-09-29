/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import React, { useState, useEffect } from "react";
import { MENUS } from "@/lib/const";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitch";
import Hamburger from "./Hamburger";

export default function Navbar() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [locale, setLocale] = useState('en');

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    if (params?.locale) {
      setLocale(params.locale);
    }
  }, [params]);

  // lock scroll when mobile menu open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isClient) {
    return (
      <nav className="flex items-center justify-between bg-white/70 backdrop-blur-lg w-full px-4 md:px-8 lg:px-16 py-4 fixed top-0 left-0 z-50">
        <div>
          <img
            src="/images/nav_logo.png"
            alt="Logo"
            className="object-contain lg:w-[266px] md:w-[266px] w-[142px] sm:w-[266px] py-4"
          />
        </div>
        <div className="hidden lg:flex flex-row gap-10 items-center text-black">
          <a
            title="News & Articles"
            href="/en/newslist"
            className="px-2 py-1 relative group"
          >
            <span className="relative z-10 group-hover:text-[#E60000] transition-colors">
              News & Articles
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#E60000] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            title="Contact"
            href="/en/contact"
            className="px-2 py-1 relative group"
          >
            <span className="relative z-10 group-hover:text-[#E60000] transition-colors">
              Contact
            </span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#E60000] group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
        <div className="lg:hidden relative z-50">
          <button className="relative z-50">
            <Hamburger state="default" />
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
     <nav className="flex items-center justify-between bg-white/70 backdrop-blur-lg w-full px-4 md:px-8 lg:px-16 py-4 fixed top-0 left-0 z-50">

        {/* Logo */}
        <div>
          <img
            src="/images/nav_logo.png"
            alt="Logo"
            className="object-contain lg:w-[266px] md:w-[266px] w-[142px] sm:w-[266px] py-4"
            onClick={() => isClient && router.push(`/${locale}/`)}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-row gap-10 items-center text-black">
          {MENUS.map((m) => (
            <a
              key={m.slug}
              title={t(m.titleKey)}
              href={`/${locale}/${m.slug}`}
              className="px-2 py-1 relative group"
            >
              <span className="relative z-10 group-hover:text-[#E60000] transition-colors">
                {t(m.titleKey)}
              </span>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#E60000] group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
          <LocaleSwitcher />
        </div>

        {/* Mobile & Tablet Hamburger */}
        <div className="lg:hidden relative z-50">
          <button onClick={() => isClient && setIsOpen(!isOpen)} className="relative z-50">
            <Hamburger state={isOpen ? "close" : "default"} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-[96px] left-0 w-full h-[calc(100%-96px)] bg-white z-40 flex flex-col justify-between overflow-y-auto lg:hidden">
          {/* Menu items */}
          <div className="flex flex-col items-start px-4 pt-4">
            {MENUS.map((m) => (
              <a
                key={m.slug}
                title={t(m.titleKey)}
                href={`/${locale}/${m.slug}`}
                className="w-full py-4 text-[16px] text-black hover:text-[#E60000] border-b-2"
              >
                {t(m.titleKey)}
              </a>
            ))}
          </div>

          {/* LocaleSwitcher at bottom */}
          <div className="py-4 flex justify-center">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
