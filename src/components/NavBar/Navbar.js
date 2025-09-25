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
  const { locale } = useParams();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <nav
        className="flex items-center justify-between bg-white h-[96px] w-full px-4 md:px-8 lg:px-16 fixed top-0 left-0 z-50"
      >
        {/* Logo */}
        <div>
          <img
            src="/images/nav_logo.png"
            alt="Logo"
            width={266}
            height={30}
            className="object-contain"
            onClick={() => router.push(`/${locale}/`)}
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
          <button onClick={() => setIsOpen(!isOpen)} className="relative z-50">
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
