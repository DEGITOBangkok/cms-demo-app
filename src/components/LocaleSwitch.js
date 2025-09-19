"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "../../i18n/navigation";
import { useLocale as useNextIntlLocale } from "next-intl";

const LocaleSwitch = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useNextIntlLocale();

  const handleLocaleSelect = (localeCode, string) => {
    if (localeCode !== currentLocale) {
      startTransition(() => {
        router.replace(pathname, { locale: localeCode });
      });
    }
  };

  return (
    <div className="flex items-center gap-[10px]">
      <button
        onClick={() => handleLocaleSelect("th")}
        className={`relative px-2 py-1 group  ${
          currentLocale === "th" ? "text-red-600" : "text-black"
        }`}
      >
        <span className="relative z-10 group-hover:text-red-600 transition-colors">
          TH
        </span>
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-red-600 group-hover:w-full transition-all duration-300"></span>
      </button>

      <span>|</span>

      <button
        onClick={() => handleLocaleSelect("en")}
        className={`relative px-2 py-1 group cursor-pointer ${
          currentLocale === "en" ? "text-red-600" : "text-black"
        }`}
      >
        <span className="relative z-10 group-hover:text-red-600 transition-colors">
          EN
        </span>
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-red-600 group-hover:w-full transition-all duration-300"></span>
      </button>
    </div>
  );
};

export default LocaleSwitch;